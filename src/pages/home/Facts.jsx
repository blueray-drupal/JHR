import React, { useEffect, useState } from 'react';
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { FactsHomeSkeleton } from '../../components/skeleton/PageSkeletons';

const baseUrl = import.meta.env.VITE_BASE_URL;

const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
};

export default function Facts() {
    const [facts, setFacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${baseUrl}/jsonapi/node/facts?include=field_facts,field_facts.field_media_image,field_facts.field_media_image.field_media_image`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const nodes = parseDrupalMultipleNodes(data, baseUrl);
                const factsNode = nodes[0];

                const items = (factsNode?.files ?? []).map((fact) => ({
                    id: fact.id,
                    image: fact.image,
                    title: fact.title,
                    number: fact.field_number ?? stripHtml(fact.body),
                }));

                setFacts(items);
            } catch (error) {
                console.error('Error fetching facts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <section className="facts-section">
                <div className="facts-container">
                    <FactsHomeSkeleton />
                </div>
            </section>
        );
    }

    return (
        <div className="facts-section">
            <div className="facts-container">
                {facts.map((fact) => (
                    <div className="fact-item" key={fact.id}>
                        <div className="fact-icon">
                            {fact.image && (
                                <img src={fact.image} alt={fact.title} />
                            )}
                        </div>
                        <div className="fact-content">
                            <span className="fact-number">{fact.title}</span>
                            <h3 className="fact-title">{fact.number}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
