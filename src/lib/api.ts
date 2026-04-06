import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  if (token) {
    config.headers = (config.headers ?? {}) as any;
    (config.headers as any).Authorization = `Bearer ${token}`;
    if (import.meta.env.DEV) {
      console.log("TOKEN:", `${token.slice(0, 12)}…`);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("API:", response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error?.config;
    if (error?.response?.status === 401 && !originalRequest?._retry) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingQueue.push((token) => {
              if (!token) {
                reject(error);
                return;
              }
              originalRequest.headers = originalRequest.headers ?? {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }

        isRefreshing = true;
        originalRequest._retry = true;
        try {
          const refreshResponse = await refreshClient.post("/auth/refresh", { refresh_token: refreshToken });
          const payload = refreshResponse.data?.data || refreshResponse.data;
          const nextToken = payload?.token || payload?.access_token;
          const nextRefreshToken = payload?.refresh_token || refreshToken;
          localStorage.setItem("token", nextToken);
          localStorage.setItem("refresh_token", nextRefreshToken);
          pendingQueue.forEach((callback) => callback(nextToken));
          pendingQueue = [];
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${nextToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          pendingQueue.forEach((callback) => callback(null));
          pendingQueue = [];
        } finally {
          isRefreshing = false;
        }
      }

      const currentPath = window.location.pathname;
      const isAuthRoute =
        currentPath === "/login" ||
        currentPath === "/forgot-password" ||
        currentPath.startsWith("/reset-password") ||
        currentPath === "/oauth-success";
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      if (!isAuthRoute) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export { API_BASE_URL };
export default api;
