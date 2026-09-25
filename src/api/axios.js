import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    
    const originalRequest = error.config;
    
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await api.post("/auth/refresh-token");
        if (refreshRes.data.accessToken) {
          localStorage.setItem("accessToken", refreshRes.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
        }
        return api(originalRequest);
      } catch (err) {
        // /auth/me এর ক্ষেত্রে টোস্ট দেখাবে না, কারণ এটি রিলোডের সময় চেক হয়
        if (originalRequest.url !== "/auth/me") {
          toast.error("Session Expired, Please Login Again");
          if (window.location.pathname !== "/login") {
             window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;