import React, { useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import { parseDrupalMultipleNodes } from "../../utils/drupalParser";
import "./UsefulLinks.css";

// تجميع الروابط حسب التصنيف (Taxonomy Term) مع الحفاظ على ترتيب المصطلحات
const groupLinksByType = (links) => {
    const groups = new Map();

    links.forEach((link) => {
        const term = link.field_link_type;
        if (!term?.id) return;

        if (!groups.has(term.id)) {
            groups.set(term.id, { id: term.id, name: term.name, weight: term.weight, items: [] });
        }

        groups.get(term.id).items.push(link);
    });

    return [...groups.values()].sort((a, b) => a.weight - b.weight);
};

function UsefulLinks() {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${baseUrl}/jsonapi/node/useful_links?include=field_link_type`
                );

                if (!response.ok) {
                    console.log(response.status);
                }

                const data = await response.json();
                const allLinks = parseDrupalMultipleNodes(data, baseUrl);

                setGroups(groupLinksByType(allLinks));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl]);

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "روابط مفيدة", link: null },
    ];

    return (
        <PageLayout
            pageTitle="روابط مفيدة"
            breadcrumb={breadcrumb}
            isLoading={loading}
            loadingType="useful-links"
        >
            <div className="useful-links-container">
                {groups.map((group) => (
                    <section key={group.id} className="useful-links-group">
                        <h2 className="useful-links-group-title">{group.name}</h2>
                        <ul className="useful-links-list">
                            {group.items.map((item) => (
                                <li key={item.id} className="useful-links-item">
                                    <a
                                        href={item.field_link}
                                        className="useful-links-anchor"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </PageLayout>
    );
}

export default UsefulLinks;
