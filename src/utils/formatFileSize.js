const UNITS = {
    en: { b: "b", kb: "kb", mb: "MB" },
    ar: { b: "بايت", kb: "ك.ب", mb: "م.ب" },
};

/**
 * Split byte size into numeric value + unit.
 * @param {number} bytes
 * @param {"en"|"ar"} [locale="en"]
 */
export function getFileSizeParts(bytes, locale = "en") {
    const size = Number(bytes) || 0;
    const labels = UNITS[locale] || UNITS.en;

    if (size < 1024) {
        return { value: String(size), unit: labels.b };
    }

    if (size < 1024 * 1024) {
        return { value: String(Math.round(size / 1024)), unit: labels.kb };
    }

    const mb = size / (1024 * 1024);
    const rounded = mb >= 10 ? Math.round(mb) : Number(mb.toFixed(1));
    return { value: String(rounded), unit: labels.mb };
}

/**
 * Format byte size as "13 kb" / "2.1 MB" (or Arabic short units).
 */
export function formatFileSizeAr(bytes, locale = "en") {
    const { value, unit } = getFileSizeParts(bytes, locale);
    return `${value} ${unit}`;
}
