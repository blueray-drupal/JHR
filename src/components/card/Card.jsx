import React from "react";
import { Link, useLocation } from "react-router-dom";
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
    const isNews = location.pathname === "/news";

    return (
        <article className={`custom-card ${className}${isNews ? " news-cards" : ""}`}>
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
                        {linkText} <span className="arrow"><img src={learnMoreIcon} alt="" /></span>
                    </Link>
                )}
            </div>
        </article>
    );
};

export default Card;