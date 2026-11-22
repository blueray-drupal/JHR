# نقل محطات الخط الحجازي إلى Drupal

الحزمة تستورد نوع المحتوى **المحطات** (`almhtat`) والمحطات العربية العشر كعناصر منشورة، وتعيد ربط صورها الـ18 بأرقام الملفات الجديدة. تستخدم UUID المحطة وقيمة `field_branches` للتحقق من التعارض قبل الحفظ.

## على السيرفر الجديد

ارفع `jhr-stations-backend.tar.gz` إلى مجلد حساب `jhrqtz` باستخدام SFTP. فكها هناك خارج مسار الموقع، ثم شغّل الفحص.

```bash
cd ~
tar -xzf jhr-stations-backend.tar.gz
cd ~/public_html/backend/install-dir
php -l ~/jhr-stations-backend/import.php
./vendor/bin/drush php:script import --script-path="$HOME/jhr-stations-backend"
```

توقّع `DRY RUN` مع عشر محطات و18 صورة إذا كانت النسخة فارغة. إذا ظهر خطأ، عالج السبب قبل تشغيل الاستيراد. يفحص السكربت اللغة العربية، وصيغة `basic_html`، ونمط الصورة `large`، وتوافق الحقول والملفات الموجودة.

للاستيراد ثم تفعيل واجهة القراءة من Drupal عند استخدامها في الفرونت

```bash
JHR_STATIONS_APPLY=1 ./vendor/bin/drush php:script import --script-path="$HOME/jhr-stations-backend"
./vendor/bin/drush en jsonapi -y
./vendor/bin/drush cr
./vendor/bin/drush php:script import --script-path="$HOME/jhr-stations-backend"
```

بعد النجاح، الفحص الأخير يعرض عشر محطات معاد استخدامها وصفر محطات جديدة. يفعل الأمر `drush en jsonapi` واجهة JSON:API على مستوى Drupal. إذا كانت مفعلة أصلًا، استخدم إعدادها الحالي. تحقّق من الاستجابة بدون جلسة دخول من عنوان الباك إند الفعلي.

## الربط من الفرونت

- طلب القائمة مع ملفات الصور `GET /jsonapi/node/almhtat?include=field_images`. استخدم prefix اللغة العربية إذا كان الباك إند يفرضه.
- استخدم `attributes.title` و`attributes.body.processed` وعامل `attributes.field_branches` كرقم عند الترتيب من 1 إلى 10.
- الصور في `relationships.field_images.data`. حافظ على ترتيبها، وطابق معرف `id` مع عناصر `included` واقرأ `attributes.uri.url`. حلّ المسارات النسبية على عنوان الباك إند.
- تفاصيل المحطة عبر `GET /jsonapi/node/almhtat/{uuid}?include=field_images`. استخدم UUID، لأن Drupal الجديد يخصص أرقام nodes وملفات جديدة.
- ملفات الخريطة القديمة موجودة تحت `theme/`. الخلفية `maaap2.png` والعلامة `pos2.png`. إحداثيات النقاط في قواعد `#block-quicktabsalmhtat` داخل `theme/css/inner.css`، وقواعد الموبايل في `responsive.css`.

## إعدادات العرض

الحزمة تستورد View الخريطة `almhtat` وView التفاصيل `almhtat_alsfht_aldakhlyh_` مع الـ displays الأصلية. الـ Accordion والسلايدر القديمان تحوّلا إلى عرض Views عادي حتى ينفذ الفرونت التفاعل. حقل الفيديو، الفارغ بالمصدر، ينتقل كحقل رابط. الإعدادان الأصليان موجودان تحت `original-views/` للرجوع إليهما. الحزمة لا تربط بلوكات الثيم القديم ولا تنشئ مسارات الفرونت.

السكربت يضيف إعدادات ومحطات جديدة، ويحتفظ بالإعدادات الموجودة التي يقبلها الفحص. إذا انقطع الاستيراد أعد الفحص أولًا. قد يكون الانقطاع قد حفظ جزءًا من الإعدادات أو الملفات؛ التشغيل التالي يكمل العناصر المفقودة ويعيد استخدام العناصر المطابقة.
