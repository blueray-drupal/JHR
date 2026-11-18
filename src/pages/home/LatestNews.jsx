import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { fetchMediaCenterNews } from '../../services/api/mediaCenterApi';
import { NewsRowSkeleton } from '../../components/skeleton/PageSkeletons';
import { excerptText } from '../../utils/drupalParser';

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <g clipPath="url(#clip0_news_calendar)">
            <path
                d="M5.33008 1.33252V3.99767"
                stroke="#6A7282"
                strokeWidth="1.33257"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.6606 1.33252V3.99767"
                stroke="#6A7282"
                strokeWidth="1.33257"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3.3316 2.66504H12.6596C13.3956 2.66504 13.9922 3.26165 13.9922 3.99761V13.3256C13.9922 14.0616 13.3956 14.6582 12.6596 14.6582H3.3316C2.59564 14.6582 1.99902 14.0616 1.99902 13.3256V3.99761C1.99902 3.26165 2.59564 2.66504 3.3316 2.66504Z"
                stroke="#6A7282"
                strokeWidth="1.33257"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.99902 6.66309H13.9922"
                stroke="#6A7282"
                strokeWidth="1.33257"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_news_calendar">
                <rect width="15.9909" height="15.9909" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const mapNewsItem = (item) => ({
    id: item.id,
    image: item.image,
    date: item.field_date || item.created || '',
    title: item.title,
    summary: excerptText(
        item.summary ||
            item.field_body?.processed ||
            item.field_body?.value ||
            item.body ||
            '',
        140
    ),
    link: `/news/${item.id}`,
});

function LatestNews({ newsData }) {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (newsData?.length > 0) {
            setNewsList(newsData.map(mapNewsItem).slice(0, 4));
            setLoading(false);
            return;
        }

        const loadNews = async () => {
            try {
                const news = await fetchMediaCenterNews();
                setNewsList(news.map(mapNewsItem).slice(0, 4));
            } catch (error) {
                console.error('Error fetching news:', error);
                setNewsList([]);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [newsData]);

    if (loading) {
        return (
            <section className="latest-news-section" dir="rtl">
                <div className="news-container">
                    <NewsRowSkeleton />
                </div>
            </section>
        );
    }

    if (newsList.length === 0) {
        return null;
    }

    return (
        <section className="latest-news-section" dir="rtl">
            <div className="news-container">
                <h2 className="news-section-title">آخر الأخبار</h2>

                <div className="news-grid">
                    {newsList.map((item) => (
                        <article key={item.id} className="news-card">
                            <div className="news-card-image">
                                {item.image && (
                                    <img src={item.image} alt={item.title} />
                                )}
                            </div>
                            <div className="news-card-content">
                                <div className="news-card-date">
                                    <span className="news-card-date-icon">
                                        <CalendarIcon />
                                    </span>
                                    <span dir="ltr">{item.date}</span>
                                </div>
                                <h3 className="news-card-title">{item.title}</h3>
                                <p className="news-card-summary">{item.summary}</p>
                                <Link to={item.link} className="news-card-link">
                                    اقرأ المزيد
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default LatestNews;
