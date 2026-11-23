import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchFooterData, parseContactLine } from "../../services/api/footerApi";
import "./footer.css";
import facebookIcon from "../../../assets/facebook.svg";
import instagramIcon from "../../../assets/insta.svg";
import youtubeIcon from "../../../assets/youtube.svg";

/** ترتيب RTL: يظهر أول عنصر يمينًا كما في التصميم */
const topFooterLinks = [
    { id: "code-of-conduct", title: "مدونة السلوك الوظيفي", link: "/code-of-conduct" },
    { id: "faq", title: "الأسئلة الأكثر تكراراً", link: "/faq" },
    { id: "useful-links", title: "روابط مفيدة", link: "/useful-links" },
    { id: "staff-mail", title: "بريد الموظفين", link: "https://webmail.gov.jo/owa/" },
];

const defaultContactItems = [
    { id: "default-1", text: "العنوان: عمان - المحطة - شارع الملك عبدالله الأول" },
    { id: "default-2", text: "الهاتف: 00962 6 4895413" },
    { id: "default-3", text: "الهاتف: 00962 79 9053015" },
    { id: "default-4", text: "الفاكس: 00962 6 4871907" },
    { id: "default-5", text: "ساعات العمل: من الأحد إلى الخميس من الساعة 8:00 صباحاً إلى الساعة 4:00 مساءً" },
];

const defaultImportantLinks = [
    { id: "default-link-1", title: "يدعم إنترنت إكسبلورر 10+، جوجل كروم، فايرفوكس، سفاري", link: "" },
    { id: "default-link-2", title: "من الأفضل مشاهدة هذا الموقع من خلال شاشة 1366 × 768", link: "" },
    { id: "default-link-3", title: "Adobe Reader: البرنامج المطلوب للتحميل", link: "" },
    { id: "default-link-4", title: "حدد زوار الموقع: 6043606", link: "" },
    { id: "default-link-5", title: "آخر تعديل: 01/06/2026", link: "" },
];

const SOCIAL_URLS = {
    facebook: "https://www.facebook.com/JordanHejazRailay/mentions/",
    instagram: "https://www.instagram.com/jordan_hejaz_railway_/",
    youtube: "https://www.youtube.com/channel/UCe1TR5Upmef5FYdDaLkq9xw",
};

const defaultSocialIcons = [
    { id: "default-fb", title: "Facebook", image: facebookIcon, link: SOCIAL_URLS.facebook },
    { id: "default-ig", title: "Instagram", image: instagramIcon, link: SOCIAL_URLS.instagram },
    { id: "default-yt", title: "YouTube", image: youtubeIcon, link: SOCIAL_URLS.youtube },
];

const copyrightMenu = {
    policyLinksFallback:
        "حقوق النشر - سياسة الخصوصية - شروط الاستخدام - إخلاء المسؤولية - سياسة سهولة التصفح - سياسة ملفات تعريف الارتباط - حقوق الملكية الفكرية",
    year: "جميع الحقوق محفوظة © 2026",
    organization: "مؤسسة الخط الحديدي الحجازي الأردني",
};

