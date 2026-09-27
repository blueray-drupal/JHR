// src/services/api/axios.config.js
import axios from 'axios';

const DRUPAL_BASE_URL = (import.meta.env.VITE_DRUPAL_URL || 'http://localhost:8000').replace(/\/$/, '');
// في التطوير نستخدم البروكسي لتجنب CORS؛ في الإنتاج نستخدم عنوان Drupal مباشرة
const baseURL = import.meta.env.DEV ? '/api' : DRUPAL_BASE_URL;

// Create axios instance with default config
const drupalApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

// Request interceptor
drupalApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('drupal_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
drupalApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 500) {
      console.error('API 500 Error – تفاصيل من Drupal:', error.response?.data);
    } else {
      console.error('API Error:', error.response || error.message);
    }

    const requestUrl = String(error.config?.url || '');
    const isWebformRequest =
      requestUrl.includes('webform_rest') ||
      requestUrl.includes('webform-file-upload') ||
      requestUrl.includes('/session/token');

    // لا تحوّل لصفحة login أثناء إرسال/تحميل النماذج للزائر
    if (error.response?.status === 401 && !isWebformRequest) {
      localStorage.removeItem('drupal_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { drupalApi, DRUPAL_BASE_URL };
