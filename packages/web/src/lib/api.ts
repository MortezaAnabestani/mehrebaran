import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// در آینده می‌توانیم Interceptor ها را برای مدیریت توکن JWT در اینجا اضافه کنیم
// api.interceptors.request.use(...)

export default api;
