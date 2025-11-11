import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_PUBLIC_API_URL
});

// Request interceptor - افزودن Bearer token به همه درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - مدیریت خطای 401 و logout خودکار
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // حذف token و هدایت به صفحه ورود
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
