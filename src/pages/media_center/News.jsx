import { React, useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import Card from "../../components/card/Card";
import { fetchMediaCenterNews } from '../../services/api/mediaCenterApi';
import { excerptText } from '../../utils/drupalParser';

const News = () => {

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "المركز الإعلامي", link: null },
        { title: "الأخبار", link: null },
    ];

    const sidebarMenu = [
        { id: 1, title: "الأخبار", link: "/news" },
        { id: 2, title: "ألبوم الصور", link: "/gallery" },
        { id: 3, title: "الفعاليات", link: "/events" },
        { id: 4, title: "المؤتمرات", link: "/conferences" },
    ];
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {

                const newsCard = await fetchMediaCenterNews();
                setNews(newsCard);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }

        }
        fetchData()
    }, [])
    return (
        <PageLayout
            pageTitle="المركز الإعلامي"
            breadcrumb={breadcrumb}
            sidebarTitle="المركز الإعلامي"
            sidebarItems={sidebarMenu}
            isLoading={loading}
            loadingType="cards"
        >


            <div className="cards-list">
                {news.map((item) => (
                    <Card
                        key={item.id}
                        title={item.title}
                        date={item.field_date}
                        description={excerptText(
                            item.summary ||
                                item.field_body?.processed ||
                                item.field_body?.value ||
                                item.body ||
                                '',
                            160
                        )}
                        image={item.image}
                        link={`/news/${item.id}`}
                    />
                ))}
            </div>
        </PageLayout>
    );
};

export default News;