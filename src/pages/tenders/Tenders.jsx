import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../layout/page_layout/PageLayout';
import { fetchTenders } from '../../services/api/tendersApi';
import './Tenders.css';
import { useLanguage } from '../../context/LanguageContext';

const formatDateRange = (startDate, endDate) => {
    if (startDate && endDate) {
        return `${startDate} - ${endDate}`;
    }
    return startDate || endDate || '';
};

function Tenders() {
    const { t } = useLanguage();
    const [tenders, setTenders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTenders = async () => {
            try {
                const items = await fetchTenders();
                setTenders(items);
            } catch (error) {
                console.error('Error fetching tenders:', error);
                setTenders([]);
            } finally {
                setLoading(false);
            }
        };

        loadTenders();
    }, []);

    const breadcrumb = [
        { title: 'الرئيسية', link: '/' },
        { title: 'العطاءات', link: null },
    ];

    return (
        <PageLayout
            pageTitle="العطاءات"
            breadcrumb={breadcrumb}
            showShare
            isLoading={loading}
            loadingType="tenders"
        >
            {!loading && tenders.length === 0 && (
                <p className="tenders-empty">{t("لا توجد عطاءات متاحة حالياً.")}</p>
            )}

            {!loading && tenders.length > 0 && (
                <div className="tenders-list">
                    {tenders.map((tender) => (
                        <article className="tender-card" key={tender.id}>
                            <div className="tender-card-main">
                                <h2 className="tender-card-title">{tender.title}</h2>
                                {tender.brief && (
                                    <p className="tender-card-description">{tender.brief}</p>
                                )}
                                <Link
                                    to={`/tenders/${tender.id}`}
                                    state={{ tenderData: tender }}
                                    className="tender-card-link"
                                >
                                    {t("اقرأ المزيد")}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M9.9948 3.99771L5.99707 7.99544L9.9948 11.9932"
                                            stroke="#0C6F8C"
                                            strokeWidth="1.33257"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Link>
                            </div>

                            <div className="tender-card-meta">
                                {tender.tenderNumber && (
                                    <span className="tender-number-badge">
                                        {`رقم العطاء : ${tender.tenderNumber}`}
                                    </span>
                                )}
                                {formatDateRange(tender.startDate, tender.endDate) && (
                                    <span className="tender-date">
                                        {formatDateRange(tender.startDate, tender.endDate)}
                                    </span>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </PageLayout>
    );
}

export default Tenders;
