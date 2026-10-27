import { React, useEffect, useMemo, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import Card from "../../components/card/Card";
import { fetchMediaCenterNews } from "../../services/api/mediaCenterApi";
import { excerptText } from "../../utils/drupalParser";
import "./News.css";

const INITIAL_VISIBLE = 8;
const LOAD_MORE_STEP = 8;

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
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const newsCard = await fetchMediaCenterNews();
                setNews(newsCard);
                setVisibleCount(INITIAL_VISIBLE);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const visibleItems = useMemo(
        () => news.slice(0, visibleCount),
        [news, visibleCount]
    );

    const hasMore = visibleCount < news.length;

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, news.length));
    };

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
                {visibleItems.map((item) => (
                    <Card
                        key={item.id}
                        title={item.title}
                        date={item.field_date || item.created}
                        description={excerptText(
                            item.summary ||
                                item.field_body?.processed ||
                                item.field_body?.value ||
                                item.body ||
                                "",
                            160
                        )}
                        image={item.image}
                        link={`/news/${item.id}`}
                    />
                ))}
            </div>

            {!loading && hasMore && (
                <div className="news-load-more-wrap">
                    <button
                        type="button"
                        className="news-load-more-btn"
                        onClick={handleLoadMore}
                    >
                        عرض المزيد
                    </button>
                </div>
            )}
        </PageLayout>
    );
};

export default News;
