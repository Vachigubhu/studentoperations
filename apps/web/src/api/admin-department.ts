import { api } from "./client";

export type AdminDepartment = {
  _id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateDepartmentInput = {
  name: string;
  code: string;
  description?: string;
};

export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;

export const getAdminDepartments = async () => {
  const response = await api.get<{
    data: AdminDepartment[];
  }>("/departments");

  return response.data.data;
};

export const createAdminDepartment = async (input: CreateDepartmentInput) => {
  const response = await api.post<{
    data: AdminDepartment;
  }>("/departments", input);

  return response.data.data;
};

export const updateAdminDepartment = async (
  departmentId: string,
  input: UpdateDepartmentInput,
) => {
  const response = await api.patch<{
    data: AdminDepartment;
  }>(`/departments/${departmentId}`, input);

  return response.data.data;
};

export const updateAdminDepartmentStatus = async (
  departmentId: string,
  isActive: boolean,
) => {
  const response = await api.patch<{
    data: AdminDepartment;
  }>(`/departments/${departmentId}/status`, {
    isActive,
  });

  return response.data.data;
};
