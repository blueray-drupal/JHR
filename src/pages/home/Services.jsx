import React, { useEffect, useState } from 'react';
import { fetchServices } from '../../services/api/servicesApi';
import { ServicesHomeSkeleton } from '../../components/skeleton/PageSkeletons';

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
                const homeSection = await fetchServices('home');
                setSection(homeSection);
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
