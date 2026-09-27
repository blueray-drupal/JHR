import React from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../layout/page_layout/PageLayout";
import "./SiteMap.css";

const SITEMAP_DATA = [
    {
        title: "عن المؤسسة",
        links: [
            { label: "نبذة عن المؤسسة", path: "/about" },
            { label: "الكلمة الترحيبية", path: "/welcome-speech" },
            { label: "مجلس الإدارة", path: "/board-directors" },
            { label: "الهيكل التنظيمي", path: "/organization-chart" },
            { label: "المدراء العامون", path: "/general-managers" },
        ],
    },
    {
        title: "الخدمات",
        links: [
            { label: "الرحلات", path: "/services/trips" },
            { label: "حجز مواقع", path: "/services/venue-booking" },
            { label: "محطات المسافرين", path: "/contact-us" },
            { label: "المتحف", path: "/services/museum" },
        ],
    },
    {
        title: "التشريعات",
        links: [
            { label: "القوانين", path: "/legislations/laws" },
            { label: "الأنظمة", path: "/legislations/regulations" },
        ],
    },
    {
        title: "مركز المعلومات",
        links: [
            { label: "المشاريع", path: "/info-center/projects" },
            { label: "الموازنة", path: "/info-center/budget" },
            { label: "التقارير السنوية", path: "/info-center/annual-reports" },
            { label: "الاتفاقيات", path: "/info-center/agreements" },
        ],
    },
    {
        title: "المركز الإعلامي",
        links: [
            { label: "الأخبار", path: "/news" },
            { label: "ألبوم الصور", path: "/gallery" },
            { label: "الفعاليات", path: "/events" },
            { label: "المؤتمرات", path: "/conferences" },
        ],
    },
    {
        title: "روابط أخرى",
        links: [
            { label: "اتصل بنا", path: "/contact-us" },
            { label: "الوظائف", path: "/jobs" },
            { label: "العطاءات", path: "/tenders" },
            { label: "الشكاوى والاقتراحات", path: "/complaints" },
            { label: "حق الحصول على معلومة", path: "/freedom-of-information" },
        ],
    },
];

function SiteMap() {
    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "خريطة الموقع", link: null },
    ];

    return (
        <PageLayout pageTitle="خريطة الموقع" breadcrumb={breadcrumb}>
            <div className="sitemap-container">
                {SITEMAP_DATA.map((section) => (
                    <section key={section.title} className="sitemap-section">
                        <h2 className="sitemap-section-title">{section.title}</h2>
                        <ul className="sitemap-list">
                            {section.links.map((item) => (
                                <li key={item.path} className="sitemap-item">
                                    <Link to={item.path} className="sitemap-link">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </PageLayout>
    );
}

export default SiteMap;
