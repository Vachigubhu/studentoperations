import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { authStorage } from "../utils/auth-storage";
import { emitLogoutEvent } from "../utils/auth-events";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post<{
      data: {
        accessToken: string;
        refreshToken: string;
      };
    }>(
      `${
        import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1"
      }/auth/refresh`,
      {
        refreshToken,
      },
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    authStorage.setTokens(accessToken, newRefreshToken);

    return accessToken;
  } catch {
    authStorage.clear();

    emitLogoutEvent();

    return null;
  }
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;

    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    return api(originalRequest);
  },
);
