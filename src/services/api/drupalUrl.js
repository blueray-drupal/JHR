/**
 * Browser API calls always go through same-origin `/api`
 * (Vite proxy in dev, Apache .htaccess proxy in production).
 *
 * Media URLs from Drupal that are already absolute (http...) stay absolute.
 * Relative file paths are prefixed with /api so they also go through the proxy.
 */
export const apiBaseUrl = "/api";

export const drupalPublicUrl = (
  import.meta.env.VITE_DRUPAL_URL || "http://backend.jhr.com.dedi8785.your-server.de"
).replace(/\/$/, "");

/** Used by pages for fetch + by parser as domain prefix for relative file paths */
export const drupalBaseUrl = apiBaseUrl;

/** Convert absolute Drupal URLs (e.g. pagination next) to same-origin /api paths */
export function toApiUrl(urlOrPath) {
  if (!urlOrPath) return urlOrPath;
  if (urlOrPath.startsWith("/api/") || urlOrPath === "/api") return urlOrPath;
  if (urlOrPath.startsWith("/") && !urlOrPath.startsWith("//")) {
    return `${apiBaseUrl}${urlOrPath}`;
  }

  try {
    const parsed = new URL(urlOrPath, typeof window !== "undefined" ? window.location.origin : drupalPublicUrl);
    return `${apiBaseUrl}${parsed.pathname}${parsed.search}`;
  } catch {
    return urlOrPath;
  }
}

export async function fetchAllDrupal(path) {
  const items = [];
  const included = [];
  let url = path.startsWith("http") || path.startsWith("/api/")
    ? toApiUrl(path)
    : `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

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
    url = data.links?.next?.href ? toApiUrl(data.links.next.href) : null;
  }

  return { data: items, included };
}
