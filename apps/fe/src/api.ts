import axios from "axios";
import { VITE_HTTP_URL } from "./Config";

const API = axios.create({
  baseURL: VITE_HTTP_URL, // Change this to your backend URL
});

// Automatically attach JWT token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Ensure `config.headers` exists before modifying it
    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
