import { React, useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import Card from "../../components/card/Card";
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
const Events = () => {

    const baseUrl = import.meta.env.VITE_BASE_URL;

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "المركز الإعلامي", link: null },
        { title: "الفعاليات", link: null },
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

                const response = await fetch(`${baseUrl}/jsonapi/node/media_center?include=field_media_image.field_media_image`);
                if (!response.ok) return
                const data = await response.json();
                const allData = parseDrupalMultipleNodes(data, baseUrl);
                const newsCard = allData.filter(card => card.field_media_center_classificatio == "events")
                console.log(newsCard)

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
                        description={item.field_body?.value}
                        image={item.image}
                        link={`/events/${item.id}`}
                    />
                ))}
            </div>
        </PageLayout>
    );
};

export default Events;