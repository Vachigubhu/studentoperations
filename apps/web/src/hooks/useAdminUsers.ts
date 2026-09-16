import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  type AdminUserFilters,
} from "../api/admin-users";

export const adminUserKeys = {
  all: ["admin-users"] as const,

  list: (filters: AdminUserFilters = {}) =>
    [...adminUserKeys.all, "list", filters] as const,
};

export const useAdminUsers = (filters: AdminUserFilters = {}) => {
  return useQuery({
    queryKey: adminUserKeys.list(filters),
    queryFn: () => getAdminUsers(filters),
  });
};

export const useUpdateAdminUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: Parameters<typeof updateAdminUserRole>[1];
    }) => updateAdminUserRole(userId, role),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminUserKeys.all,
      });
    },
  });
};

export const useUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      updateAdminUserStatus(userId, isActive),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminUserKeys.all,
      });
    },
  });
};
