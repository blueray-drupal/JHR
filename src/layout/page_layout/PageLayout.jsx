import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useLocation } from "react-router-dom";
import { renderPageSkeleton, SidebarNavSkeleton } from "../../components/skeleton/PageSkeletons";
import { resolveRouteMeta, usePageMeta } from "../../utils/pageMeta";
import { useLanguage } from "../../context/LanguageContext";
import "./PageLayout.css";

const PageLayout = ({
    pageTitle,
    pageMetaTitle,
    pageMetaDescription,
    breadcrumb = [],
    sidebarTitle,
    sidebarItems = [],
    showShare = true,
    isLoading = false,
    loadingType = "content",
    children,
}) => {
    const location = useLocation();
    const { t, lang } = useLanguage();
    const routeMeta = resolveRouteMeta(location.pathname);
    usePageMeta({
        title: pageMetaTitle || routeMeta.title || pageTitle,
        description: pageMetaDescription || routeMeta.description,
    });
    const backButton = location.pathname.startsWith("/gallery/")
    const shareMenuRef = useRef(null);

    const [showSideBar, setShowSideBar] = useState(false)
    const [shareOpen, setShareOpen] = useState(false)

    useEffect(() => {
        if (sidebarItems.length > 0) {
            setShowSideBar(true)
        } else {
            setShowSideBar(false)
        }

    }, [sidebarItems.length])

    useEffect(() => {
        if (!shareOpen) return undefined;

        const handleClickOutside = (event) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShareOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [shareOpen]);

    const getSharePayload = () => {
        const url = window.location.href;
        const title = pageTitle || document.title || "";
        return { url, title, text: `${title}\n${url}` };
    };

    const openShareWindow = (href) => {
        window.open(href, "_blank", "noopener,noreferrer,width=640,height=720");
        setShareOpen(false);
    };

    const shareToFacebook = () => {
        const { url } = getSharePayload();
        openShareWindow(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        );
    };

    const shareToWhatsApp = () => {
        const { text } = getSharePayload();
        openShareWindow(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
        );
    };

    const shareToInstagram = async () => {
        const { url, title, text } = getSharePayload();
        setShareOpen(false);

        // Instagram has no web sharer for links; native share sheet lets the user pick Instagram.
        if (typeof navigator.share === "function") {
            try {
                const shareData = { title, text, url };
                const canShare =
                    typeof navigator.canShare !== "function" || navigator.canShare(shareData);
                if (canShare) {
                    await navigator.share(shareData);
                    return;
                }
            } catch (error) {
                if (error?.name === "AbortError") return;
            }
        }

        // Desktop fallback: open Instagram; user can share from the app/device.
        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    };

    const toggleShareMenu = () => {
        setShareOpen((open) => !open);
    };

    return (


        <div className="inner-page-wrapper">
            <div className="page-header-band">
                <div className="page-header-inner">
                    <div className="page-header-wrapper">
                        <h1 className="main-page-title">{t(pageTitle)}</h1>
                        <div className="page-header-row">
                            <nav className="breadcrumb">
                                {breadcrumb.map((item, index) => {
                                    const isCurrent = index === breadcrumb.length - 1;

                                    return (
                                        <span key={index}>
                                            {index > 0 && <span className="separator">{lang === "en" ? " ▸ " : " ◂ "}</span>}
                                            {item.link && !isCurrent ? (
                                                <Link to={item.link}>{t(item.title)}</Link>
                                            ) : (
                                                <span className={isCurrent ? "breadcrumb-current" : undefined}>
                                                    {t(item.title)}
                                                </span>
                                            )}
                                        </span>
                                    );
                                })}
                            </nav>

                            {showShare && (
                                <div className="page-share-wrap" ref={shareMenuRef}>
                                    <button
                                        type="button"
                                        className="page-share-btn"
                                        onClick={toggleShareMenu}
                                        aria-expanded={shareOpen}
                                        aria-haspopup="menu"
                                    >
                                        {t("شارك")}
                                    </button>
                                    {shareOpen ? (
                                        <div className="page-share-menu" role="menu">
                                            <button
                                                type="button"
                                                className="page-share-option"
                                                role="menuitem"
                                                onClick={shareToFacebook}
                                            >
                                                {t("فيسبوك")}
                                            </button>
                                            <button
                                                type="button"
                                                className="page-share-option"
                                                role="menuitem"
                                                onClick={shareToWhatsApp}
                                            >
                                                {t("واتساب")}
                                            </button>
                                            <button
                                                type="button"
                                                className="page-share-option"
                                                role="menuitem"
                                                onClick={shareToInstagram}
                                            >
                                                {t("إنستغرام")}
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="inner-page-container">
                {showSideBar ? (
                    <div className="page-content-grid">
                        <div className="sidebar-wrapper">
                            {isLoading ? (
                                <SidebarNavSkeleton count={Math.max(sidebarItems.length, 4)} />
                            ) : (
                                <Sidebar title={t(sidebarTitle)} items={sidebarItems} />
                            )}
                        </div>

                        <main className="main-content" aria-busy={isLoading}>
                            <div className="section-title">
                                {t(breadcrumb[breadcrumb.length - 1].title)}
                            </div>
                            {backButton ? (
                                <Link to="/gallery" className="back-link">
                                    {t("‹ العودة إلى الألبومات")}
                                </Link>
                            ) : null}
                            {isLoading ? renderPageSkeleton(loadingType) : children}
                        </main>
                    </div>
                ) : (
                    <main className="main-content full-content" aria-busy={isLoading}>
                        {isLoading ? renderPageSkeleton(loadingType) : children}
                    </main>
                )}
            </div>
        </div>
    );
};

export default PageLayout;