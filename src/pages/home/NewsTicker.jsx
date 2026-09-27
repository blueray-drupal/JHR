import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { fetchMediaCenterNews } from '../../services/api/mediaCenterApi';
import { NewsTickerSkeleton } from '../../components/skeleton/PageSkeletons';

function NewsTicker({ newsItems }) {
    const [fetchedNews, setFetchedNews] = useState([]);
    const [loading, setLoading] = useState(!newsItems?.length);

    useEffect(() => {
        if (newsItems?.length > 0) {
            setLoading(false);
            return;
        }

        const loadNews = async () => {
            setLoading(true);
            try {
                const news = await fetchMediaCenterNews();
                setFetchedNews(news);
            } catch (error) {
                console.error('Error fetching ticker news:', error);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [newsItems]);

    const items = newsItems?.length > 0 ? newsItems : fetchedNews;

    if (loading) {
        return (
            <div className="news-ticker-bar" dir="rtl">
                <NewsTickerSkeleton />
            </div>
        );
    }

    if (items.length === 0) {
        return null;
    }

    const duplicatedItems = [...items, ...items];

    return (
        <div className="news-ticker-bar" dir="rtl">
            <div className="ticker-badge">
                <span>جديد المؤسسة</span>
            </div>

            <div className="ticker-content">
                <div className="ticker-track">
                    {duplicatedItems.map((item, index) => (
                        <React.Fragment key={`${item.id}-${index}`}>
                            <Link
                                to={`/news/${item.id}`}
                                state={{ newsData: item }}
                                className="ticker-item"
                            >
                                {item.title}
                            </Link>
                            <span className="ticker-separator" aria-hidden="true">■</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NewsTicker;