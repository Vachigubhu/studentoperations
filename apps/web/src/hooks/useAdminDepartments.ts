import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAdminDepartment,
  getAdminDepartments,
  updateAdminDepartment,
  updateAdminDepartmentStatus,
  type CreateDepartmentInput,
  type UpdateDepartmentInput,
} from "../api/admin-department";

export const adminDepartmentKeys = {
  all: ["admin-departments"] as const,
  list: () => [...adminDepartmentKeys.all, "list"] as const,
};

export const useAdminDepartments = () => {
  return useQuery({
    queryKey: adminDepartmentKeys.list(),
    queryFn: getAdminDepartments,
  });
};

export const useCreateAdminDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDepartmentInput) => createAdminDepartment(input),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminDepartmentKeys.all,
      });
    },
  });
};

export const useUpdateAdminDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
      input,
    }: {
      departmentId: string;
      input: UpdateDepartmentInput;
    }) => updateAdminDepartment(departmentId, input),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminDepartmentKeys.all,
      });
    },
  });
};

export const useUpdateAdminDepartmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
      isActive,
    }: {
      departmentId: string;
      isActive: boolean;
    }) => updateAdminDepartmentStatus(departmentId, isActive),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminDepartmentKeys.all,
      });
    },
  });
};
