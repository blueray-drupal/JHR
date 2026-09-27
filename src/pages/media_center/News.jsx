import { React, useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import Card from "../../components/card/Card";
import { fetchMediaCenterNews } from '../../services/api/mediaCenterApi';

const stripHtml = (html) => {
    if (!html) return "";
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
};

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
    const conferencesList = [
        {
            id: 1,
            date: "15/03/2024",
            title: "المؤتمر الدولي للسكك الحديدية التراثية",
            description: "مؤتمر الدولي يجمع خبراء وباحثين من 20 دولة لمناقشة أفضل الممارسات في صون وتطوير خطوط السكك الحديدية التراثية.",
            image: "../../../assets/slider.png",
            link: "/conferences/1"
        },
        {
            id: 2,
            date: "20/06/2024",
            title: "المؤتمر الدولي للسكك الحديدية التراثية",
            description: "مؤتمر الدولي يجمع خبراء وباحثين من 20 دولة لمناقشة أفضل الممارسات في صون وتطوير خطوط السكك الحديدية التراثية.",
            image: "../../../assets/slider.png",
            link: "/conferences/2"
        }
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
    console.log(news)
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
                        description={stripHtml(item.field_body?.processed || item.field_body?.value)}
                        image={item.image}
                        link={`/news/${item.id}`}
                    />
                ))}
            </div>
        </PageLayout>
    );
};

export default News;