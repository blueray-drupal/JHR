import { React, useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import Card from "../../components/card/Card";
import { fetchMediaCenterByClassification } from "../../services/api/mediaCenterApi";

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

const Events = () => {
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

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const events = await fetchMediaCenterByClassification("events");
                setItems(events);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                {items.map((item) => (
                    <Card
                        key={item.id}
                        title={item.title}
                        date={item.field_date}
                        description={stripHtml(item.field_body?.processed || item.field_body?.value)}
                        image={item.image}
                        link={`/events/${item.id}`}
                    />
                ))}
            </div>
        </PageLayout>
    );
};

export default Events;
