import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./pageRating.css";

const STARS = [1, 2, 3, 4, 5];

function storageKey(pathname) {
    return `page-rating:${pathname || "/"}`;
}

export default function PageRating() {
    const { pathname } = useLocation();
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);

    useEffect(() => {
        try {
            const saved = Number(localStorage.getItem(storageKey(pathname)) || 0);
            setRating(saved >= 1 && saved <= 5 ? saved : 0);
        } catch {
            setRating(0);
        }
        setHovered(0);
    }, [pathname]);

    const handleRate = (value) => {
        setRating(value);
        try {
            localStorage.setItem(storageKey(pathname), String(value));
        } catch {
            /* ignore storage errors */
        }
    };

    const activeValue = hovered || rating;

    return (
        <section className="page-rating" dir="rtl" aria-label="تقييم محتوى الصفحة">
            <div className="page-rating-inner">
                <p className="page-rating-label">كيف تقيم محتوى الصفحة</p>

                <div
                    className="page-rating-stars"
                    role="radiogroup"
                    aria-label="تقييم من 1 إلى 5 نجوم"
                    onMouseLeave={() => setHovered(0)}
                >
                    {STARS.map((value) => {
                        const filled = value <= activeValue;

                        return (
                            <button
                                key={value}
                                type="button"
                                className={`page-rating-star${filled ? " is-filled" : ""}`}
                                role="radio"
                                aria-checked={rating === value}
                                aria-label={`${value} من 5`}
                                onMouseEnter={() => setHovered(value)}
                                onFocus={() => setHovered(value)}
                                onBlur={() => setHovered(0)}
                                onClick={() => handleRate(value)}
                            >
                                <i className={filled ? "fa-solid fa-star" : "fa-regular fa-star"} />
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
