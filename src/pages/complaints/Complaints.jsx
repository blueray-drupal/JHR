import React, { useState, useEffect } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import "./Complaints.css";

function Complaints() {
    const baseUrl = import.meta.env.VITE_BASE_URL;
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
    const appItems = bottomSection?.files || [];

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
                                    href={app.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="app-btn"
                                >
                                                        <svg className="external-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                            
                                    <div className="app-btn-text">
                                        <span className="app-name">{app.title}</span>
                                        <span
                                            className="app-store"
                                            dangerouslySetInnerHTML={{ __html: app.body }}
                                        />
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
