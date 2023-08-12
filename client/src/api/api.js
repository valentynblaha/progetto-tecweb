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

api.interceptors.response.use(undefined, async (error) => {
  const { config, response } = error;
  if (!config || !response) {
    return Promise.reject(error);
  }
  if (response.status === 401 && response.data.code === "token_not_valid") {
    const accessResponse = await axios.post(
      BASE_URL + "api/user/token/refresh/",
      {
        refresh: localStorage.getItem("refreshtoken"),
      },
      {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accesstoken"),
        },
      }
    );
    if (accessResponse.status !== 200) {
      return Promise.reject(error)
    }
    const { access } = accessResponse.data;
    localStorage.setItem("accesstoken", access);
    return axios({
      ...response.config,
      headers: {
        ...response.config.headers,
        Authorization: "Bearer " + access,
      },
    });
  }
  return Promise.reject(error);
});

export default api;
