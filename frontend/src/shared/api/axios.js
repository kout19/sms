import axios from "axios";
import { store } from "../../store/store";
import { loginSuccess, logout } from "../../store/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

export const setAxiosAuthToken = (accessToken) => {
  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

api.interceptors.request.use((config) => {
  const accessToken = store.getState()?.auth?.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = api.post("/auth/refresh-token");
      }

      const response = await refreshPromise;
      const payload = response?.data ?? response;
      const accessToken = payload?.accessToken;

      if (!accessToken) {
        throw new Error("Access token missing from refresh response.");
      }

      const nextUser = payload?.user ?? store.getState()?.auth?.user;
      setAxiosAuthToken(accessToken);
      store.dispatch(
        loginSuccess({
          accessToken,
          user: nextUser,
        }),
      );

      originalRequest._retry = true;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      store.dispatch(logout());
      setAxiosAuthToken(null);

      if (typeof window !== "undefined") {
        window.location.assign("/login");
      }

      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

export default api;
