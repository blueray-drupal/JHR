export const drupalBaseUrl = (import.meta.env.VITE_DRUPAL_URL || "").replace(/\/$/, "");

export async function fetchAllDrupal(path) {
    const items = [];
    const included = [];
    let url = path.startsWith("http") ? path : `${drupalBaseUrl}${path}`;

    while (url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
            items.push(...data.data);
        } else if (data.data) {
            items.push(data.data);
        }
        if (Array.isArray(data.included)) {
            included.push(...data.included);
        }
        url = data.links?.next?.href || null;
    }

    return { data: items, included };
}
