import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useSitePreferences } from "../../context/SitePreferencesContext";
import darkIcon from "../../../assets/dark.svg";
import lightIcon from "../../../assets/light.svg";
import increaseIcon from "../../../assets/increase.svg";
import decreaseIcon from "../../../assets/decrease.svg";
import resetIcon from "../../../assets/reset.svg";
import searchIcon from "../../../assets/search.svg";
import langIcon from "../../../assets/lang.svg";
import logoIcon from "../../../assets/logo.svg";

// ================= DATA =================

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <g clipPath="url(#clip0_header_phone)">
            <path
                d="M14.6584 11.2731V13.272C14.6592 13.4575 14.6212 13.6412 14.5468 13.8112C14.4725 13.9812 14.3635 14.1339 14.2267 14.2593C14.09 14.3848 13.9286 14.4803 13.7528 14.5397C13.577 14.5992 13.3907 14.6212 13.2059 14.6045C11.1556 14.3818 9.18621 13.6812 7.45586 12.559C5.846 11.5361 4.48111 10.1712 3.45814 8.56132C2.3321 6.82311 1.63134 4.84409 1.41263 2.7846C1.39598 2.60035 1.41788 2.41465 1.47693 2.23933C1.53598 2.06401 1.63089 1.9029 1.75562 1.76626C1.88034 1.62963 2.03215 1.52046 2.20138 1.44571C2.37061 1.37096 2.55355 1.33227 2.73855 1.3321H4.73741C5.06076 1.32891 5.37424 1.44342 5.61942 1.65427C5.86459 1.86512 6.02473 2.15792 6.06998 2.47811C6.15435 3.11779 6.31081 3.74587 6.53639 4.35038C6.62603 4.58886 6.64543 4.84804 6.59229 5.09721C6.53915 5.34638 6.4157 5.57509 6.23656 5.75624L5.39037 6.60243C6.33887 8.27051 7.72001 9.65166 9.3881 10.6002L10.2343 9.75397C10.4154 9.57483 10.6442 9.45137 10.8933 9.39823C11.1425 9.34509 11.4017 9.3645 11.6401 9.45414C12.2447 9.67971 12.8727 9.83617 13.5124 9.92054C13.8361 9.9662 14.1317 10.1292 14.343 10.3786C14.5543 10.628 14.6665 10.9463 14.6584 11.2731Z"
                stroke="white"
                strokeWidth="1.33257"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_header_phone">
                <rect width="15.9909" height="15.9909" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
            d="M2.66558 2.66504H13.3262C14.0621 2.66504 14.6588 3.26165 14.6588 3.99761V11.9931C14.6588 12.729 14.0621 13.3256 13.3262 13.3256H2.66558C1.92962 13.3256 1.33301 12.729 1.33301 11.9931V3.99761C1.33301 3.26165 1.92962 2.66504 2.66558 2.66504Z"
            stroke="white"
            strokeWidth="1.33257"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M14.6588 4.66406L8.68216 8.4619C8.47646 8.59078 8.23862 8.65913 7.99588 8.65913C7.75314 8.65913 7.51531 8.59078 7.30961 8.4619L1.33301 4.66406"
            stroke="white"
            strokeWidth="1.33257"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const contactItems = [
    {
        type: "phone",
        href: "tel:0096264895413",
        icon: <PhoneIcon />,
        text: "00962 - 6 - 4895413",
    },
    {
        type: "email",
        href: "mailto:info@jhr.gov.jo",
        icon: <EmailIcon />,
        text: "info@jhr.gov.jo",
    },
];

const topBarTools = [
    {
        type: "grayscale",
        title: "أبيض وأسود",
    },
    {
        type: "theme-light",
        icon: lightIcon,
        title: "الوضع الفاتح",
    },
    {
        type: "theme-dark",
        icon: darkIcon,
        title: "الوضع الداكن",
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
            {
                title: "المحطات",
                path: "/stations",
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
    grayscale: "toggleGrayscale",
    "theme-dark": "setDarkTheme",
    "theme-light": "setLightTheme",
    "zoom-in": "increaseFontSize",
    "zoom-out": "decreaseFontSize",
    reset: "resetPreferences",
};

// ================= HEADER =================

function Header() {
    const navigate = useNavigate();
    const {
        preferences,
        setTheme,
        increaseFontSize,
        decreaseFontSize,
        toggleGrayscale,
        resetPreferences,
    } = useSitePreferences();

    const handleToolClick = (type) => {
        switch (type) {
            case "grayscale":
                toggleGrayscale();
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
            case "grayscale":
                return preferences.grayscale;
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
                                className={`contact-item${item.type === "phone" || item.type === "email" ? " contact-item-ltr" : ""}`}
                                dir={item.type === "phone" || item.type === "email" ? "ltr" : undefined}
                            >
                                <span>{item.text}</span>
                                <span className="contact-item-icon">{item.icon}</span>
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
                                    className="lang-btn-icon keep-visible"
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
                                onClick={() => navigate("/search")}
                            >
                                <img
                                    src={searchIcon}
                                    alt=""
                                    className="tool-btn-icon tool-btn-icon-search keep-visible"
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
                                            {tool.type === "grayscale" ? (
                                                <i
                                                    className={`fa-solid ${preferences.grayscale ? "fa-eye" : "fa-eye-slash"} tool-btn-fa`}
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <img
                                                    src={tool.icon}
                                                    alt=""
                                                    className="tool-btn-icon keep-visible"
                                                    aria-hidden="true"
                                                />
                                            )}
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

                    <Link to="/" className="brand" aria-label="الصفحة الرئيسية">

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

                    </Link>


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
