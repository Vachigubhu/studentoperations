import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  assignStaffRequest,
  createApproval,
  getApprovals,
  getStaffRequest,
  updateRequestStatus,
  type ApprovalDecision,
} from "../api/staff-operations";

import { requestKeys } from "./useRequests";

export const staffOperationKeys = {
  all: ["staff-operations"] as const,

  detail: (id: string) => [...staffOperationKeys.all, "detail", id] as const,

  approvals: (id: string) =>
    [...staffOperationKeys.all, "approvals", id] as const,
};

export const useStaffRequest = (requestId: string) =>
  useQuery({
    queryKey: staffOperationKeys.detail(requestId),
    queryFn: () => getStaffRequest(requestId),
    enabled: Boolean(requestId),
  });

export const useAssignStaffRequest = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignedTo: string) =>
      assignStaffRequest(requestId, assignedTo),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: staffOperationKeys.detail(requestId),
      });

      void queryClient.invalidateQueries({
        queryKey: requestKeys.list(),
      });

      void queryClient.invalidateQueries({
        queryKey: ["staff-requests"],
      });
    },
  });
};

export const useUpdateRequestStatus = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: Parameters<typeof updateRequestStatus>[1]) =>
      updateRequestStatus(requestId, status),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: staffOperationKeys.detail(requestId),
      });

      void queryClient.invalidateQueries({
        queryKey: requestKeys.list(),
      });

      void queryClient.invalidateQueries({
        queryKey: ["staff-requests"],
      });
    },
  });
};

export const useApprovals = (requestId: string) =>
  useQuery({
    queryKey: staffOperationKeys.approvals(requestId),
    queryFn: () => getApprovals(requestId),
    enabled: Boolean(requestId),
  });

export const useCreateApproval = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      decision,
      comment,
    }: {
      decision: ApprovalDecision;
      comment?: string;
    }) => createApproval(requestId, decision, comment),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: staffOperationKeys.detail(requestId),
      });

      void queryClient.invalidateQueries({
        queryKey: staffOperationKeys.approvals(requestId),
      });

      void queryClient.invalidateQueries({
        queryKey: requestKeys.list(),
      });

      void queryClient.invalidateQueries({
        queryKey: ["staff-requests"],
      });
    },
  });
};
