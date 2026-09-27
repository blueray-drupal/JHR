import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { drupalBaseUrl, fetchAllDrupal } from './drupalUrl';

export async function fetchMediaCenterByClassification(classification) {
    const filter = encodeURIComponent(classification);
    const data = await fetchAllDrupal(
        `/jsonapi/node/media_center?filter[field_media_center_classificatio]=${filter}&include=field_media_image.field_media_image&page[limit]=50`
    );

    return parseDrupalMultipleNodes(data, drupalBaseUrl);
}

export async function fetchMediaCenterNews() {
    return fetchMediaCenterByClassification('news');
}
