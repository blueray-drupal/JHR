import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';

import 'swiper/css';
import 'swiper/css/navigation';
import './Home.css';

import { Navigation } from 'swiper/modules';
import { SliderHeroSkeleton } from '../../components/skeleton/PageSkeletons';

const baseUrl = import.meta.env.VITE_BASE_URL;

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
                    throw new Error(
                        `HTTP error! Status: ${response.status}`
                    );
                }

                const data = await response.json();

                const slider = parseDrupalMultipleNodes(
                    data,
                    baseUrl
                );

                console.log(slider)

                setSliderData(slider);

                console.log('Slider data:', slider);
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
                modules={[Navigation]}
                className="mySwiper"
            >
                {sliderData.map((slide) => (
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

                                    <p className="slider-body">
                                        {slide.field_body?.value.replace(/<[^>]*>/g, '')}
                                    </p>

                                    <a
                                        href="#"
                                        className="slider-btn"
                                    >
                                        عرض جميع المحطات
                                    </a>

                                </div>
                            </div>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}