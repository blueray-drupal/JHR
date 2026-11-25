import { useLayoutEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export const SITE_NAME = "مؤسسة الخط الحديدي الحجازي الأردني";

export const HOME_DESCRIPTION =
    "الموقع الرسمي لمؤسسة الخط الحديدي الحجازي الأردني. تعرّف على تاريخ الخط، والخدمات، والأخبار، والمحطات.";

const ROUTE_META = {
    "/": {
        title: SITE_NAME,
        description: HOME_DESCRIPTION,
    },
    "/about": {
        title: "نبذة عن المؤسسة",
        description: "نبذة عن مؤسسة الخط الحديدي الحجازي الأردني وتاريخها ودورها.",
    },
    "/welcome-speech": {
        title: "الكلمة الترحيبية",
        description: "الكلمة الترحيبية لمدير عام مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/board-directors": {
        title: "مجلس الإدارة",
        description: "أعضاء مجلس إدارة مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/organization-chart": {
        title: "الهيكل التنظيمي",
        description: "الهيكل التنظيمي لمؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/general-managers": {
        title: "المدراء العامون",
        description: "المدراء العامون لمؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/stations": {
        title: "المحطات",
        description: "محطات الخط الحديدي الحجازي الأردني ومواقعها.",
    },
    "/services/trips": {
        title: "الرحلات",
        description: "رحلات القطار السياحية والتاريخية التي تنظمها المؤسسة.",
    },
    "/services/venue-booking": {
        title: "حجز موقع",
        description: "حجز المواقع والمحطات التاريخية لإقامة الفعاليات.",
    },
    "/services/investment": {
        title: "خدمات الاستثمار",
        description: "الفرص والخدمات الاستثمارية لدى مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/services/cargo": {
        title: "نقل البضائع",
        description: "خدمات نقل البضائع عبر الخط الحديدي الحجازي الأردني.",
    },
    "/services/museum": {
        title: "المتحف",
        description: "زيارة متحف الخط الحديدي الحجازي الأردني والجولات الإرشادية.",
    },
    "/legislations/laws": {
        title: "القوانين",
        description: "القوانين المنشورة على موقع مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/legislations/regulations": {
        title: "الأنظمة",
        description: "الأنظمة والتشريعات الفرعية المنشورة على موقع المؤسسة.",
    },
    "/info-center/projects": {
        title: "المشاريع",
        description: "مشاريع مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/info-center/budget": {
        title: "الموازنة",
        description: "موازنة مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/info-center/annual-reports": {
        title: "التقارير السنوية",
        description: "التقارير السنوية لمؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/info-center/agreements": {
        title: "الاتفاقيات",
        description: "اتفاقيات مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/news": {
        title: "الأخبار",
        description: "أخبار مؤسسة الخط الحديدي الحجازي الأردني وآخر الإعلانات والنشاطات.",
    },
    "/gallery": {
        title: "ألبوم الصور",
        description: "ألبوم صور مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/events": {
        title: "الفعاليات",
        description: "فعاليات مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/conferences": {
        title: "المؤتمرات",
        description: "مؤتمرات مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/contact-us": {
        title: "اتصل بنا",
        description: "بيانات الاتصال بمؤسسة الخط الحديدي الحجازي الأردني: العنوان، الهاتف، والبريد الإلكتروني، ونموذج اتصل بنا.",
    },
    "/jobs": {
        title: "الوظائف",
        description: "الوظائف الشاغرة في مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/tenders": {
        title: "العطاءات",
        description: "العطاءات المطروحة لدى مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/complaints": {
        title: "الشكاوى والاقتراحات",
        description: "تقديم شكوى أو اقتراح إلى مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/freedom-of-information": {
        title: "حق الحصول على معلومة",
        description: "طلب الحصول على المعلومات من مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/code-of-conduct": {
        title: "مدونة السلوك الوظيفي",
        description: "مدونة السلوك الوظيفي لمؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/sitemap": {
        title: "خريطة الموقع",
        description: "خريطة صفحات موقع مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/faq": {
        title: "الأسئلة الأكثر تكراراً",
        description: "إجابات الأسئلة الأكثر تكراراً عن مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/useful-links": {
        title: "روابط مفيدة",
        description: "روابط مفيدة ذات صلة بعمل مؤسسة الخط الحديدي الحجازي الأردني.",
    },
    "/search": {
        title: "البحث",
        description: "ابحث في صفحات ومحتوى موقع مؤسسة الخط الحديدي الحجازي الأردني.",
    },
};

const DETAIL_META = [
    { prefix: "/news/", title: "خبر", description: "تفاصيل خبر من مؤسسة الخط الحديدي الحجازي الأردني." },
    { prefix: "/events/", title: "فعالية", description: "تفاصيل فعالية من مؤسسة الخط الحديدي الحجازي الأردني." },
    { prefix: "/conferences/", title: "مؤتمر", description: "تفاصيل مؤتمر من مؤسسة الخط الحديدي الحجازي الأردني." },
    { prefix: "/gallery/", title: "ألبوم صور", description: "صور من ألبوم مؤسسة الخط الحديدي الحجازي الأردني." },
    { prefix: "/jobs/", title: "وظيفة", description: "تفاصيل وظيفة شاغرة في مؤسسة الخط الحديدي الحجازي الأردني." },
    { prefix: "/tenders/", title: "عطاء", description: "تفاصيل عطاء لدى مؤسسة الخط الحديدي الحجازي الأردني." },
    { prefix: "/info-center/projects/", title: "مشروع", description: "تفاصيل مشروع لدى مؤسسة الخط الحديدي الحجازي الأردني." },
    { prefix: "/stations/", title: "محطة", description: "تفاصيل محطة على الخط الحديدي الحجازي الأردني." },
];

export function resolveRouteMeta(pathname) {
    if (ROUTE_META[pathname]) return ROUTE_META[pathname];

    const detail = DETAIL_META.find((item) => pathname.startsWith(item.prefix));
    if (detail) return detail;

    return {
        title: "",
        description: "صفحة على موقع مؤسسة الخط الحديدي الحجازي الأردني.",
    };
}

function upsertDescription(content) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
}

export function applyPageMeta({ title, description }) {
    const pageTitle = String(title || "").replace(/\s+/g, " ").trim();
    document.title = !pageTitle || pageTitle === SITE_NAME
        ? SITE_NAME
        : `${pageTitle} - ${SITE_NAME}`;

    const text = String(description || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 300);

    upsertDescription(text || HOME_DESCRIPTION);
}

export function usePageMeta({ title, description }) {
    const { t, lang } = useLanguage();

    useLayoutEffect(() => {
        const siteName = t(SITE_NAME);
        const pageTitle = String(t(title) || "").replace(/\s+/g, " ").trim();
        document.title = !pageTitle || pageTitle === siteName
            ? siteName
            : `${pageTitle} - ${siteName}`;

        const text = String(t(description) || "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 300);

        upsertDescription(text || t(HOME_DESCRIPTION));
    }, [title, description, lang, t]);
}
