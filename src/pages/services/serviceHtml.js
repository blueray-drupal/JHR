const PHONE_PATTERN = /(\+?\d[\d\s\-()]{5,}\d)/g;

const toTelHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, "")}`;

/**
 * Keep phone numbers readable in RTL and fix broken Drupal phone links
 * like <a href="https://00962...">00962...</a>.
 */
export function withReadablePhoneNumbers(html) {
  if (!html) return "";

  let out = String(html);

  // Normalize existing anchors that use a phone number as href.
  out = out.replace(
    /<a\b([^>]*?)href\s*=\s*(["'])(?:https?:\/\/)?(\+?\d[\d\s\-()]{5,}\d)\2([^>]*)>([\s\S]*?)<\/a>/gi,
    (_match, pre, _quote, phone, post, inner) => {
      const text = String(inner).replace(/<[^>]+>/g, "").trim() || phone;
      return `<a href="${toTelHref(phone)}" class="contact-phone-ltr" dir="ltr"${pre}${post}>${text}</a>`;
    }
  );

  // Wrap plain phone numbers in text only (never inside tag attributes).
  out = out.replace(/(^|>)([^<]+)/g, (match, boundary, text) => {
    const fixed = text.replace(
      PHONE_PATTERN,
      '<span dir="ltr" class="contact-phone-ltr">$1</span>'
    );
    return `${boundary}${fixed}`;
  });

  return out;
}
