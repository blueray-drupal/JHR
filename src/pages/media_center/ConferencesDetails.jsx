import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PageLayout from '../../layout/page_layout/PageLayout';
import { parseDrupalSingleNode } from '../../utils/drupalParser';
import './NewsDetails.css';

function ConferencesDetails() {
    const { id } = useParams();
    const location = useLocation();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [item, setItem] = useState(location.state?.itemData || null);
    const [loading, setLoading] = useState(!location.state?.itemData);

    useEffect(() => {
        if (location.state?.itemData) {
            setItem(location.state.itemData);
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

                setItem(parsed);

            }
            catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [baseUrl, id, location.state?.itemData])

    const body = item?.field_body?.processed || item?.field_body?.value || '';

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "المركز الإعلامي", link: null },
        { title: "المؤتمرات", link: "/conferences" },
        { title: item?.title || "", link: null },
    ];

    return (
        <PageLayout
            pageTitle={item?.title || "المركز الإعلامي"}
            breadcrumb={breadcrumb}
            isLoading={loading}
            loadingType="detail"
        >
            {item && (
                <div className="news-details">
                    <div
                        className="news-details-body"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                    {item.image && (
                        <div className="news-details-image">
                            <img src={item.image} alt={item.title} />
                        </div>
                    )}
                </div>
            )}
        </PageLayout>
    );
}

export default ConferencesDetails;
