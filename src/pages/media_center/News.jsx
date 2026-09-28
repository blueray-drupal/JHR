import { React, useEffect, useMemo, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import Card from "../../components/card/Card";
import Pagination from "../../components/pagination/Pagination";
import { fetchMediaCenterNews } from "../../services/api/mediaCenterApi";
import { excerptText } from "../../utils/drupalParser";

const ITEMS_PER_PAGE = 8;

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
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const newsCard = await fetchMediaCenterNews();
                setNews(newsCard);
                setCurrentPage(1);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalPages = Math.max(1, Math.ceil(news.length / ITEMS_PER_PAGE));

    const pageItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return news.slice(start, start + ITEMS_PER_PAGE);
    }, [news, currentPage]);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                {pageItems.map((item) => (
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

            {!loading && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={news.length}
                    onPageChange={handlePageChange}
                />
            )}
        </PageLayout>
    );
};

export default News;
