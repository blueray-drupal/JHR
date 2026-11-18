/** Keep phone numbers LTR so +962… reads correctly inside RTL pages. */
export function withReadablePhoneNumbers(html) {
    if (!html) return "";
    return String(html).replace(
        /(\+?\d[\d\s\-()]{5,}\d)/g,
        '<span dir="ltr" class="contact-phone-ltr">$1</span>'
    );
}
