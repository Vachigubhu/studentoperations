import { api } from "./client";
import type { AuthResponse } from "../types/auth";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const login = async (input: LoginInput) => {
  const response = await api.post<AuthResponse>("/auth/login", input);

  return response.data;
};

export const register = async (input: RegisterInput) => {
  const response = await api.post<AuthResponse>("/auth/register", input);

  return response.data;
};

type CurrentUserResponse = {
  status: string;
  data: {
    user: AuthResponse["data"]["user"];
  };
};

export const getCurrentUser = async () => {
  const response = await api.get<CurrentUserResponse>("/users/me");

  return response.data.data.user;
};

export type RefreshResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export const refreshTokens = async (refreshToken: string) => {
  const response = await api.post<RefreshResponse>("/auth/refresh", {
    refreshToken,
  });

  return response.data;
};
