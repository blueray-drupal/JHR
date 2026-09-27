import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { fetchMediaCenterNews } from '../../services/api/mediaCenterApi';
import { NewsRowSkeleton } from '../../components/skeleton/PageSkeletons';

const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
};

const mapNewsItem = (item) => ({
    id: item.id,
    image: item.image,
    date: item.field_date || item.created || '',
    title: item.title,
    summary:
        item.summary ||
        stripHtml(item.field_body?.processed || item.field_body?.value || item.body || ''),
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
                                    <span>{item.date}</span>
                                    <i className="fa-regular fa-calendar-days"></i>
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
