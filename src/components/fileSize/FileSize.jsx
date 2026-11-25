import React from "react";
import { getFileSizeParts } from "../../utils/formatFileSize";
import { useLanguage } from "../../context/LanguageContext";

export default function FileSize({ bytes, className = "", locale }) {
    const { lang } = useLanguage();
    const { value, unit } = getFileSizeParts(bytes, locale || lang);

    return (
        <span className={className}>
            <span className="document-size-value">{value}</span>
            <span className="document-size-unit">{unit}</span>
        </span>
    );
}
