import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./card.css";
import learnMoreIcon from "../../../assets/learn-more.png";

const Card = ({
    varient,
    title,
    description,
    date,
    image,
    link = "#",
    linkText = "عرض المزيد",
    imageAlt = "",
    className = "",
}) => {
    const location = useLocation();
    const { t } = useLanguage();
    const isNews = location.pathname === "/news";
    const isEvents = location.pathname === "/events";
    const isConferences = location.pathname === "/conferences";
    const variantClass = isNews
        ? " news-cards"
        : isEvents
          ? " event-cards"
          : isConferences
            ? " conference-cards"
            : "";

    return (
        <article className={`custom-card ${className}${variantClass}`.trim()}>
            {image && (
                <div className="card-image-wrapper">
                    <img src={image} alt={imageAlt || title} className="card-image" />
                </div>
            )}

            <div className="card-info">
                {date && <span className="card-date">{date}</span>}
                {title && <h3 className="card-title">{title}</h3>}
                {description && <p className="card-description">{description}</p>}

                {link && (
                    <Link to={link} className="card-link">
                        {t(linkText)} <span className="arrow"><img src={learnMoreIcon} alt="" /></span>
                    </Link>
                )}
            </div>
        </article>
    );
};

export default Card;
