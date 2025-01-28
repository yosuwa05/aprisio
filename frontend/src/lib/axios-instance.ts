import axios from "axios";
import { BASE_URL } from "./config";

const axiosInstance = axios.create({
  // baseURL: "https://aprisio.com/api/user",
  baseURL: BASE_URL,

  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("bear-token");
    }
    return Promise.reject(error);
  }
);

export { axiosInstance as _axios };
