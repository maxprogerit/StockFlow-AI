import axios from "axios";
import { useAuthStore } from "@/store/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && useAuthStore.getState().refreshToken) {
      try {
        const refresh = useAuthStore.getState().refreshToken;
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken: refresh });
        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
        err.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api.request(err.config);
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(err);
  }
);

export default api;

