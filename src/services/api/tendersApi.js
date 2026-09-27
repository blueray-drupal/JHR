import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { drupalBaseUrl, fetchAllDrupal } from './drupalUrl';

const getFormattedField = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.processed || field.value || '';
};

const normalizeDate = (dateValue) => {
    if (!dateValue) return '';
    return dateValue.split('T')[0];
};

export function mapTenderNode(node) {
    const bodyHtml =
        getFormattedField(node.field_body1) ||
        getFormattedField(node.field_body) ||
        (typeof node.body === 'string' ? node.body : '');

    const brief = (node.field_brief || '').trim();
    const dateRange = node.field_date_range || {};

    return {
        id: node.id,
        title: node.title || '',
        brief,
        bodyHtml,
        tenderNumber: node.field_tender_number || '',
        startDate: normalizeDate(dateRange.value),
        endDate: normalizeDate(dateRange.end_value),
    };
}

export async function fetchTenders() {
    const data = await fetchAllDrupal('/jsonapi/node/tenders?page[limit]=50');
    const nodes = parseDrupalMultipleNodes(data, drupalBaseUrl);

    return nodes.map(mapTenderNode);
}
