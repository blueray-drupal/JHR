// src/services/api/axios.config.js
import axios from 'axios';

const DRUPAL_BASE_URL = (import.meta.env.VITE_DRUPAL_URL || 'http://backend.jhr.com.dedi8785.your-server.de').replace(/\/$/, '');

// دائماً نفس المنشأ عبر /api (بروكسي Vite محلياً، و.htaccess بالإنتاج)
const baseURL = '/api';

const drupalApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

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
      requestUrl.includes('/webform/') ||
      requestUrl.includes('/session/token');

    if (error.response?.status === 401 && !isWebformRequest) {
      localStorage.removeItem('drupal_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { drupalApi, DRUPAL_BASE_URL };
