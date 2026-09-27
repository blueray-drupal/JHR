import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../layout/page_layout/PageLayout';
import { fetchTenders } from '../../services/api/tendersApi';
import './Tenders.css';

const formatDateRange = (startDate, endDate) => {
    if (startDate && endDate) {
        return `${startDate} - ${endDate}`;
    }
    return startDate || endDate || '';
};

function PageRating() {
    const [rating, setRating] = useState(0);

    return (
        <div className="page-rating">
            <span className="page-rating-label">كيف تقيم محتوى الصفحة</span>
            <div className="page-rating-stars" role="group" aria-label="تقييم الصفحة">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        type="button"
                        className={`page-rating-star ${value <= rating ? 'is-active' : ''}`}
                        onClick={() => setRating(value)}
                        aria-label={`${value} من 5`}
                    >
                        ★
                    </button>
                ))}
            </div>
        </div>
    );
}

function Tenders() {
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
                <p className="tenders-empty">لا توجد عطاءات متاحة حالياً.</p>
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
                                    اقرأ المزيد
                                    <span aria-hidden="true">&gt;</span>
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

            <PageRating />
        </PageLayout>
    );
}

export default Tenders;
