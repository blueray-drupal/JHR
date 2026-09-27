import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMenuByMachineName } from "../../utils/menuService";
import { fetchFooterData, parseContactLine } from "../../services/api/footerApi";
import { Skeleton } from "../../components/skeleton/Skeleton";
import "./footer.css";

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

const defaultSocialIcons = [
    { id: "default-fb", title: "Facebook", image: "/assets/facebook.svg", link: "#" },
    { id: "default-ig", title: "Instagram", image: "/assets/instagram.svg", link: "#" },
    { id: "default-yt", title: "YouTube", image: "/assets/youtube.svg", link: "#" },
    { id: "default-rss", title: "RSS", image: "/assets/rss.svg", link: "#" },
];

const copyrightMenu = {
    policyLinksFallback:
        "حقوق النشر - سياسة الخصوصية - شروط الاستخدام - إخلاء المسؤولية - سياسة سهولة التصفح - سياسة ملفات تعريف الارتباط - حقوق الملكية الفكرية",
    year: "جميع الحقوق محفوظة © 2026",
    organization: "مؤسسة الخط الحديدي الحجازي الأردني",
};

function FooterPolicyLink({ title, link }) {
    if (!link) {
        return <span>{title}</span>;
    }

    const isExternal = /^https?:\/\//i.test(link);

    if (isExternal) {
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
    const [topFooterMenu, setTopFooterMenu] = useState([]);
    const [loadingTopMenu, setLoadingTopMenu] = useState(true);
    const [contactItems, setContactItems] = useState(defaultContactItems);
    const [importantLinks, setImportantLinks] = useState(defaultImportantLinks);
    const [partners, setPartners] = useState([]);
    const [socialIcons, setSocialIcons] = useState(defaultSocialIcons);
    const [bottomLinks, setBottomLinks] = useState([]);

    useEffect(() => {
        const loadTopFooterMenu = async () => {
            const menuData = await getMenuByMachineName("main");
            setTopFooterMenu(menuData);
            setLoadingTopMenu(false);
        };

        loadTopFooterMenu();
    }, []);

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
                        {loadingTopMenu ? (
                            <Skeleton style={{ width: 220, height: 14 }} />
                        ) : (
                            topFooterMenu.map((item) => (
                                <Link
                                    key={item.id}
                                    to={item.link}
                                    className="footer-top-menu-link"
                                >
                                    {item.title}
                                </Link>
                            ))
                        )}
                    </nav>

                    <nav className="footer-social-menu">
                        <span className="footer-social-title">
                            وسائل التواصل الاجتماعي
                        </span>
                        {socialIcons.map((item) => (
                            <a
                                key={item.id}
                                href={item.link || "#"}
                                className="footer-social-link"
                                aria-label={item.title}
                                target={item.link && item.link !== "#" ? "_blank" : undefined}
                                rel={item.link && item.link !== "#" ? "noopener noreferrer" : undefined}
                            >
                                <img src={item.image} alt={item.title} />
                            </a>
                        ))}
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
                            {partners.map((item) => (
                                item.link ? (
                                    <a
                                        key={item.id}
                                        href={item.link}
                                        className="footer-partner"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item.image && (
                                            <img src={item.image} alt={item.title} />
                                        )}
                                    </a>
                                ) : (
                                    <div key={item.id} className="footer-partner">
                                        {item.image && (
                                            <img src={item.image} alt={item.title} />
                                        )}
                                    </div>
                                )
                            ))}
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
