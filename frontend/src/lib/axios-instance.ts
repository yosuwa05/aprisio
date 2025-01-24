import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/user",
  withCredentials: true,
});

export { axiosInstance as _axios };
