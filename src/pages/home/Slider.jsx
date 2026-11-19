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

    const value = Array.isArray(linkField) ? linkField[0] : linkField;
    if (!value) return '';

    if (typeof value === 'string') {
        const raw = value.trim();
        if (!raw) return '';
        if (raw.startsWith('internal:')) return raw.slice('internal:'.length) || '/';
        if (raw.startsWith('entity:')) return `/${raw.slice('entity:'.length)}`;
        return raw;
    }

    if (typeof value !== 'object') return '';

    const resolvable = String(value.resolvable_uri || '').trim();
    if (resolvable) return resolvable;

    const uri = String(value.uri || value.url || '').trim();
    if (!uri) return '';

    if (uri.startsWith('internal:')) {
        return uri.slice('internal:'.length) || '/';
    }

    if (uri.startsWith('entity:')) {
        return `/${uri.slice('entity:'.length)}`;
    }

    if (uri.startsWith('route:') && resolvable) {
        return resolvable;
    }

    return uri;
};

const getSlideLinkLabel = (linkField, href) => {
    const value = Array.isArray(linkField) ? linkField[0] : linkField;
    const title = String(value?.title || '').trim();
    if (title) return title;
    if (href === '/stations' || href?.includes('/stations')) {
        return 'عرض جميع المحطات';
    }
    return 'اقرأ المزيد';
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
                    const linkField =
                        slide.field_new_link ||
                        slide.rawAttributes?.field_new_link ||
                        slide.field_link ||
                        null;
                    const href = getSlideLink(linkField);
                    const linkLabel = getSlideLinkLabel(linkField, href);
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

                                        {href ? (
                                            isExternalLink(href) ? (
                                                <a
                                                    href={href}
                                                    className="slider-btn"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {linkLabel}
                                                </a>
                                            ) : (
                                                <Link to={href} className="slider-btn">
                                                    {linkLabel}
                                                </Link>
                                            )
                                        ) : null}
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
