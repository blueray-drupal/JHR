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
    showShare = false,
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
    console.log(sidebarItems.length);

    useEffect(() => {
        if (sidebarItems.length > 0) {
            setShowSideBar(true)
        } else {
            setShowSideBar(false)
        }

    }, [sidebarItems.length])

    const handleShare = async () => {
        const shareData = {
            title: pageTitle,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(window.location.href);
            }
        } catch (error) {
            console.error('Share failed:', error);
        }
    };

    return (


        <div className="inner-page-wrapper">
            <div className="inner-page-container" dir="rtl">
                {/* Header Info & Breadcrumb */}
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
                                        <span>{item.title}</span>
                                    )}
                                </span>
                            ))}
                        </nav>

                        {showShare && (
                            <button type="button" className="page-share-btn" onClick={handleShare}>
                                شارك
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid Layout */}


                {

                    showSideBar ? (<div className="page-content-grid">
                        {/* إعادة استخدام الـ Sidebar هنا */}
                        <div className="sidebar-wrapper">
                            {isLoading ? (
                                <SidebarNavSkeleton count={Math.max(sidebarItems.length, 4)} />
                            ) : (
                                <Sidebar title={sidebarTitle} items={sidebarItems} />
                            )}
                        </div>

                        <main className="main-content" aria-busy={isLoading}>
                            <div className="section-title">{
                                breadcrumb[breadcrumb.length - 1].title
                            }



                            </div>
                            {backButton ?
                                <Link to="/gallery" className="back-link">
                                    ‹ العودة إلى الألبومات
                                </Link> : <></>}
                            {isLoading ? renderPageSkeleton(loadingType) : children}</main>


                    </div>) : (<main className="main-content full-content" aria-busy={isLoading}>
                        {isLoading ? renderPageSkeleton(loadingType) : children}
                    </main>)

                }

            </div>
        </div>
    );
};

export default PageLayout;