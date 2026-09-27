import React, { useEffect, useState } from 'react';
import NewsTicker from './NewsTicker';
import AboutHome from './AboutHome';
import Services from './Services';
import Facts from './Facts';
import LatestNews from './LatestNews';
import Slider from './slider';
import ExploreSection from './ExploreSection';
import { fetchMediaCenterNews } from '../../services/api/mediaCenterApi';

function Home() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const items = await fetchMediaCenterNews();
                setNews(items);
            } catch (error) {
                console.error('Error fetching home news:', error);
            }
        };

        loadNews();
    }, []);

    return (
        <>
            <Slider />
            <NewsTicker newsItems={news} />
            <AboutHome />
            <Services />
            <Facts />
            <LatestNews newsData={news} />
            <ExploreSection />
        </>
    );
}

export default Home;
