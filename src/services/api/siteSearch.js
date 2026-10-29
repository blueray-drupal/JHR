import { drupalApi } from './axios.config.js';

const stripHtml = (html = '') =>
  String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const excerpt = (html, max = 160) => {
  const plain = stripHtml(html);
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).trim()}...`;
};

/** صفحات ثابتة من خريطة الموقع */
export const STATIC_SEARCH_PAGES = [
  { title: 'الرئيسية', path: '/', badge: 'صفحة', description: 'الصفحة الرئيسية لمؤسسة الخط الحديدي الحجازي الأردني.' },
  { title: 'نبذة عن المؤسسة', path: '/about', badge: 'عن المؤسسة', description: 'نبذة عن مؤسسة الخط الحديدي الحجازي الأردني.' },
  { title: 'الكلمة الترحيبية', path: '/welcome-speech', badge: 'عن المؤسسة', description: 'الكلمة الترحيبية للمدير العام.' },
  { title: 'مجلس الإدارة', path: '/board-directors', badge: 'عن المؤسسة', description: 'أعضاء مجلس إدارة المؤسسة.' },
  { title: 'الهيكل التنظيمي', path: '/organization-chart', badge: 'عن المؤسسة', description: 'الهيكل التنظيمي للمؤسسة.' },
  { title: 'المدراء العامون', path: '/general-managers', badge: 'عن المؤسسة', description: 'المديرون العامون السابقون.' },
  { title: 'الرحلات', path: '/services/trips', badge: 'خدمات', description: 'خدمات الرحلات العائلية والسياحية.' },
  { title: 'حجز مواقع', path: '/services/venue-booking', badge: 'خدمات', description: 'حجز المواقع التابعة للمؤسسة.' },
  { title: 'المتحف', path: '/services/museum', badge: 'خدمات', description: 'متحف الخط الحديدي الحجازي.' },
  { title: 'خدمات الشحن', path: '/services/cargo', badge: 'خدمات', description: 'خدمات الشحن والنقل.' },
  { title: 'خدمات الاستثمار', path: '/services/investment', badge: 'خدمات', description: 'فرص وخدمات الاستثمار.' },
  { title: 'الأخبار', path: '/news', badge: 'المركز الإعلامي', description: 'أخبار المؤسسة.' },
  { title: 'ألبوم الصور', path: '/gallery', badge: 'المركز الإعلامي', description: 'ألبوم صور المؤسسة.' },
  { title: 'الفعاليات', path: '/events', badge: 'المركز الإعلامي', description: 'فعاليات المؤسسة.' },
  { title: 'المؤتمرات', path: '/conferences', badge: 'المركز الإعلامي', description: 'مؤتمرات المؤسسة.' },
  { title: 'المشاريع', path: '/info-center/projects', badge: 'مركز المعلومات', description: 'مشاريع المؤسسة.' },
  { title: 'الموازنة', path: '/info-center/budget', badge: 'مركز المعلومات', description: 'وثائق الموازنة.' },
  { title: 'التقارير السنوية', path: '/info-center/annual-reports', badge: 'مركز المعلومات', description: 'التقارير السنوية.' },
  { title: 'الاتفاقيات', path: '/info-center/agreements', badge: 'مركز المعلومات', description: 'اتفاقيات المؤسسة.' },
  { title: 'القوانين', path: '/legislations/laws', badge: 'تشريعات', description: 'القوانين ذات العلاقة.' },
  { title: 'الأنظمة', path: '/legislations/regulations', badge: 'تشريعات', description: 'الأنظمة والتعليمات.' },
  { title: 'الوظائف', path: '/jobs', badge: 'وظائف', description: 'إعلانات الوظائف.' },
  { title: 'العطاءات', path: '/tenders', badge: 'عطاءات', description: 'عطاءات المؤسسة.' },
  { title: 'الشكاوى والاقتراحات', path: '/complaints', badge: 'تواصل', description: 'منصة الشكاوى والاقتراحات.' },
  { title: 'حق الحصول على معلومة', path: '/freedom-of-information', badge: 'تواصل', description: 'نموذج حق الحصول على معلومة.' },
  { title: 'اتصل بنا', path: '/contact-us', badge: 'تواصل', description: 'معلومات الاتصال ونموذج التواصل.' },
  { title: 'الأسئلة الأكثر تكراراً', path: '/faq', badge: 'صفحة', description: 'الأسئلة الشائعة.' },
  { title: 'روابط مفيدة', path: '/useful-links', badge: 'صفحة', description: 'روابط مفيدة.' },
  { title: 'خريطة الموقع', path: '/sitemap', badge: 'صفحة', description: 'خريطة صفحات الموقع.' },
];

const MEDIA_PATHS = {
  news: '/news',
  events: '/events',
  conferences: '/conferences',
  gallery: '/gallery',
  photo_gallery: '/gallery',
};

const SEARCHABLE_CONTENT = [
  {
    type: 'media_center',
    badge: 'المركز الإعلامي',
    getPath: (node) => {
      const classification = String(
        node.attributes.field_media_center_classificatio || 'news'
      ).toLowerCase();
      const base = MEDIA_PATHS[classification] || '/news';
      return `${base}/${node.id}`;
    },
    getDescription: (node) =>
      excerpt(
        node.attributes.field_body?.summary ||
          node.attributes.field_body?.processed ||
          node.attributes.field_body?.value ||
          node.attributes.body?.summary ||
          node.attributes.body?.processed ||
          node.attributes.body?.value ||
          ''
      ),
  },
  {
    type: 'jobs',
    badge: 'وظائف',
    getPath: (node) => `/jobs/${node.id}`,
    getDescription: (node) =>
      excerpt(
        node.attributes.field_body?.processed ||
          node.attributes.field_body?.value ||
          node.attributes.body?.processed ||
          node.attributes.body?.value ||
          ''
      ),
  },
  {
    type: 'tenders',
    badge: 'عطاءات',
    getPath: (node) => `/tenders/${node.id}`,
    getDescription: (node) =>
      excerpt(
        node.attributes.field_brief ||
          node.attributes.field_body?.processed ||
          node.attributes.field_body?.value ||
          ''
      ),
  },
  {
    type: 'projects',
    badge: 'مشاريع',
    getPath: (node) => `/info-center/projects/${node.id}`,
    getDescription: (node) =>
      excerpt(
        node.attributes.field_body?.summary ||
          node.attributes.field_body?.processed ||
          node.attributes.field_body?.value ||
          node.attributes.body?.processed ||
          ''
      ),
  },
  {
    type: 'faq',
    badge: 'أسئلة شائعة',
    getPath: () => '/faq',
    getDescription: (node) =>
      excerpt(
        node.attributes.field_body?.processed ||
          node.attributes.field_body?.value ||
          node.attributes.body?.processed ||
          ''
      ),
  },
  {
    type: 'basic_page',
    badge: 'صفحة',
    getPath: (node) => {
      const link = node.attributes.field_link;
      if (typeof link === 'string' && link.startsWith('/')) return link;
      return '/';
    },
    getDescription: (node) =>
      excerpt(
        node.attributes.field_body1?.processed ||
          node.attributes.field_body1?.value ||
          node.attributes.field_body?.processed ||
          ''
      ),
  },
];

function matchesQuery(text, query) {
  return String(text || '').toLowerCase().includes(query.toLowerCase());
}

function filterStaticPages(query) {
  return STATIC_SEARCH_PAGES.filter(
    (page) =>
      matchesQuery(page.title, query) ||
      matchesQuery(page.description, query) ||
      matchesQuery(page.badge, query)
  ).map((page) => ({
    id: `static-${page.path}`,
    ...page,
  }));
}

async function searchNodesByTitle(type, query) {
  const { data } = await drupalApi.get(`/jsonapi/node/${type}`, {
    params: {
      'filter[status]': 1,
      'filter[title][condition][path]': 'title',
      'filter[title][condition][operator]': 'CONTAINS',
      'filter[title][condition][value]': query,
      'page[limit]': 20,
      sort: '-created',
    },
  });

  return data.data ?? [];
}

function mapDrupalResults(nodes, config) {
  return nodes.map((node) => ({
    id: node.id,
    title: node.attributes.title,
    path: config.getPath(node),
    badge: config.badge,
    description: config.getDescription(node) || config.badge,
  }));
}

export async function searchSite(query) {
  const term = query.trim();
  if (!term) return [];

  const staticResults = filterStaticPages(term);

  const drupalBatches = await Promise.allSettled(
    SEARCHABLE_CONTENT.map(async (config) => {
      const nodes = await searchNodesByTitle(config.type, term);
      return mapDrupalResults(nodes, config);
    })
  );

  const drupalResults = drupalBatches
    .filter((batch) => batch.status === 'fulfilled')
    .flatMap((batch) => batch.value);

  const seen = new Set();
  const merged = [];

  [...staticResults, ...drupalResults].forEach((item) => {
    const key = `${item.path}::${item.title}`;
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(item);
  });

  return merged;
}
