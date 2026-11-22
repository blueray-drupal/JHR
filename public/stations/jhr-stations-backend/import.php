<?php

declare(strict_types=1);

use Drupal\Core\File\FileExists;
use Drupal\Core\File\FileSystemInterface;
use Symfony\Component\Yaml\Yaml;

(static function (): void {
  $apply = getenv('JHR_STATIONS_APPLY') === '1';
  $lock = \Drupal::lock();
  if ($apply && !$lock->acquire('jhr_stations_import', 900)) {
    throw new RuntimeException('A station import is already running.');
  }

  try {
    $readJson = static fn (string $name): array => json_decode(
      file_get_contents(__DIR__ . '/' . $name), TRUE, 512, JSON_THROW_ON_ERROR
    );
    $stations = $readJson('stations.json');
    $manifest = $readJson('file-manifest.json');

    $manager = \Drupal::entityTypeManager();
    foreach (['node', 'options', 'text', 'link', 'file', 'image', 'views', 'filter'] as $module) {
      if (!\Drupal::moduleHandler()->moduleExists($module)) {
        throw new RuntimeException("Required Drupal module is disabled: $module");
      }
    }
    if (!\Drupal::languageManager()->getLanguage('ar')) {
      throw new RuntimeException('Arabic (ar) must be configured on the target site.');
    }
    if (!$manager->getStorage('filter_format')->load('basic_html')?->status()) {
      throw new RuntimeException('The basic_html text format must be active.');
    }
    if (!$manager->getStorage('image_style')->load('large')) {
      throw new RuntimeException('The large image style is missing.');
    }

    $configEntities = [];
    $addConfigEntity = static function (string $type, string $id, array $data) use ($manager, &$configEntities): void {
      $existing = $manager->getStorage($type)->load($id);
      if ($existing && in_array($type, ['field_storage_config', 'field_config'], TRUE)) {
        $expectedType = $data['type'] ?? $data['field_type'];
        if ($existing->getType() !== $expectedType) {
          throw new RuntimeException("Field type conflict for $id");
        }
        if ($type === 'field_storage_config') {
          if ($existing->getCardinality() !== $data['cardinality']) {
            throw new RuntimeException("Field cardinality conflict for $id");
          }
          if ($id === 'node.field_branches') {
            $required = array_map('strval', range(1, 10));
            $allowed = array_map('strval', array_keys($existing->getSetting('allowed_values')));
            if (array_diff($required, $allowed) || $existing->getSetting('allowed_values_function')) {
              throw new RuntimeException('Existing station branch field has incompatible allowed values.');
            }
          }
        }
      }
      if (!$existing) {
        unset($data['uuid'], $data['_core'], $data['dependencies']);
        $configEntities[] = [$type, $id, $data];
      }
    };

    $addConfigEntity('node_type', 'almhtat', [
      'type' => 'almhtat',
      'name' => 'المحطات',
      'display_submitted' => FALSE,
    ]);
    foreach (glob(__DIR__ . '/config/field.storage.*.yml') as $path) {
      $values = Yaml::parseFile($path);
      if ($values['type'] === 'list_string') {
        $allowed = [];
        foreach ($values['settings']['allowed_values'] as $choice) {
          $allowed[$choice['value']] = $choice['label'];
        }
        $values['settings']['allowed_values'] = $allowed;
      }
      $addConfigEntity('field_storage_config', $values['id'], $values);
    }
    foreach (glob(__DIR__ . '/config/field.field.*.yml') as $path) {
      $values = Yaml::parseFile($path);
      $addConfigEntity('field_config', $values['id'], $values);
    }
    foreach (glob(__DIR__ . '/config/views.view.*.yml') as $path) {
      $values = Yaml::parseFile($path);
      $viewStorage = $manager->getStorage('view');
      $existing = $viewStorage->load($values['id']);
      if ($existing && $existing->get('base_table') !== 'node_field_data') {
        throw new RuntimeException("Existing View conflicts with {$values['id']}");
      }
      $addConfigEntity('view', $values['id'], $values);
    }

    $nodeStorage = $manager->getStorage('node');
    $branchesOnTarget = [];
    foreach ($nodeStorage->loadByProperties(['type' => 'almhtat']) as $node) {
      if ($node->hasField('field_branches') && !$node->get('field_branches')->isEmpty()) {
        $branch = $node->get('field_branches')->value;
        if (isset($branchesOnTarget[$branch])) {
          throw new RuntimeException("Duplicate branch on target: $branch");
        }
        $branchesOnTarget[$branch] = $node;
      }
    }

    $work = [];
    $branches = [];
    $needed = [];
    foreach ($stations as $station) {
      $branch = (string) $station['branch'];
      $fields = $station['translations']['ar'];
      if (isset($branches[$branch]) || count($station['translations']) !== 1 ||
          !empty($fields['field_video']) || (string) $fields['field_branches'][0]['value'] !== $branch) {
        throw new RuntimeException("Unexpected payload for branch $branch");
      }
      $branches[$branch] = TRUE;
      $matches = $nodeStorage->loadByProperties(['uuid' => $station['uuid']]);
      $match = reset($matches);
      if ($match || isset($branchesOnTarget[$branch])) {
        if (!$match || ($branchesOnTarget[$branch] ?? NULL)?->id() !== $match->id()) {
          throw new RuntimeException("Branch or UUID conflict on target: $branch");
        }
        printf("Reuse branch %s | node %s | %s\n", $branch, $match->id(), $match->label());
        continue;
      }

      foreach ($fields['field_images'] ?? [] as $image) {
        $needed[$image['target_id']] = TRUE;
      }
      $work[] = [$station, $fields];
    }

    if (count($branches) !== 10 || array_diff(range(1, 10), array_keys($branches))) {
      throw new RuntimeException('Expected exactly the ten station branches.');
    }

    $fileStorage = $manager->getStorage('file');
    $files = [];
    foreach (array_keys($needed) as $fid) {
      $entry = $manifest[$fid] ?? throw new RuntimeException("Missing manifest entry $fid");
      $filename = basename($entry['archive_path']);
      if (!preg_match('/^[\p{L}\p{N}_. -]+\.(jpe?g|png|gif)$/iu', $filename) ||
          $entry['archive_path'] !== "files/$fid/$filename") {
        throw new RuntimeException("Unexpected image path for $fid");
      }
      $source = __DIR__ . '/' . $entry['archive_path'];
      $destination = "public://jhr-stations/$fid/$filename";
      if (!is_file($source) || !getimagesize($source)) {
        throw new RuntimeException("Missing or invalid source image: $source");
      }
      $matches = $fileStorage->loadByProperties(['uri' => $destination]);
      $existing = reset($matches);
      $present = is_file($destination);
      if (count($matches) > 1 || ($existing && !$present) ||
          ($present && hash_file('sha256', $destination) !== hash_file('sha256', $source))) {
        throw new RuntimeException("Image conflict at $destination");
      }
      $files[$fid] = [$source, $destination, $existing, $present];
    }

    printf("%s | config to create: %d | stations to create: %d | referenced images: %d\n",
      $apply ? 'APPLY' : 'DRY RUN', count($configEntities), count($work), count($files));
    if (!$apply) {
      return;
    }

    // Views depend on the fields and are saved after their storage is available.
    foreach ($configEntities as [$type, $id, $data]) {
      $manager->getStorage($type)->create($data)->save();
      echo "Created config $id\n";
    }

    $displays = \Drupal::service('entity_display.repository');
    foreach (['view', 'form'] as $mode) {
      $display = $mode === 'view'
        ? $displays->getViewDisplay('node', 'almhtat')
        : $displays->getFormDisplay('node', 'almhtat');
      if (!$display->isNew()) {
        continue;
      }
      if ($mode === 'view') {
        $display->setComponent('body', ['type' => 'text_default', 'label' => 'hidden']);
        $display->setComponent('field_images', [
          'type' => 'image', 'label' => 'hidden', 'weight' => 1,
          'settings' => ['image_style' => 'large', 'image_link' => 'file'],
        ]);
      }
      else {
        $display->setComponent('title', ['type' => 'string_textfield']);
        $display->setComponent('body', ['type' => 'text_textarea_with_summary']);
        $display->setComponent('field_branches', ['type' => 'options_select']);
        $display->setComponent('field_images', ['type' => 'image_image']);
        $display->setComponent('field_google_map', ['type' => 'link_default']);
        $display->setComponent('field_video', ['type' => 'link_default']);
      }
      $display->save();
    }

    $fileIds = [];
    $fileSystem = \Drupal::service('file_system');
    foreach ($files as $fid => [$source, $destination, $file, $present]) {
      if (!$file) {
        if ($present) {
          // Recover a matching physical file left by an interrupted import.
          $file = $fileStorage->create(['uri' => $destination, 'uid' => 0]);
        }
        else {
          $directory = $fileSystem->dirname($destination);
          if (!$fileSystem->prepareDirectory($directory, FileSystemInterface::CREATE_DIRECTORY)) {
            throw new RuntimeException("Cannot prepare $directory");
          }
          $file = \Drupal::service('file.repository')->writeData(
            file_get_contents($source), $destination, FileExists::Error
          );
        }
        $file->setPermanent();
        $file->save();
      }
      $fileIds[$fid] = $file->id();
    }

    foreach ($work as [$station, $fields]) {
      foreach ($fields['field_images'] as &$image) {
        $image['target_id'] = $fileIds[$image['target_id']];
      }
      unset($image);
      $node = $nodeStorage->create($fields + [
        'type' => 'almhtat', 'langcode' => 'ar', 'uuid' => $station['uuid'],
        'uid' => 0, 'status' => 1,
      ]);
      $violations = $node->validate();
      if (count($violations)) {
        throw new RuntimeException("Branch {$station['branch']} failed validation: $violations");
      }
      $node->save();
      printf("Imported branch %s | node %s | %s\n", $station['branch'], $node->id(), $node->label());
    }
  }
  finally {
    if ($apply) {
      $lock->release('jhr_stations_import');
    }
  }
})();
