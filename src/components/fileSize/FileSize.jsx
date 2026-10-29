import React from "react";
import { getFileSizeParts } from "../../utils/formatFileSize";

export default function FileSize({ bytes, className = "", locale = "en" }) {
    const { value, unit } = getFileSizeParts(bytes, locale);

    return (
        <span className={className} dir="rtl">
            <span className="document-size-value">{value}</span>
            <span className="document-size-unit">{unit}</span>
        </span>
    );
}
