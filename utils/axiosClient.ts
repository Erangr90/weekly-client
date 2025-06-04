import axios from "axios";
import { getToken } from "./secureStore";

const axiosClient = axios.create({
  baseURL: "http://172.27.208.1/api",
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosClient;
