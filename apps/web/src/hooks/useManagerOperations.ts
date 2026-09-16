import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  assignManagerRequest,
  createManagerApproval,
  getManagerApprovals,
  getManagerRequest,
  getManagerRequests,
  updateManagerRequestStatus,
  type ManagerApprovalDecision,
  type ManagerRequestFilters,
} from "../api/manager-operations";

export const managerOperationKeys = {
  all: ["manager-operations"] as const,

  requests: (filters: ManagerRequestFilters = {}) =>
    [...managerOperationKeys.all, "requests", filters] as const,

  detail: (id: string) => [...managerOperationKeys.all, "detail", id] as const,

  approvals: (id: string) =>
    [...managerOperationKeys.all, "approvals", id] as const,
};

export const useManagerRequests = (filters: ManagerRequestFilters = {}) => {
  return useQuery({
    queryKey: managerOperationKeys.requests(filters),
    queryFn: () => getManagerRequests(filters),
  });
};

export const useManagerRequest = (requestId: string) => {
  return useQuery({
    queryKey: managerOperationKeys.detail(requestId),
    queryFn: () => getManagerRequest(requestId),
    enabled: Boolean(requestId),
  });
};

export const useAssignManagerRequest = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignedTo: string) =>
      assignManagerRequest(requestId, assignedTo),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: managerOperationKeys.detail(requestId),
      });

      void queryClient.invalidateQueries({
        queryKey: managerOperationKeys.all,
      });
    },
  });
};

export const useUpdateManagerRequestStatus = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: Parameters<typeof updateManagerRequestStatus>[1]) =>
      updateManagerRequestStatus(requestId, status),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: managerOperationKeys.detail(requestId),
      });

      void queryClient.invalidateQueries({
        queryKey: managerOperationKeys.all,
      });
    },
  });
};

export const useManagerApprovals = (requestId: string) => {
  return useQuery({
    queryKey: managerOperationKeys.approvals(requestId),

    queryFn: () => getManagerApprovals(requestId),

    enabled: Boolean(requestId),
  });
};

export const useCreateManagerApproval = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      decision,
      comment,
    }: {
      decision: ManagerApprovalDecision;
      comment?: string;
    }) => createManagerApproval(requestId, decision, comment),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: managerOperationKeys.detail(requestId),
      });

      void queryClient.invalidateQueries({
        queryKey: managerOperationKeys.approvals(requestId),
      });

      void queryClient.invalidateQueries({
        queryKey: managerOperationKeys.all,
      });
    },
  });
};
