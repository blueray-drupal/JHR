export const STORAGE_KEY = 'jhr-site-preferences';

export const DEFAULT_PREFERENCES = {
    theme: 'light',
    fontScale: 0,
    grayscale: false,
    highlightLinks: false,
    contrast: false,
    letterSpacing: false,
    readableFont: false,
    readingGuide: false,
};

export const FONT_SCALE_MIN = -3;
export const FONT_SCALE_MAX = 3;
export const FONT_SCALE_STEP = 0.1;

export function loadSitePreferences() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            const legacyTheme = localStorage.getItem('theme');
            if (legacyTheme === 'dark' || legacyTheme === 'light') {
                return { ...DEFAULT_PREFERENCES, theme: legacyTheme };
            }
            return { ...DEFAULT_PREFERENCES };
        }

        const parsed = JSON.parse(stored);
        return {
            theme: parsed.theme === 'dark' ? 'dark' : 'light',
            fontScale: clampFontScale(Number(parsed.fontScale) || 0),
            grayscale: Boolean(parsed.grayscale),
            highlightLinks: Boolean(parsed.highlightLinks),
            contrast: Boolean(parsed.contrast),
            letterSpacing: Boolean(parsed.letterSpacing),
            readableFont: Boolean(parsed.readableFont),
            readingGuide: Boolean(parsed.readingGuide),
        };
    } catch {
        return { ...DEFAULT_PREFERENCES };
    }
}

export function saveSitePreferences(preferences) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export function clampFontScale(value) {
    return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, value));
}

export function getFontScaleFactor(fontScale) {
    return 1 + clampFontScale(fontScale) * FONT_SCALE_STEP;
}

function applyThemeClasses(root, body, theme) {
    const isDark = theme === 'dark';

    root.setAttribute('data-theme', theme);
    root.style.colorScheme = isDark ? 'dark' : 'light';

    body.classList.toggle('site-dark-theme', isDark);
    body.classList.toggle('site-light-theme', !isDark);
}

function applyFontScale(root, fontScale) {
    const factor = getFontScaleFactor(fontScale);

    root.setAttribute('data-font-scale', String(fontScale));
    root.style.setProperty('--font-scale', String(factor));

    if (factor !== 1) {
        root.style.zoom = String(factor);
    } else {
        root.style.removeProperty('zoom');
    }
}

function setFlag(root, name, enabled) {
    if (enabled) {
        root.setAttribute(name, 'true');
    } else {
        root.removeAttribute(name);
    }
}

function applyVisualFilters(root, preferences) {
    const filters = [];
    if (preferences.grayscale) filters.push('grayscale(1)');
    if (preferences.contrast) filters.push('contrast(1.45)');

    if (filters.length) {
        root.style.filter = filters.join(' ');
    } else {
        root.style.removeProperty('filter');
    }
}

function applyGrayscale(root, body, grayscale) {
    if (grayscale) {
        root.setAttribute('data-grayscale', 'true');
    } else {
        root.removeAttribute('data-grayscale');
    }

    body.classList.toggle('site-grayscale', grayscale);

    // Clear legacy hide-images mode if it was previously enabled.
    root.removeAttribute('data-hide-images');
    body.classList.remove('site-hide-images');
}

/**
 * Applies theme, font scale, and grayscale preferences to the whole site.
 * Call on boot (main.jsx) and whenever preferences change.
 */
export function applySitePreferences(preferences) {
    const root = document.documentElement;
    const body = document.body;

    const normalized = {
        theme: preferences.theme === 'dark' ? 'dark' : 'light',
        fontScale: clampFontScale(preferences.fontScale),
        grayscale: Boolean(preferences.grayscale),
        highlightLinks: Boolean(preferences.highlightLinks),
        contrast: Boolean(preferences.contrast),
        letterSpacing: Boolean(preferences.letterSpacing),
        readableFont: Boolean(preferences.readableFont),
        readingGuide: Boolean(preferences.readingGuide),
    };

    applyThemeClasses(root, body, normalized.theme);
    applyFontScale(root, normalized.fontScale);
    applyGrayscale(root, body, normalized.grayscale);
    applyVisualFilters(root, normalized);
    setFlag(root, 'data-highlight-links', normalized.highlightLinks);
    setFlag(root, 'data-contrast', normalized.contrast);
    setFlag(root, 'data-letter-spacing', normalized.letterSpacing);
    setFlag(root, 'data-readable-font', normalized.readableFont);
    setFlag(root, 'data-reading-guide', normalized.readingGuide);

    saveSitePreferences(normalized);
    return normalized;
}

export function resetSitePreferences() {
    return applySitePreferences({ ...DEFAULT_PREFERENCES });
}
