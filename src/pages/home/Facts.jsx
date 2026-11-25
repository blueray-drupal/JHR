import React, { useEffect, useState } from 'react';
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { FactsHomeSkeleton } from '../../components/skeleton/PageSkeletons';
import { drupalBaseUrl } from '../../services/api/drupalUrl';
import { useLanguage } from '../../context/LanguageContext';

const baseUrl = drupalBaseUrl;

/** تدشين سكة حديد الحجاز: 31 أغسطس 1903 */
const HEJAZ_INAUGURATION = new Date(1903, 7, 31, 23, 23, 44);

const pad2 = (n) => String(n).padStart(2, '0');

const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
};

/** تفكيك الوقت المنقضي منذ التدشين */
function getElapsedParts(now = new Date()) {
    let years = now.getFullYear() - HEJAZ_INAUGURATION.getFullYear();
    let months = now.getMonth() - HEJAZ_INAUGURATION.getMonth();
    let days = now.getDate() - HEJAZ_INAUGURATION.getDate();
    let hours = now.getHours() - HEJAZ_INAUGURATION.getHours();
    let minutes = now.getMinutes() - HEJAZ_INAUGURATION.getMinutes();
    let seconds = now.getSeconds() - HEJAZ_INAUGURATION.getSeconds();

    if (seconds < 0) {
        seconds += 60;
        minutes -= 1;
    }
    if (minutes < 0) {
        minutes += 60;
        hours -= 1;
    }
    if (hours < 0) {
        hours += 24;
        days -= 1;
    }
    if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months -= 1;
    }
    if (months < 0) {
        months += 12;
        years -= 1;
    }

    return {
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds),
    };
}

function isHistoryYearsFact(label) {
    return String(label || '').includes('سنة من التاريخ');
}

function LiveElapsedTicker({ elapsed }) {
    const { t } = useLanguage();
    const units = [
        { value: elapsed.months, label: 'أشهر' },
        { value: elapsed.days, label: 'أيام' },
        { value: elapsed.hours, label: 'ساعات' },
        { value: elapsed.minutes, label: 'دقائق' },
        { value: elapsed.seconds, label: 'ثوانٍ' },
    ];

    return (
        <div className="fact-live-ticker" aria-live="polite">
            {units.map((unit) => (
                <div className="fact-live-unit" key={unit.label}>
                    <span className="fact-live-value">{pad2(unit.value)}</span>
                    <span className="fact-live-label">{t(unit.label)}</span>
                </div>
            ))}
        </div>
    );
}

export default function Facts() {
    const [facts, setFacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [elapsed, setElapsed] = useState(() => getElapsedParts());

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

                const items = (factsNode?.files ?? []).map((fact) => {
                    const label = fact.field_number ?? stripHtml(fact.body);
                    return {
                        id: fact.id,
                        image: fact.image,
                        title: fact.title,
                        number: label,
                        isHistoryYears: isHistoryYearsFact(label),
                    };
                });

                setFacts(items);
            } catch (error) {
                console.error('Error fetching facts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const hasHistory = facts.some((f) => f.isHistoryYears);
        if (!hasHistory) return undefined;

        setElapsed(getElapsedParts());
        const id = window.setInterval(() => {
            setElapsed(getElapsedParts());
        }, 1000);

        return () => window.clearInterval(id);
    }, [facts]);

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
                {facts.map((fact) => {
                    const displayNumber = fact.isHistoryYears
                        ? String(elapsed.years)
                        : fact.title;

                    return (
                        <div
                            className={`fact-item${fact.isHistoryYears ? ' fact-item--live' : ''}`}
                            key={fact.id}
                        >
                            <div className="fact-icon">
                                {fact.image && (
                                    <img src={fact.image} alt={fact.number || fact.title} />
                                )}
                            </div>
                            <div className="fact-content">
                                <span className="fact-number">{displayNumber}</span>
                                <h3 className="fact-title">{fact.number}</h3>
                            </div>
                            {fact.isHistoryYears && (
                                <LiveElapsedTicker elapsed={elapsed} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
