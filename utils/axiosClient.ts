import axios from "axios";
import { getToken } from "./secureStore";

const axiosClient = axios.create({
  baseURL: "https://www.test-5587.online/api",
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
