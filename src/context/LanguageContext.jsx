import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EN } from "../i18n/dictionary";

const STORAGE_KEY = "jhr-language";
const LanguageContext = createContext(null);

function readLanguage() {
    try {
        return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "ar";
    } catch {
        return "ar";
    }
}

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(readLanguage);

    useEffect(() => {
        const isEnglish = lang === "en";
        document.documentElement.lang = isEnglish ? "en" : "ar";
        document.documentElement.dir = isEnglish ? "ltr" : "rtl";
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            /* ignore storage errors */
        }
    }, [lang]);

    const toggleLanguage = useCallback(() => {
        setLang((current) => (current === "en" ? "ar" : "en"));
    }, []);

    const t = useCallback((value) => {
        if (lang !== "en" || value == null) return value;
        const text = String(value);
        return Object.prototype.hasOwnProperty.call(EN, text) ? EN[text] : value;
    }, [lang]);

    const value = useMemo(
        () => ({ lang, toggleLanguage, t }),
        [lang, toggleLanguage, t],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
