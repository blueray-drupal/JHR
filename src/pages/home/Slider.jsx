import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { parseDrupalMultipleNodes, toPlainText } from '../../utils/drupalParser';
import { drupalBaseUrl } from '../../services/api/drupalUrl';

import 'swiper/css';
import 'swiper/css/navigation';
import './Home.css';

import { Autoplay, Navigation } from 'swiper/modules';
import { SliderHeroSkeleton } from '../../components/skeleton/PageSkeletons';

const baseUrl = drupalBaseUrl;

const getSlideLink = (linkField) => {
    if (!linkField) return '';

    if (typeof linkField === 'string') {
        return linkField.trim();
    }

    if (typeof linkField !== 'object') return '';

    const uri = String(linkField.uri || linkField.url || '').trim();
    if (!uri) return '';

    if (uri.startsWith('internal:')) {
        return uri.replace('internal:', '') || '/';
    }

    if (uri.startsWith('entity:')) {
        return `/${uri.replace('entity:', '')}`;
    }

    return uri;
};

const isExternalLink = (href) =>
    /^https?:\/\//i.test(href) || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:');

export default function Slider() {
    const [sliderData, setSliderData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${baseUrl}/jsonapi/node/slider?include=field_media_image.field_media_image`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const slider = parseDrupalMultipleNodes(data, baseUrl);
                setSliderData(slider);
            } catch (error) {
                console.error('Error fetching slider:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="hero-slider-container">
                <SliderHeroSkeleton />
            </div>
        );
    }

    return (
        <div className="hero-slider-container">
            <Swiper
                navigation={true}
                modules={[Autoplay, Navigation]}
                loop={sliderData.length > 1}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                className="mySwiper"
            >
                {sliderData.map((slide) => {
                    const href = getSlideLink(slide.field_new_link);
                    const body = toPlainText(
                        slide.field_body?.processed ||
                            slide.field_body?.value ||
                            slide.body ||
                            ''
                    );

                    return (
                        <SwiperSlide key={slide.id}>
                            <div className="slide-content">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="slide-image"
                                />

                                <div className="slider-overlay">
                                    <div className="slider-wrapper">
                                        <h2 className="slider-title">
                                            {slide.title}
                                        </h2>

                                        {body && (
                                            <p className="slider-body">{body}</p>
                                        )}

                                        {href &&
                                            (isExternalLink(href) ? (
                                                <a
                                                    href={href}
                                                    className="slider-btn"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    عرض جميع المحطات
                                                </a>
                                            ) : (
                                                <Link to={href} className="slider-btn">
                                                    عرض جميع المحطات
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}
