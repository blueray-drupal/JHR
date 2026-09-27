import React, { useState, useEffect } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import "./Services.css";
import { fetchServices } from "../../services/api/servicesApi";

function Museum() {
    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "الخدمات", link: "/services" },
        { title: "المتحف", link: null },
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
                const found = await fetchServices("museum");
                setSection(found);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const item = section?.files?.[0];
    const bodyParts = item?.body ? item.body.match(/<p>.*?<\/p>/gs) || [] : [];

    return (
        <PageLayout
            pageTitle="الخدمات"
            breadcrumb={breadcrumb}
            sidebarTitle="الخدمات"
            sidebarItems={sidebarMenu}
            isLoading={loading}
            loadingType="content"
        >
            {item && (
                <div className="venue-booking-content">
                    <div className="venue-image-wrapper">
                        <img src={item.image} alt={section.title} />
                    </div>
                    <div className="venue-info-section">
                        <p className="venue-description" style={{ whiteSpace: "pre-line" }}>
                            {item.title}
                        </p>

                        <div className="contact-info-box">
                            {bodyParts.map((part, index) => (
                                <div
                                    key={index}
                                    className={index === 0 ? "contact-title" : "phone-number"}
                                    dangerouslySetInnerHTML={{ __html: part }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}

export default Museum;
