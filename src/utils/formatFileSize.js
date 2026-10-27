/**
 * Format byte size with Arabic unit labels.
 */
export function formatFileSizeAr(bytes) {
    const size = Number(bytes) || 0;

    if (size < 1024) {
        return `${size} بايت`;
    }

    if (size < 1024 * 1024) {
        return `${Math.round(size / 1024)} كيلوبايت`;
    }

    const mb = size / (1024 * 1024);
    const rounded = mb >= 10 ? Math.round(mb) : Number(mb.toFixed(1));
    return `${rounded} ميجابايت`;
}
