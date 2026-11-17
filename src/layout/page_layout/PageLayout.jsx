import { React, useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useLocation } from "react-router-dom";
import { renderPageSkeleton, SidebarNavSkeleton } from "../../components/skeleton/PageSkeletons";
import "./PageLayout.css";

const PageLayout = ({
    pageTitle,
    breadcrumb = [],
    sidebarTitle,
    sidebarItems = [],
    showShare = true,
    isLoading = false,
    loadingType = "content",
    children,
}) => {
    const location = useLocation();
    const backButton = location.pathname.startsWith("/gallery/")

    // const [backButton, setBackButton] = useState(false);

    // useEffect(() => {
    //     if (
    //         location.pathname.split("/")[1] === "gallery" &&
    //         location.pathname.split("/").length > 2
    //     ) {
    //         setBackButton(true);
    //     } else {
    //         setBackButton(false);
    //     }
    // }, [location.pathname]);

    const [showSideBar, setShowSideBar] = useState(false)
    const [shareFeedback, setShareFeedback] = useState("")

    useEffect(() => {
        if (sidebarItems.length > 0) {
            setShowSideBar(true)
        } else {
            setShowSideBar(false)
        }

    }, [sidebarItems.length])

    const copyWithFallback = async (url) => {
        if (navigator.clipboard?.writeText && window.isSecureContext) {
            await navigator.clipboard.writeText(url);
            return true;
        }

        const input = document.createElement("textarea");
        input.value = url;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.top = "0";
        input.style.left = "0";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.focus();
        input.select();
        input.setSelectionRange(0, input.value.length);

        let copied = false;
        try {
            copied = document.execCommand("copy");
        } catch {
            copied = false;
        }

        document.body.removeChild(input);
        return copied;
    };

    const showShareCopied = () => {
        setShareFeedback("تم نسخ الرابط");
        window.setTimeout(() => setShareFeedback(""), 2000);
    };

    const handleShare = async () => {
        const url = window.location.href;
        const shareData = {
            title: pageTitle || document.title,
            text: pageTitle || document.title,
            url,
        };

        try {
            if (typeof navigator.share === "function") {
                const canShare =
                    typeof navigator.canShare !== "function" || navigator.canShare(shareData);

                if (canShare) {
                    await navigator.share(shareData);
                    return;
                }
            }

            const copied = await copyWithFallback(url);
            if (copied) {
                showShareCopied();
            } else {
                window.prompt("انسخ الرابط:", url);
            }
        } catch (error) {
            // User cancelled native share dialog
            if (error?.name === "AbortError") return;

            try {
                const copied = await copyWithFallback(url);
                if (copied) {
                    showShareCopied();
                } else {
                    window.prompt("انسخ الرابط:", url);
                }
            } catch (fallbackError) {
                console.error("Share failed:", fallbackError);
            }
        }
    };

    return (


        <div className="inner-page-wrapper">
            <div className="page-header-band">
                <div className="page-header-inner" dir="rtl">
                    <div className="page-header-wrapper">
                        <h1 className="main-page-title">{pageTitle}</h1>
                        <div className="page-header-row">
                            <nav className="breadcrumb">
                                {breadcrumb.map((item, index) => (
                                    <span key={index}>
                                        {index > 0 && <span className="separator"> ◂ </span>}
                                        {item.link ? (
                                            <Link to={item.link}>{item.title}</Link>
                                        ) : (
                                            <span className="breadcrumb-current">{item.title}</span>
                                        )}
                                    </span>
                                ))}
                            </nav>

                            {showShare && (
                                <button type="button" className="page-share-btn" onClick={handleShare}>
                                    {shareFeedback || "شارك"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="inner-page-container" dir="rtl">
                {showSideBar ? (
                    <div className="page-content-grid">
                        <div className="sidebar-wrapper">
                            {isLoading ? (
                                <SidebarNavSkeleton count={Math.max(sidebarItems.length, 4)} />
                            ) : (
                                <Sidebar title={sidebarTitle} items={sidebarItems} />
                            )}
                        </div>

                        <main className="main-content" aria-busy={isLoading}>
                            <div className="section-title">
                                {breadcrumb[breadcrumb.length - 1].title}
                            </div>
                            {backButton ? (
                                <Link to="/gallery" className="back-link">
                                    ‹ العودة إلى الألبومات
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