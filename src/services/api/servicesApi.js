import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { drupalBaseUrl } from './drupalUrl';

const SERVICES_INCLUDE =
    'field_services,field_services.field_media_image,field_services.field_media_image.field_media_image';

export async function fetchServices(sectionKey) {
    const response = await fetch(
        `${drupalBaseUrl}/jsonapi/node/services?include=${SERVICES_INCLUDE}`
    );

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const allSections = parseDrupalMultipleNodes(data, drupalBaseUrl);

    if (!sectionKey) {
        return allSections;
    }

    return allSections.find((section) => section.field_section === sectionKey) || null;
}
