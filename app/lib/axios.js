import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACKEND_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
  timeout: 10000, // 10 seconds
});

// Add response interceptor to handle CORS errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.log("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export default api;