function isStaticFileHref(link) {
    return /\.(pdf|docx?|xlsx?|pptx?|zip|rar|png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(
        String(link || "")
    );
}

function isExternalHref(link) {
    return (
        /^https?:\/\//i.test(link) ||
        link.startsWith("//") ||
        link.startsWith("mailto:") ||
        isStaticFileHref(link)
    );
}

const NATIONAL_HUMAN_RIGHTS_PLAN_PDF =
    encodeURI("/الخطة_الوطنية_الشاملة_لحقوق_الانسان.pdf");

function resolvePartnerLink(item) {
    const link = item?.link || "";
    const haystack = `${link} ${item?.image || ""} ${item?.title || ""}`;

    if (
        /obtaininformationform/i.test(link) ||
        /حق.?الحصول|الحصول.?على.?معلوم|%D8%AD%D9%82%20%D8%A7%D9%84%D8%AD%D8%B5%D9%88%D9%84/i.test(haystack)
    ) {
        return "/freedom-of-information";
    }

    if (/tawasul\.gov\.jo/i.test(link)) {
        return "https://www.tawasal.gov.jo/";
    }

    if (
        /mot\.gov\.jo/i.test(link) ||
        /الخطة_?الوطنية|%D8%A7%D9%84%D8%AE%D8%B7%D8%A9/i.test(haystack)
    ) {
        if (/الخطة|%D8%A7%D9%84%D8%AE%D8%B7%D8%A9|حقوق.?الانسان|%D8%AD%D9%82%D9%88%D9%82/i.test(haystack)) {
            return NATIONAL_HUMAN_RIGHTS_PLAN_PDF;
        }
    }

    return link;
}

function resolveSocialLink(item) {
    const haystack = `${item?.link || ""} ${item?.title || ""} ${item?.image || ""}`;

    if (/instagram\.com|insta|Icon%20%288%29|Icon \(8\)/i.test(haystack)) {
        return SOCIAL_URLS.instagram;
    }

    if (/facebook\.com|JordanHejazRailay|Vector\.png/i.test(haystack)) {
        return SOCIAL_URLS.facebook;
    }

    if (/youtube\.com|youtu\.be|Icon%20%289%29|Icon \(9\)/i.test(haystack)) {
        return SOCIAL_URLS.youtube;
    }

    return item?.link || "#";
}

function FooterPolicyLink({ title, link }) {
    if (!link) {
        return <span>{title}</span>;
    }

    if (isExternalHref(link)) {
        return (
            <a
                href={link}
                className="footer-policy-link"
                target="_blank"
                rel="noopener noreferrer"
            >
                {title}
            </a>
        );
    }

    return (
        <Link to={link} className="footer-policy-link">
            {title}
        </Link>
    );
}

function FooterTopMenuLink({ title, link }) {
    if (isExternalHref(link)) {
        return (
            <a
                href={link}
                className="footer-top-menu-link"
                target="_blank"
                rel="noopener noreferrer"
            >
                {title}
            </a>
        );
    }

    return (
        <Link to={link} className="footer-top-menu-link">
            {title}
        </Link>
    );
}

const developerMenu = {
    text: "تصميم وتطوير",
    name: "Blue Ray Solutions",
    link: "#",
};

function FooterContactLine({ text }) {
    const { prefix, value, isPhone } = parseContactLine(text);

    if (!value || !isPhone) {
        return text;
    }

    return (
        <>
            {prefix}{" "}
            <span dir="ltr" className="footer-contact-number">{value}</span>
        </>
    );
}

function Footer() {
    const [contactItems, setContactItems] = useState(defaultContactItems);
    const [importantLinks, setImportantLinks] = useState(defaultImportantLinks);
    const [partners, setPartners] = useState([]);
    const [socialIcons, setSocialIcons] = useState(defaultSocialIcons);
    const [bottomLinks, setBottomLinks] = useState([]);

    useEffect(() => {
        const loadFooterData = async () => {
            try {
                const footerData = await fetchFooterData();
                if (!footerData) return;

                if (footerData.contactItems.length > 0) {
                    setContactItems(footerData.contactItems);
                }

                if (footerData.importantLinks.length > 0) {
                    setImportantLinks(footerData.importantLinks);
                }

                setPartners(footerData.partners);

                if (footerData.socialIcons?.length > 0) {
                    setSocialIcons(footerData.socialIcons);
                }

                if (footerData.bottomLinks?.length > 0) {
                    setBottomLinks(footerData.bottomLinks);
                }
            } catch (error) {
                console.error("Error fetching footer data:", error);
            }
        };

        loadFooterData();
    }, []);

    return (
        <footer className="footer" dir="rtl">

            <div className="footer-top">
                <div className="footer-container footer-top-container">
                    <nav className="footer-top-menu">
                        {topFooterLinks.map((item) => (
                            <FooterTopMenuLink
                                key={item.id}
                                title={item.title}
                                link={item.link}
                            />
                        ))}
                    </nav>

                    <nav className="footer-social-menu">
                        <span className="footer-social-title">
                            وسائل التواصل الاجتماعي
                        </span>
                        {socialIcons.map((item) => {
                            const href = resolveSocialLink(item);
                            return (
                                <a
                                    key={item.id}
                                    href={href}
                                    className="footer-social-link"
                                    aria-label={item.title}
                                    target={href && href !== "#" ? "_blank" : undefined}
                                    rel={href && href !== "#" ? "noopener noreferrer" : undefined}
                                >
                                    <img src={item.image} alt={item.title} />
                                </a>
                            );
                        })}
                    </nav>
                </div>
            </div>

            <div className="footer-main">
                <div className="footer-container footer-main-container">

                    <div className="footer-contact">
                        {contactItems.map((item, index) => (
                            <p
                                key={item.id}
                                className={index === contactItems.length - 1 ? "footer-working-hours" : undefined}
                            >
                                <FooterContactLine text={item.text} />
                            </p>
                        ))}

                        <Link to="/contact-us" className="footer-more-link">
                            اقرأ المزيد
                            <span>←</span>
                        </Link>
                    </div>

                    <nav className="footer-important-links">
                        {importantLinks.map((item) => (
                            item.link ? (
                                <Link
                                    key={item.id}
                                    to={item.link}
                                    className="footer-important-link"
                                >
                                    <span className="footer-important-icon"></span>
                                    <span>{item.title}</span>
                                </Link>
                            ) : (
                                <div key={item.id} className="footer-important-link">
                                    <span className="footer-important-icon"></span>
                                    <span>{item.title}</span>
                                </div>
                            )
                        ))}
                    </nav>

                    {partners.length > 0 && (
                        <div className="footer-partners">
                            {partners.map((item) => {
                                if (!item.link) {
                                    return (
                                        <div key={item.id} className="footer-partner">
                                            {item.image && (
                                                <img src={item.image} alt={item.title} />
                                            )}
                                        </div>
                                    );
                                }

                                const href = resolvePartnerLink(item);
                                const image = item.image ? (
                                    <img src={item.image} alt={item.title} />
                                ) : null;

                                if (!isExternalHref(href)) {
                                    return (
                                        <Link
                                            key={item.id}
                                            to={href}
                                            className="footer-partner"
                                            onClick={() => {
                                                if (href === "/freedom-of-information") {
                                                    window.scrollTo({
                                                        top: 0,
                                                        left: 0,
                                                        behavior: "smooth",
                                                    });
                                                }
                                            }}
                                        >
                                            {image}
                                        </Link>
                                    );
                                }

                                return (
                                    <a
                                        key={item.id}
                                        href={href}
                                        className="footer-partner"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {image}
                                    </a>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-container footer-bottom-container">
                    <div className="footer-copyright">
                        <p className="footer-policy-links">
                            {bottomLinks.length > 0 ? (
                                bottomLinks.map((item, index) => (
                                    <React.Fragment key={item.id}>
                                        {index > 0 && " - "}
                                        <FooterPolicyLink title={item.title} link={item.link} />
                                    </React.Fragment>
                                ))
                            ) : (
                                copyrightMenu.policyLinksFallback
                            )}
                        </p>
                        <p>{copyrightMenu.year} - {copyrightMenu.organization}</p>
                    </div>

                    <div className="footer-developer">
                        <span>{developerMenu.text}</span>
                        <a href={developerMenu.link}>{developerMenu.name}</a>
                    </div>
                </div>
            </div>

        </footer>
    );
}

export default Footer;
