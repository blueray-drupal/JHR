import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useSitePreferences } from "../../context/SitePreferencesContext";
import darkIcon from "../../../assets/dark.svg";
import lightIcon from "../../../assets/light.svg";
import increaseIcon from "../../../assets/increase.svg";
import decreaseIcon from "../../../assets/decrease.svg";
import resetIcon from "../../../assets/reset.svg";
import hideImagesIcon from "../../../assets/hide.svg";
import searchIcon from "../../../assets/search.svg";
import langIcon from "../../../assets/lang.svg";
import logoIcon from "../../../assets/logo.svg";

// ================= DATA =================

const contactItems = [
    {
        type: "phone",
        href: "tel:0096264895413",
        icon: "fa-solid fa-phone",
        text: "00962 - 6 - 4895413",
    },
    {
        type: "email",
        href: "mailto:info@jhr.gov.jo",
        icon: "fa-regular fa-envelope",
        text: "info@jhr.gov.jo",
    },
];

const topBarTools = [
    {
        type: "hide-images",
        icon: hideImagesIcon,
        title: "إخفاء / إظهار الصور",
    },
    {
        type: "theme-dark",
        icon: darkIcon,
        title: "الوضع الداكن",
    },
    {
        type: "theme-light",
        icon: lightIcon,
        title: "الوضع الفاتح",
    },
    {
        type: "zoom-in",
        icon: increaseIcon,
        title: "تكبير الخط",
    },
    {
        type: "zoom-out",
        icon: decreaseIcon,
        title: "تصغير الخط",
    },
    {
        type: "reset",
        icon: resetIcon,
        title: "إعادة الضبط",
    },
];

const secondaryNav = [
    {
        title: "الرئيسية",
        path: "/",
    },
    {
        title: "الوظائف",
        path: "/jobs",
    },
    {
        title: "خريطة الموقع",
        path: "/sitemap",
    },
    {
        title: "العطاءات",
        path: "/tenders",
    },
    {
        title: "الشكاوى والاقتراحات",
        path: "/complaints",
    },
    {
        title: "حق الحصول على معلومة",
        path: "/freedom-of-information",
    },
];

const mainNav = [
    {
        title: "عن المؤسسة",
        path: "/about",
        dropdown: [
            {
                title: "نبذة عن المؤسسة",
                path: "/about",
            },
            {
                title: "الكلمة الترحيبية",
                path: "/welcome-speech",
            },
            {
                title: "مجلس الإدارة",
                path: "/board-directors",
            },
            {
                title: "الهيكل التنظيمي",
                path: "/organization-chart",
            },
            {
                title: "المدراء العامون",
                path: "/general-managers",
            },
        ],
    },
    {
        title: "الخدمات",
        path: "/services/trips",
        dropdown: [
            { id: 1, title: "الرحلات", path: "/services/trips" },
            { id: 2, title: "حجز موقع", path: "/services/venue-booking" },
            { id: 3, title: "خدمات الاستثمار", path: "/services/investment" },
            { id: 4, title: "نقل البضائع", path: "/services/cargo" },
            { id: 5, title: "المتحف", path: "/services/museum" },
        ],
    },
    {
        title: "التشريعات",
        path: "/legislations/laws",
        dropdown: [
            { id: 1, title: "القوانين", path: "/legislations/laws" },
            { id: 2, title: "الأنظمة", path: "/legislations/regulations" },
        ],

    },
    {
        title: "مركز المعلومات",
        path: "/info-center/projects",
        dropdown: [
            { id: 1, title: "المشاريع", path: "/info-center/projects" },
            { id: 2, title: "الموازنة", path: "/info-center/budget" },
            { id: 3, title: "التقارير السنوية", path: "/info-center/annual-reports" },
            { id: 4, title: "الاتفاقيات", path: "/info-center/agreements" },
        ],
    },
    {
        title: "المركز الإعلامي",
        path: "/news",
        dropdown: [
            { id: 1, title: "الأخبار", path: "/news" },
            { id: 2, title: "ألبوم الصور", path: "/gallery" },
            { id: 3, title: "الفعاليات", path: "/events" },
            { id: 4, title: "المؤتمرات", path: "/conferences" },
        ],
    },
    {
        title: "اتصل بنا",
        path: "/contact-us",
        dropdown: [],
    },
];

const toolActionMap = {
    "hide-images": "toggleHideImages",
    "theme-dark": "setDarkTheme",
    "theme-light": "setLightTheme",
    "zoom-in": "increaseFontSize",
    "zoom-out": "decreaseFontSize",
    reset: "resetPreferences",
};

// ================= HEADER =================

