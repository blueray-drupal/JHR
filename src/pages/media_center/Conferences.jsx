import { React, useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import Card from "../../components/card/Card";
import { fetchMediaCenterByClassification } from "../../services/api/mediaCenterApi";
import { excerptText } from "../../utils/drupalParser";

const Conferences = () => {
    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "المركز الإعلامي", link: null },
        { title: "المؤتمرات", link: null },
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
                const conferences = await fetchMediaCenterByClassification("conferences");
                setItems(conferences);
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
                        description={excerptText(
                            item.summary ||
                                item.field_body?.processed ||
                                item.field_body?.value ||
                                item.body ||
                                "",
                            160
                        )}
                        image={item.image}
                        link={`/conferences/${item.id}`}
                    />
                ))}
            </div>
        </PageLayout>
    );
};

export default Conferences;
