import React, { useEffect, useState } from 'react';
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { ServicesHomeSkeleton } from '../../components/skeleton/PageSkeletons';

const baseUrl = import.meta.env.VITE_BASE_URL;

const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
};

function Services() {
    const [section, setSection] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${baseUrl}/jsonapi/node/services?include=field_services,field_services.field_media_image,field_services.field_media_image.field_media_image`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const allSections = parseDrupalMultipleNodes(data, baseUrl);
                const homeSection = allSections.find(
                    (item) => item.field_section === 'home'
                );

                setSection(homeSection ?? null);
            } catch (error) {
                console.error('Error fetching home services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const servicesItems = section?.files ?? [];
    const sectionTitle = section?.title ?? 'خدماتنا';

    if (loading) {
        return (
            <section className="services-home">
                <div className="services-container">
                    <ServicesHomeSkeleton />
                </div>
            </section>
        );
    }

    return (
        <section className="services-home">
            <div className="services-container">
                <h2 className="services-title">{sectionTitle}</h2>
                <div className="service-cards">
                    {servicesItems.map((service) => (
                        <div className="service-card" key={service.id}>
                            <div className="service-icon">
                                {service.image && (
                                    <img src={service.image} alt={service.title} />
                                )}
                            </div>
                            <h3 className="service-card-title">{service.title}</h3>
                            <p className="service-card-body">{stripHtml(service.body)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Services;