function Header() {
    const {
        preferences,
        setTheme,
        increaseFontSize,
        decreaseFontSize,
        toggleHideImages,
        resetPreferences,
    } = useSitePreferences();

    const handleToolClick = (type) => {
        switch (type) {
            case "hide-images":
                toggleHideImages();
                break;
            case "theme-dark":
                setTheme("dark");
                break;
            case "theme-light":
                setTheme("light");
                break;
            case "zoom-in":
                increaseFontSize();
                break;
            case "zoom-out":
                decreaseFontSize();
                break;
            case "reset":
                resetPreferences();
                break;
            default:
                break;
        }
    };

    const isToolActive = (type) => {
        switch (type) {
            case "hide-images":
                return preferences.hideImages;
            case "theme-dark":
                return preferences.theme === "dark";
            case "theme-light":
                return preferences.theme === "light";
            default:
                return false;
        }
    };

    return (
        <header className="site-header" dir="rtl" id="header">

            {/* ================= TOP BAR ================= */}

            <div className="top-bar">
                <div className="top-bar-container">

                    {/* Contact */}

                    <div className="top-bar-contact">

                        {contactItems.map((item) => (
                            <a
                                key={item.type}
                                href={item.href}
                                className="contact-item"
                            >
                                <i className={item.icon}></i>
                                {item.text}
                            </a>
                        ))}

                    </div>


                    {/* Tools */}

                    <div className="top-bar-tools">
                        <div className="top-bar-tools-gold">
                            <button
                                type="button"
                                className="lang-btn"
                                aria-label="English"
                            >
                                <img
                                    src={langIcon}
                                    alt=""
                                    className="lang-btn-icon"
                                    aria-hidden="true"
                                />
                                English
                            </button>
                            <span className="top-bar-tools-divider" aria-hidden="true" />
                            <button
                                type="button"
                                className="tool-btn tool-btn-search"
                                title="البحث"
                                aria-label="البحث"
                            >
                                <img
                                    src={searchIcon}
                                    alt=""
                                    className="tool-btn-icon tool-btn-icon-search"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        <div className="top-bar-tools-utilities">
                            {topBarTools
                                .filter(
                                    (tool) =>
                                        tool.type !== "language" && tool.type !== "search"
                                )
                                .map((tool) => {
                                    const hasAction = Boolean(toolActionMap[tool.type]);

                                    return (
                                        <button
                                            key={tool.type}
                                            type="button"
                                            className={`tool-btn ${hasAction && isToolActive(tool.type) ? "tool-btn-active" : ""}`}
                                            onClick={() => handleToolClick(tool.type)}
                                            title={tool.title}
                                            aria-label={tool.title}
                                            aria-pressed={isToolActive(tool.type)}
                                        >
                                            <img
                                                src={tool.icon}
                                                alt=""
                                                className="tool-btn-icon"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    );
                                })}
                        </div>
                    </div>

                </div>
            </div>


            {/* ================= MIDDLE BAR ================= */}

            <div className="middle-bar">

                <div className="middle-bar-container">

                    {/* Brand */}

                    <div className="brand">

                        <div className="brand-logo">
                            <img
                                src={logoIcon}
                                alt="Jordan Hejaz Railway Logo"
                                className="keep-visible"
                            />
                        </div>

                        <div className="brand-text">
                            <h2>
                                مؤسسة الخط الحديدي الحجازي الأردني
                            </h2>

                            <span>
                                Jordan Hejaz Railway
                            </span>
                        </div>

                    </div>


                    {/* Secondary Navigation */}

                    <nav className="secondary-nav">

                        <ul>

                            {secondaryNav.map((item, index) => (
                                <React.Fragment key={item.path}>

                                    <li>
                                        <Link to={item.path}>
                                            {item.title}
                                        </Link>
                                    </li>

                                    {index !== secondaryNav.length - 1 && (
                                        <li>/</li>
                                    )}

                                </React.Fragment>
                            ))}

                        </ul>

                    </nav>

                </div>

            </div>


            {/* ================= MAIN NAV ================= */}

            <nav className="main-nav">

                <div className="main-nav-container">

                    <ul>

                        {mainNav.map((item) => (

                            <li
                                key={item.path}
                                className={`nav-item ${item.dropdown?.length
                                    ? "dropdown"
                                    : ""
                                    }`}
                            >

                                <Link
                                    to={item.path}
                                    className="nav-link"
                                >
                                    {item.title}

                                    {item.dropdown?.length > 0 && (
                                        <i className="fa-solid fa-chevron-down icon-arrow"></i>
                                    )}
                                </Link>


                                {item.dropdown?.length > 0 && (

                                    <ul className="dropdown-menu">

                                        {item.dropdown.map((dropdownItem) => (

                                            <li key={dropdownItem.path}>

                                                <Link
                                                    to={dropdownItem.path}
                                                >
                                                    {dropdownItem.title}
                                                </Link>

                                            </li>

                                        ))}

                                    </ul>

                                )}

                            </li>

                        ))}

                    </ul>

                </div>

            </nav>

        </header>
    );
}

export default Header;
