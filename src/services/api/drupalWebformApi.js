/**
 * drupalWebformApi.js
 *
 * Reusable API layer for Drupal Webform REST — powered by the shared axios instance.
 * Works with any Drupal site that has the webform_rest module installed.
 *
 * Endpoints used:
 *   GET  /webform_rest/{webformId}/elements?_format=json
 *   POST /webform_rest/submit?_format=json
 *   GET  /session/token  (CSRF — required by Drupal for state-changing requests)
 */

import { drupalApi } from './axios.config';

// ─── CSRF Token ───────────────────────────────────────────────────────────────
// Drupal requires an X-CSRF-Token on all state-changing requests.
// Cached and auto-expired after 5 min.

let _csrfCache = null; // { token, expiresAt }

const getCsrfToken = async () => {
  const now = Date.now();

  if (_csrfCache && _csrfCache.expiresAt > now) {
    return _csrfCache.token;
  }

  try {
    // drupalApi already has the correct baseURL — just hit the path
    const { data } = await drupalApi.get('/session/token', {
      // Override Content-Type: token endpoint returns plain text
      headers: { Accept: 'text/plain' },
      // Tell axios not to parse as JSON
      transformResponse: [(raw) => raw],
    });

    const token = (data ?? '').trim();
    _csrfCache = { token, expiresAt: now + 5 * 60 * 1000 };
    return token;
  } catch (err) {
    console.warn('[drupalWebformApi] CSRF fetch failed:', err);
    return null;
  }
};

const invalidateCsrf = () => { _csrfCache = null; };

// ─── Error Parser ─────────────────────────────────────────────────────────────
// Normalises the many shapes Drupal can return errors in into a plain string.

const parseAxiosError = (err) => {
  const json = err.response?.data;

  if (!json) return err.message || 'Request failed';
  if (typeof json === 'string') return json.slice(0, 400);

  if (typeof json.message === 'string') return json.message;
  if (typeof json.error   === 'string') return json.error;
  if (typeof json.detail  === 'string') return json.detail;
  if (typeof json.title   === 'string') return json.title;

  // Array of error objects (JSON:API style)
  if (Array.isArray(json.errors)) {
    const parts = json.errors
      .map((e) => e.detail || e.message || e.title || (typeof e === 'string' ? e : null))
      .filter(Boolean);
    if (parts.length) return parts.join(' ');
  }

  // Flat error object { field: message }
  if (json.error && typeof json.error === 'object') {
    const flat = Object.entries(json.error)
      .map(([k, v]) => {
        if (!v) return null;
        if (typeof v === 'string') return `${k}: ${v}`;
        if (Array.isArray(v))     return `${k}: ${v.join(', ')}`;
        return `${k}: ${JSON.stringify(v)}`;
      })
      .filter(Boolean);
    if (flat.length) return flat.join('; ');
  }

  return JSON.stringify(json).slice(0, 400);
};

// ─── Field-level Error Parser ─────────────────────────────────────────────────

/**
 * Extracts per-field validation messages so a form can show them inline.
 * Drupal webform_rest returns them as { error: { field_key: "message" } }.
 *
 * @param {*} json - Raw response body
 * @returns {Object<string,string>} { fieldKey: message } — empty when none
 */
const parseFieldErrors = (json) => {
  const source = json?.error ?? json?.errors;
  if (!source || typeof source !== 'object' || Array.isArray(source)) return {};

  const out = {};
  for (const [key, value] of Object.entries(source)) {
    if (!value) continue;
    if (typeof value === 'string')  out[key] = value;
    else if (Array.isArray(value))  out[key] = value.filter(Boolean).join(' ');
  }
  return out;
};

/** Builds an Error carrying both a readable message and inline field errors. */
const buildSubmissionError = (err, fallbackMessage) => {
  const error = new Error(fallbackMessage ?? parseAxiosError(err));
  error.fieldErrors = parseFieldErrors(err.response?.data);
  error.status = err.response?.status;
  return error;
};

// ─── Fetch Elements ───────────────────────────────────────────────────────────

/**
 * Fetches the raw element schema from Drupal.
 *
 * @param {string} webformId - Drupal webform machine name (e.g. "contact_us")
 * @returns {Promise<object>}
 */
export const fetchWebformElements = async (webformId) => {
  try {
    const { data } = await drupalApi.get(
      `/webform_rest/${encodeURIComponent(webformId)}/elements`,
      { params: { _format: 'json' } }
    );
    return data;
  } catch (err) {
    throw new Error(
      `Failed to load webform "${webformId}" (${err.response?.status ?? 'network'}): ${parseAxiosError(err)}`
    );
  }
};

// ─── Submit (text-only) ───────────────────────────────────────────────────────

/**
 * Submits a webform with no file fields.
 *
 * @param {string} webformId - Drupal webform machine name
 * @param {object} data      - Key/value pairs matching Drupal webform element keys
 * @returns {Promise<object>}
 */
