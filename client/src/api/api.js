import axios from "axios";

const ADDRESS = "localhost";
const PORT = "8000";
const BASE_URL = `http://${ADDRESS}:${PORT}/`;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer " + "khsgfsbuycfuweyrcseugsyberucgsyni";
  return config;
});

export default api;
