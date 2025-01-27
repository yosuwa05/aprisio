import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/user",
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
