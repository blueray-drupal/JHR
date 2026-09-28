import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "./home.css";
import "swiper/css";
import "swiper/css/navigation";
import toTopIcon from "../../../assets/totop.png";
import servicesBanner from "../../../assets/services.png";
import dataImageIcon from "../../../assets/data_image.svg";


const BackToTop = () => {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="العودة إلى أعلى الصفحة"
        >
            <img src={toTopIcon} alt="" />
        </button>
    );
};

const ExploreSection = () => {
    const bannerData = {
        image: servicesBanner,
        text: "متحف الخط الحديدي الحجازي الاردني حكاية بدأت من سكة حملت التاريخ الى متحف يحفظ الذاكرة ويحييها.",
    };

    const linksList = [
        {
            id: 1,
            title: "التقارير والدراسات والمسوحات",
            link: "/reports",
        },
        {
            id: 2,
            title: "مشروع الشباب والتكنولوجيا والوظائف في الأردن",
            link: "/youth-project",
        },
        {
            id: 3,
            title: "التشريعات والسياسات",
            link: "/policies",
        },
        {
            id: 4,
            title: "المهارات الرقمية",
            link: "/digital-skills",
        },
        {
            id: 5,
            title: "التشريعات والسياسات",
            link: "/policies",
        },

    ];

    const isSliderEnabled = linksList.length > 5;

    return (
        <section className="explore-section" dir="rtl">
            <BackToTop />

            <div className="explore-container">
                {/* البانر */}
                <div className="explore-banner">

                    <div className="explore-banner-wrapper">

                        <img
                            src={bannerData.image}
                            alt="Banner"
                            className="explore-banner-image"
                        />

                        <div className="explore-banner-content">
                            <p className="explore-banner-text">
                                {bannerData.text}
                            </p>
                        </div>

                    </div>

                </div>
                {/* روابط الموقع */}
                <div className="explore-links">
                    <div className="explore-header">


                        <h2 className="explore-title">
                            تصفح في الموقع
                        </h2>
                        {isSliderEnabled && (
                            <div className="explore-navigation">
                                <button
                                    id="custom-prev-btn"
                                    className="explore-navigation-button"
                                    aria-label="السابق"
                                >
                                    &#10094;
                                </button>

                                <button
                                    id="custom-next-btn"
                                    className="explore-navigation-button"
                                    aria-label="التالي"
                                >
                                    &#10095;
                                </button>
                            </div>
                        )}

                    </div>

                    <div className="explore-list">

                        <Swiper
                            modules={[Navigation]}
                            direction="vertical"
                            slidesPerView={4}
                            spaceBetween={0}
                            navigation={
                                isSliderEnabled
                                    ? {
                                        prevEl: "#custom-prev-btn",
                                        nextEl: "#custom-next-btn",
                                    }
                                    : false
                            }
                            className="explore-swiper"
                        >
                            {linksList.map((item) => (
                                <SwiperSlide key={item.id}>

                                    <Link
                                        to={item.link}
                                        className="explore-link"
                                    >
                                        <span className="explore-link-icon">
                                            <img
                                                src={dataImageIcon}
                                                alt=""
                                            />
                                        </span>

                                        <span className="explore-link-title">
                                            {item.title}
                                        </span>


                                    </Link>

                                </SwiperSlide>
                            ))}
                        </Swiper>

                    </div>
                </div>



            </div>

        </section>
    );
};

export default ExploreSection;