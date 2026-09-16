import { api } from "./client";
import type { UserRole } from "../types/auth";

export type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department:
    | string
    | {
        _id: string;
        name: string;
        code: string;
      }
    | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserFilters = {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

export type AdminUsersResponse = {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getAdminUsers = async (filters: AdminUserFilters = {}) => {
  const response = await api.get<AdminUsersResponse>("/users", {
    params: filters,
  });

  return response.data;
};

export const updateAdminUserRole = async (userId: string, role: UserRole) => {
  const response = await api.patch<{ data: AdminUser }>(
    `/users/${userId}/role`,
    { role },
  );

  return response.data.data;
};

export const updateAdminUserStatus = async (
  userId: string,
  isActive: boolean,
) => {
  const response = await api.patch<{ data: AdminUser }>(
    `/users/${userId}/status`,
    { isActive },
  );

  return response.data.data;
};
