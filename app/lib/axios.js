import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACKEND_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

export default api;
