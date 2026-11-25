import { useEffect, useRef, useState } from "react";
import { useSitePreferences } from "../../context/SitePreferencesContext";
import { useLanguage } from "../../context/LanguageContext";
import accessibilityIcon from "../../../assets/acceicbility.svg";
import "./AccessibilityWidget.css";

const LinkIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10.7 5.22" />
        <path d="M14 11a5 5 0 0 0-7.07 0L4.8 13.12a5 5 0 0 0 7.07 7.07l1.41-1.41" />
    </svg>
);

const ContrastIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 1 0 16V4z" fill="currentColor" stroke="none" />
    </svg>
);

const SpacingIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16M4 18h16" />
        <path d="M8 9l-2 3 2 3M16 9l2 3-2 3" />
        <path d="M12 8v8" />
    </svg>
);

const FontTypeIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 18V8M6 8h6M12 18V8" />
        <path d="M5 6h8M4 20h10" />
    </svg>
);

const FontSizeIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 18V9M5 9h8M13 18V9" />
        <path d="M4 6h10" />
        <path d="M16 14h5M18.5 11.5v5" />
    </svg>
);

const ReadingIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4l7 16 2-6 6-2L5 4z" />
        <path d="M13 13l6 6" />
    </svg>
);

function OptionButton({ active, label, onClick, wide = false, icon }) {
    return (
        <button
            type="button"
            className={`a11y-option${wide ? " is-wide" : ""}${active ? " is-active" : ""}`}
            aria-pressed={active}
            onClick={onClick}
        >
            <span className="a11y-option-icon">{icon}</span>
            <span>{label}</span>
        </button>
    );
}

export default function AccessibilityWidget() {
    const { preferences, togglePreference, cycleFontSize, resetPreferences } = useSitePreferences();
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const [guideY, setGuideY] = useState(120);
    const rootRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;

        const onPointerDown = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };
        const onKeyDown = (event) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    useEffect(() => {
        if (!preferences.readingGuide) return undefined;

        const onMove = (event) => setGuideY(event.clientY);
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, [preferences.readingGuide]);

    return (
        <div className="a11y-widget" ref={rootRef}>
            {preferences.readingGuide && (
                <div
                    className="a11y-reading-guide"
                    style={{ top: `${guideY}px` }}
                    aria-hidden="true"
                />
            )}

            {open && (
                <section
                    className="a11y-panel"
                    role="dialog"
                    aria-label={t("خيارات تسهيل الوصول")}
                >
                    <header className="a11y-panel-head">
                        <h2>{t("بحاجة الى مساعدة؟")}</h2>
                        <p>{t("لتعديل موقع الويب وفقًا لاحتياجات الوصول الخاصة بك، حدد خيارًا واحدًا أو أكثر أدناه.")}</p>
                    </header>

                    <div className="a11y-options">
                        <OptionButton
                            label={t("تحديد الروابط")}
                            active={preferences.highlightLinks}
                            onClick={() => togglePreference("highlightLinks")}
                            icon={<LinkIcon />}
                        />
                        <OptionButton
                            label={t("ضوء البيان")}
                            active={preferences.contrast}
                            onClick={() => togglePreference("contrast")}
                            icon={<ContrastIcon />}
                        />
                        <OptionButton
                            wide
                            label={t("ضبط تباعد الاحرف")}
                            active={preferences.letterSpacing}
                            onClick={() => togglePreference("letterSpacing")}
                            icon={<SpacingIcon />}
                        />
                        <OptionButton
                            label={t("نوع الخط")}
                            active={preferences.readableFont}
                            onClick={() => togglePreference("readableFont")}
                            icon={<FontTypeIcon />}
                        />
                        <OptionButton
                            label={t("حجم الخط")}
                            active={preferences.fontScale !== 0}
                            onClick={cycleFontSize}
                            icon={<FontSizeIcon />}
                        />
                        <OptionButton
                            wide
                            label={t("القراءة")}
                            active={preferences.readingGuide}
                            onClick={() => togglePreference("readingGuide")}
                            icon={<ReadingIcon />}
                        />
                    </div>

                    <button
                        type="button"
                        className="a11y-reset"
                        onClick={resetPreferences}
                    >
                        {t("اعادة الضبط")}
                    </button>
                </section>
            )}

            <button
                type="button"
                className={`a11y-launcher${open ? " is-open" : ""}`}
                aria-label={t("خيارات تسهيل الوصول")}
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
            >
                <img src={accessibilityIcon} alt="" />
            </button>
        </div>
    );
}
