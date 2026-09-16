import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  assignRequest,
  getStaffRequests,
  type StaffRequestFilters,
} from "../api/staff-requests";

import { requestKeys } from "./useRequests";

export const staffRequestKeys = {
  all: ["staff-requests"] as const,

  list: (filters: StaffRequestFilters) =>
    [...staffRequestKeys.all, filters] as const,
};

export const useStaffRequests = (filters: StaffRequestFilters = {}) => {
  return useQuery({
    queryKey: staffRequestKeys.list(filters),
    queryFn: () => getStaffRequests(filters),
  });
};

export const useAssignRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      assignedTo,
    }: {
      requestId: string;
      assignedTo: string;
    }) => assignRequest(requestId, assignedTo),

    onSuccess: (request) => {
      void queryClient.invalidateQueries({
        queryKey: staffRequestKeys.all,
      });

      void queryClient.invalidateQueries({
        queryKey: requestKeys.detail(request._id),
      });
    },
  });
};