export const submitWebform = async (webformId, data) => {
  const csrfToken = await getCsrfToken();

  try {
    const { data: response } = await drupalApi.post(
      '/webform_rest/submit',
      { webform_id: webformId, ...data },
      {
        params: { _format: 'json' },
        timeout: 45000,
        headers: csrfToken
          ? {
              'X-CSRF-Token': csrfToken,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }
          : {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
      }
    );
    return response ?? {};
  } catch (err) {
    invalidateCsrf(); // token may have expired — bust the cache
    throw buildSubmissionError(err);
  }
};

// ─── Submit (with file upload) ────────────────────────────────────────────────

const extractInputValue = (html, name) => {
  const re = new RegExp(
    `name=["']${name}["'][^>]*value=["']([^"']*)["']|value=["']([^"']*)["'][^>]*name=["']${name}["']`,
    'i'
  );
  const match = html.match(re);
  return match?.[1] || match?.[2] || '';
};

const getWebformOrigin = () => {
  // في التطوير نمر عبر بروكسي Vite (/api) لتجنب CORS وتتبع التحويلات
  if (import.meta.env.DEV) return '/api';
  return (import.meta.env.VITE_DRUPAL_URL || '').replace(/\/$/, '') || '';
};

/**
 * Submits a webform that includes file fields via Drupal's HTML form endpoint.
 * Uses fetch + redirect:manual because browser XHR/axios follows 303 and that
 * breaks against the absolute Drupal confirmation URL (often surfaces as 500).
 *
 * File inputs are posted as:
 *   files[{fieldKey}]      — single file
 *   files[{fieldKey}][]    — multiple files
 */
export const submitWebformWithFile = async (webformId, textData, fileData) => {
  const fileEntries = Object.entries(fileData)
    .map(([key, value]) => {
      const multiple = Array.isArray(value);
      const files = (multiple ? value : [value]).filter((f) => f instanceof File);
      return [key, files, multiple];
    })
    .filter(([, files]) => files.length > 0);

  if (fileEntries.length === 0) {
    return submitWebform(webformId, textData);
  }

  const origin = getWebformOrigin();
  const formUrl = `${origin}/webform/${encodeURIComponent(webformId)}`;

  try {
    const pageRes = await fetch(formUrl, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'text/html' },
    });

    if (!pageRes.ok) {
      throw new Error(`تعذر تحميل النموذج (${pageRes.status})`);
    }

    const html = await pageRes.text();
    const formBuildId = extractInputValue(html, 'form_build_id');
    const formId = extractInputValue(html, 'form_id');
    const formToken = extractInputValue(html, 'form_token');

    if (!formBuildId || !formId) {
      throw new Error('تعذر تحميل نموذج الإرسال من الخادم.');
    }

    const form = new FormData();
    form.append('form_build_id', formBuildId);
    form.append('form_id', formId);
    if (formToken) form.append('form_token', formToken);
    form.append('op', textData.op || 'إرسال');

    for (const [key, value] of Object.entries(textData)) {
      if (key === 'op' || value === null || value === undefined) continue;

      if (Array.isArray(value)) {
        value
          .filter((v) => v !== null && v !== undefined && v !== '')
          .forEach((v) => form.append(key, String(v)));
        continue;
      }

      if (typeof value === 'boolean') {
        if (value) form.append(key, '1');
        continue;
      }

      if (typeof value === 'object') {
        form.append(key, JSON.stringify(value));
        continue;
      }

      if (String(value).trim() !== '' || value === 0) {
        form.append(key, String(value));
      }
    }

    for (const [fieldName, files, multiple] of fileEntries) {
      if (multiple) {
        files.forEach((file) => form.append(`files[${fieldName}][]`, file, file.name));
      } else {
        form.append(`files[${fieldName}]`, files[0], files[0].name);
      }
    }

    const response = await fetch(formUrl, {
      method: 'POST',
      body: form,
      credentials: 'include',
      redirect: 'manual',
      headers: { Accept: 'text/html' },
    });

    const location = response.headers.get('location') || '';
    const status = response.status;
    // opaque redirect / 0 can happen with some browsers on manual redirect
    const redirected =
      status === 0 ||
      status === 301 ||
      status === 302 ||
      status === 303 ||
      status === 307 ||
      status === 308 ||
      /confirmation/i.test(location);

    if (redirected) {
      return {
        sid: location.match(/token=([^&]+)/)?.[1] || null,
        location: location || null,
        status,
      };
    }

    const body = await response.text();
    if (/confirmation|webform-confirmation|تم إرسال|شكراً|thank you/i.test(body)) {
      return { sid: null, location: null, status };
    }

    if (!response.ok) {
      throw new Error(`تعذر الإرسال (رمز ${status})`);
    }

    throw new Error('تعذر إرسال النموذج. تحقق من الحقول المطلوبة والملفات.');
  } catch (err) {
    throw new Error(err.message || 'تعذر إرسال النموذج مع الملفات.');
  }
};