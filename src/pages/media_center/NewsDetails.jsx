import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PageLayout from '../../layout/page_layout/PageLayout';
import { excerptText, parseDrupalSingleNode } from '../../utils/drupalParser';
import './NewsDetails.css';
import { drupalBaseUrl } from '../../services/api/drupalUrl';

function NewsDetails() {
    const { id } = useParams();
    const location = useLocation();
    const baseUrl = drupalBaseUrl;
    const stateNews = location.state?.newsData;
    const stateMatches = stateNews && String(stateNews.id) === String(id);
    const [news, setNews] = useState(stateMatches ? stateNews : null);
    const [loading, setLoading] = useState(!stateMatches);

    useLayoutEffect(() => {
        if (stateMatches) {
            setNews(stateNews);
            setLoading(false);
            return;
        }

        setNews(null);
        setLoading(true);
    }, [id, stateMatches, stateNews]);

    useEffect(() => {
        if (stateMatches) return undefined;

        let cancelled = false;

        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/media_center/${id}?include=field_media_image,field_media_image.field_media_image`);
                if (!response.ok) {
                    console.log(response.status)
                }

                const data = await response.json()
                const parsed = parseDrupalSingleNode(data, baseUrl)

                if (!cancelled) setNews(parsed);

            }
            catch (error) {
                console.log(error)
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData()

        return () => {
            cancelled = true;
        };
    }, [baseUrl, id, stateMatches])

    const body = news?.field_body?.processed || news?.field_body?.value || '';
    const detailDescription = news
        ? excerptText(
            news.field_body?.summary ||
            news.summary ||
            news.field_body?.processed ||
            news.field_body?.value ||
            news.body ||
            "",
            180
        )
        : "";

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "المركز الإعلامي", link: null },
        { title: "الأخبار", link: "/news" },
        { title: news?.title || "", link: null },
    ];

    return (
        <PageLayout
            pageTitle={news?.title || "المركز الإعلامي"}
            pageMetaTitle={news?.title || "الأخبار"}
            pageMetaDescription={detailDescription}
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
