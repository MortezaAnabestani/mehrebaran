import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - افزودن token به همه درخواست‌ها
api.interceptors.request.use(
  (config) => {
    // دریافت token از localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - مدیریت خطاهای 401 (Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // اگر 401 دریافت شد، token معتبر نیست
    if (error.response?.status === 401) {
      // پاک کردن token و user از localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        // Redirect به صفحه login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
