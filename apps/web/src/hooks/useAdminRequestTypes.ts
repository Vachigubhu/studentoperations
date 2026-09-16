import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAdminRequestType,
  getAdminRequestTypes,
  updateAdminRequestType,
  updateAdminRequestTypeStatus,
  type CreateRequestTypeInput,
  type UpdateRequestTypeInput,
} from "../api/admin-request-types";

export const adminRequestTypeKeys = {
  all: ["admin-request-types"] as const,
  list: () => [...adminRequestTypeKeys.all, "list"] as const,
};

export const useAdminRequestTypes = () => {
  return useQuery({
    queryKey: adminRequestTypeKeys.list(),
    queryFn: getAdminRequestTypes,
  });
};

export const useCreateAdminRequestType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRequestTypeInput) =>
      createAdminRequestType(input),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminRequestTypeKeys.all,
      });
    },
  });
};

export const useUpdateAdminRequestType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestTypeId,
      input,
    }: {
      requestTypeId: string;
      input: UpdateRequestTypeInput;
    }) => updateAdminRequestType(requestTypeId, input),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminRequestTypeKeys.all,
      });
    },
  });
};

export const useUpdateAdminRequestTypeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestTypeId,
      isActive,
    }: {
      requestTypeId: string;
      isActive: boolean;
    }) => updateAdminRequestTypeStatus(requestTypeId, isActive),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminRequestTypeKeys.all,
      });
    },
  });
};
