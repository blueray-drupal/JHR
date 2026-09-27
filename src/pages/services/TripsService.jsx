import React, { useState, useEffect } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import "./Services.css";
import { fetchServices } from "../../services/api/servicesApi";

function TripsService() {
    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "الخدمات", link: "/services" },
        { title: "الرحلات", link: null },
    ];

    const sidebarMenu = [
        { id: 1, title: "الرحلات", link: "/services/trips" },
        { id: 2, title: "حجز موقع", link: "/services/venue-booking" },
        { id: 3, title: "خدمات الاستثمار", link: "/services/investment" },
        { id: 4, title: "نقل البضائع", link: "/services/cargo" },
        { id: 5, title: "المتحف", link: "/services/museum" },
    ];

    const [section, setSection] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const found = await fetchServices("trips");
                setSection(found);
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
            pageTitle="الخدمات"
            breadcrumb={breadcrumb}
            sidebarTitle="الخدمات"
            sidebarItems={sidebarMenu}
            isLoading={loading}
            loadingType="cards"
        >
            <div className="service-cards-list">
                {section?.files?.map((item) => (
                    <div key={item.id} className="service-card">
                        <div className="service-card-header">
                            <h3>{item.title}</h3>
                        </div>
                        <div className="service-card-body">
                            <div className="service-card-image-wrapper">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <p
                                className="service-card-description"
                                dangerouslySetInnerHTML={{ __html: item.body }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </PageLayout>
    );
}

export default TripsService;
