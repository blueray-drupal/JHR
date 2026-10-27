import React, { useState, useEffect } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import "./Complaints.css";
import { drupalBaseUrl } from '../../services/api/drupalUrl';

const APP_STORE_URL =
    "https://apps.apple.com/jo/app/%D8%A8%D8%AE%D8%AF%D9%85%D8%AA%D9%83%D9%85/id1272633075";
const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=com.rolp.cs.rolp";

const stripHtml = (html) =>
    String(html || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const extractHrefFromHtml = (html) => {
    const match = String(html || "").match(/href=["']([^"']+)["']/i);
    return match?.[1]?.trim() || "";
};

const isUsableLink = (link) =>
    Boolean(link) && link !== "#" && link !== "/" && !/^javascript:/i.test(link);

const isIosApp = (app) => /آيفون|iphone|ios|apple/i.test(app?.title || "");
const isAndroidApp = (app) => /أندرويد|اندرويد|android|google play/i.test(app?.title || "");

const resolveAppLink = (app) => {
    if (isUsableLink(app?.link)) return app.link;

    const fromBody = extractHrefFromHtml(app?.body);
    if (isUsableLink(fromBody)) return fromBody;

    if (isIosApp(app)) return APP_STORE_URL;
    if (isAndroidApp(app)) return PLAY_STORE_URL;

    return "#";
};

const resolveAppStoreLabel = (app) => {
    const plain = stripHtml(app?.body);
    if (plain && !/^google$/i.test(plain)) return plain;
    if (isIosApp(app)) return "Apple App Store";
    if (isAndroidApp(app)) return "Google Play";
    return plain;
};

function Complaints() {
    const baseUrl = drupalBaseUrl;
    const [mainSection, setMainSection] = useState(null);
    const [bottomSection, setBottomSection] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/complaints?include=field_paragraph_link,field_paragraph_link.field_media_image,field_paragraph_link.field_media_image.field_media_image`);
                if (!response.ok) {
                    console.log(response.status)
                }

                const data = await response.json()
                const allSections = parseDrupalMultipleNodes(data, baseUrl)

                setMainSection(allSections.find(s => s.field_position_link === "main"));
                setBottomSection(allSections.find(s => s.field_position_link === "bottom"));

            }
            catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])

    const mainItem = mainSection?.files?.[0];
    const appItems = (bottomSection?.files || []).map((app) => ({
        ...app,
        resolvedLink: resolveAppLink(app),
        storeLabel: resolveAppStoreLabel(app),
    }));

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "الشكاوى والاقتراحات", link: null },
    ];

    return (
        <PageLayout
            pageTitle="الشكاوى والاقتراحات"
            breadcrumb={breadcrumb}
            isLoading={loading}
            loadingType="content"
        >
            <div className="complaints-container">
                {mainItem && (
                    <div className="complaint-card main-platform-card">
                        <div className="platform-body">
                            <div className="platform-info">
                                <h3 className="platform-title">{mainSection.title}</h3>
                                {mainItem.image && (
                                <div className="platform-logo-wrapper">
                                    <img src={mainItem.image} alt={mainSection.title} className="platform-logo" />
                                </div>
                            )}
                                <div
                                    className="platform-description"
                                    dangerouslySetInnerHTML={{ __html: mainItem.body }}
                                />
                                {mainItem.link && (
                                    <a
                                        href={mainItem.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-link"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                        رابط منصة بخدمتكم: انقر هنا
                                    </a>
                                )}
                            </div>

                        </div>
                    </div>
                )}

                {bottomSection && (
                    <div className="complaint-card apps-download-card">
                        <h4 className="apps-title">{bottomSection.title}</h4>

                        <div className="app-buttons-group">
                            {appItems.map((app) => (
                                <a
                                    key={app.id}
                                    href={app.resolvedLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="app-btn"
                                >
                                    <svg
                                        className="external-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M9.99414 1.99902H13.9919V5.99675"
                                            stroke="#99A1AF"
                                            strokeWidth="1.33257"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M6.66211 9.32819L13.9913 1.99902"
                                            stroke="#99A1AF"
                                            strokeWidth="1.33257"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M11.9924 8.66206V12.6598C11.9924 13.0132 11.852 13.3521 11.6021 13.6021C11.3521 13.852 11.0132 13.9924 10.6598 13.9924H3.33062C2.9772 13.9924 2.63826 13.852 2.38835 13.6021C2.13844 13.3521 1.99805 13.0132 1.99805 12.6598V5.33062C1.99805 4.9772 2.13844 4.63826 2.38835 4.38835C2.63826 4.13844 2.9772 3.99805 3.33062 3.99805H7.32835"
                                            stroke="#99A1AF"
                                            strokeWidth="1.33257"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                    <div className="app-btn-text">
                                        <span className="app-name">{app.title}</span>
                                        <span className="app-store">{app.storeLabel}</span>
                                    </div>
                                    {app.image && (
                                        <img src={app.image} alt={app.title} className="app-btn-icon-img" />
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}

export default Complaints;
