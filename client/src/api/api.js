import axios from "axios";

const ADDRESS = "localhost";
const PORT = "8000";
const BASE_URL = `http://${ADDRESS}:${PORT}/`;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accesstoken");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export default api;
