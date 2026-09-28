import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { fetchMediaCenterNews } from '../../services/api/mediaCenterApi';
import { NewsTickerSkeleton } from '../../components/skeleton/PageSkeletons';
import { toPlainText } from '../../utils/drupalParser';

const TICKER_LIMIT = 12;
const SECONDS_PER_ITEM = 6;

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

    const items = useMemo(() => {
        const source = newsItems?.length > 0 ? newsItems : fetchedNews;

        return source
            .slice(0, TICKER_LIMIT)
            .map((item) => ({
                ...item,
                title: toPlainText(item.title),
            }))
            .filter((item) => item.title);
    }, [newsItems, fetchedNews]);

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
    const animationDuration = Math.max(items.length * SECONDS_PER_ITEM, 40);

    return (
        <div className="news-ticker-bar" dir="rtl">
            <div className="ticker-badge">
                <span>جديد المؤسسة</span>
            </div>

            <div className="ticker-content">
                <div
                    className="ticker-track"
                    style={{ animationDuration: `${animationDuration}s` }}
                >
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