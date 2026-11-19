import { apiBaseUrl, drupalPublicUrl, fetchAllDrupal, toApiUrl } from './drupalUrl';

/** Marker positions from theme/css/inner.css (#block-quicktabsalmhtat) */
export const STATION_MARKER_POSITIONS = {
  1: { top: 325, left: 226 },
  2: { top: 383, left: 217 },
  3: { top: 351, left: 215 },
  4: { top: 413, left: 218 },
  5: { top: 362, left: 213 },
  6: { top: 287, left: 262 },
  7: { top: 232, left: 276 },
  8: { top: 271, left: 272 },
  9: { top: 497, left: 248 },
  10: { bottom: 222, left: 178 },
};

export const STATIONS_MAP_BG = '/stations/maaap2.png';
export const STATIONS_MARKER_IMG = '/stations/pos2.png';

const toAssetUrl = (filePath) => {
  if (!filePath) return '';
  if (/^https?:\/\//i.test(filePath)) return filePath;
  const origin = String(drupalPublicUrl || '').replace(/\/+$/, '');
  return `${origin}${filePath.startsWith('/') ? filePath : `/${filePath}`}`;
};

const imageRefsOf = (node) => {
  const refs = node?.relationships?.field_images?.data;
  if (!refs) return [];
  return Array.isArray(refs) ? refs : [refs];
};

const mapStation = (node, included = []) => {
  const attrs = node?.attributes || {};
  const branch = Number(attrs.field_branches);
  const images = imageRefsOf(node)
    .map((ref) => {
      const file = included.find(
        (item) => item.id === ref.id && item.type === 'file--file'
      );
      const url = file?.attributes?.uri?.url;
      if (!url) return null;
      return {
        id: ref.id,
        src: toAssetUrl(url),
        alt: ref.meta?.alt || attrs.title || '',
      };
    })
    .filter(Boolean);

  return {
    id: node.id,
    title: attrs.title || '',
    body: attrs.body?.processed || attrs.body?.value || '',
    branch: Number.isFinite(branch) ? branch : null,
    images,
    position: STATION_MARKER_POSITIONS[branch] || null,
  };
};

/**
 * List stations with images ordered by field_images relationship.
 * GET /jsonapi/node/almhtat?include=field_images
 */
export async function fetchStations() {
  const payload = await fetchAllDrupal(
    '/jsonapi/node/almhtat?include=field_images&sort=field_branches&page[limit]=50'
  );
  const included = payload.included || [];

  return (payload.data || [])
    .map((node) => mapStation(node, included))
    .filter((station) => station.branch >= 1 && station.branch <= 10)
    .sort((a, b) => a.branch - b.branch);
}

/**
 * Station detail by UUID.
 * GET /jsonapi/node/almhtat/{uuid}?include=field_images
 */
export async function fetchStationById(uuid) {
  if (!uuid) return null;

  const response = await fetch(
    toApiUrl(`/jsonapi/node/almhtat/${encodeURIComponent(uuid)}?include=field_images`),
    { headers: { Accept: 'application/vnd.api+json' } }
  );

  if (!response.ok) {
    throw new Error(`Failed to load station (${response.status})`);
  }

  const payload = await response.json();
  if (!payload?.data) return null;

  return mapStation(payload.data, payload.included || []);
}

export { apiBaseUrl };
