import axios from "axios";
import Cookies from "js-cookie";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_SERVER ,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
  timeout: 10000, // 10 seconds
});

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors

export default api;
