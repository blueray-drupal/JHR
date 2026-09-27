import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PageLayout from '../../layout/page_layout/PageLayout';
import { parseDrupalSingleNode } from '../../utils/drupalParser';
import './NewsDetails.css';
import { drupalBaseUrl } from '../../services/api/drupalUrl';

function NewsDetails() {
    const { id } = useParams();
    const location = useLocation();
    const baseUrl = drupalBaseUrl;
    const [news, setNews] = useState(location.state?.newsData || null);
    const [loading, setLoading] = useState(!location.state?.newsData);

    useEffect(() => {
        if (location.state?.newsData) {
            setNews(location.state.newsData);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/media_center/${id}?include=field_media_image,field_media_image.field_media_image`);
                if (!response.ok) {
                    console.log(response.status)
                }

                const data = await response.json()
                const parsed = parseDrupalSingleNode(data, baseUrl)

                setNews(parsed);

            }
            catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [baseUrl, id, location.state?.newsData])

    const body = news?.field_body?.processed || news?.field_body?.value || '';

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "المركز الإعلامي", link: null },
        { title: "الأخبار", link: "/news" },
        { title: news?.title || "", link: null },
    ];

    return (
        <PageLayout
            pageTitle={news?.title || "المركز الإعلامي"}
            breadcrumb={breadcrumb}
            isLoading={loading}
            loadingType="detail"
        >
            {news && (
                <div className="news-details">
                    <div
                        className="news-details-body"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                    {news.image && (
                        <div className="news-details-image">
                            <img src={news.image} alt={news.title} />
                        </div>
                    )}
                </div>
            )}
        </PageLayout>
    );
}

export default NewsDetails;
