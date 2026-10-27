import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "./home.css";
import "swiper/css";
import "swiper/css/navigation";
import toTopIcon from "../../../assets/totop.png";
import servicesBanner from "../../../assets/services.png";
import dataImageIcon from "../../../assets/data_image.svg";
import { parseDrupalMultipleNodes, toPlainText } from "../../utils/drupalParser";
import { drupalBaseUrl } from "../../services/api/drupalUrl";

const DEFAULT_BANNER = {
    image: servicesBanner,
    text: "متحف الخط الحديدي الحجازي الاردني حكاية بدأت من سكة حملت التاريخ الى متحف يحفظ الذاكرة ويحييها.",
};

const DEFAULT_LINKS = [
    { id: 1, title: "التقارير والدراسات والمسوحات", link: "/reports" },
    { id: 2, title: "مشروع الشباب والتكنولوجيا والوظائف في الأردن", link: "/youth-project" },
    { id: 3, title: "التشريعات والسياسات", link: "/policies" },
    { id: 4, title: "المهارات الرقمية", link: "/digital-skills" },
    { id: 5, title: "التشريعات والسياسات", link: "/policies" },
];

const getLinkUri = (linkField) => {
    if (!linkField) return "";

    if (typeof linkField === "string") {
        return linkField.trim();
    }

    const uri = String(linkField.uri || linkField.url || "").trim();
    if (!uri) return "";

    if (uri.startsWith("internal:")) {
        return uri.replace("internal:", "") || "/";
    }

    if (uri.startsWith("entity:")) {
        return `/${uri.replace("entity:", "")}`;
    }

    return uri;
};

const isExternalLink = (href) =>
    /^https?:\/\//i.test(href) ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");

const parseSectionLinks = (linksField = []) => {
    if (!Array.isArray(linksField)) return [];

    return linksField
        .map((item, index) => {
            const link = getLinkUri(item);
            const title = String(item?.title || "").trim();
            if (!link || !title) return null;

            return {
                id: `explore-link-${index}`,
                title,
                link,
            };
        })
        .filter(Boolean);
};

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

const ExploreLink = ({ item }) => {
    const content = (
        <>
            <span className="explore-link-icon">
                <img src={dataImageIcon} alt="" />
            </span>
            <span className="explore-link-title">{item.title}</span>
        </>
    );

    if (isExternalLink(item.link)) {
        return (
            <a
                href={item.link}
                className="explore-link"
                target="_blank"
                rel="noopener noreferrer"
            >
                {content}
            </a>
        );
    }

    return (
        <Link to={item.link} className="explore-link">
            {content}
        </Link>
    );
};

const ExploreSection = () => {
    const [bannerData, setBannerData] = useState(DEFAULT_BANNER);
    const [linksList, setLinksList] = useState(DEFAULT_LINKS);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${drupalBaseUrl}/jsonapi/node/explore_section?include=field_main_image,field_main_image.field_media_image&page[limit]=1`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const nodes = parseDrupalMultipleNodes(data, drupalBaseUrl);
                const section = nodes[0];

                if (!section) return;

                const image =
                    (typeof section.field_main_image === "string"
                        ? section.field_main_image
                        : null) ||
                    section.image ||
                    DEFAULT_BANNER.image;

                const rawBody =
                    section.body ||
                    (typeof section.field_body === "object"
                        ? section.field_body?.processed || section.field_body?.value
                        : section.field_body);

                const text = toPlainText(rawBody) || DEFAULT_BANNER.text;

                const links = parseSectionLinks(section.field_section_links);

                setBannerData({ image, text });
                if (links.length > 0) {
                    setLinksList(links);
                }
            } catch (error) {
                console.error("Error fetching explore section:", error);
            }
        };

        fetchData();
    }, []);

    const isSliderEnabled = linksList.length > 4;

    return (
        <section className="explore-section" dir="rtl">
            <BackToTop />

            <div className="explore-container">
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

                <div className="explore-links">
                    <div className="explore-header">
                        <h2 className="explore-title">تصفح في الموقع</h2>
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
                                    <ExploreLink item={item} />
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
