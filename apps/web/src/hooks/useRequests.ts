import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createRequest,
  getRequest,
  getRequestTypes,
  getRequests,
  submitRequest,
  type CreateRequestInput,
} from "../api/requests";

export const requestKeys = {
  all: ["requests"] as const,

  list: () => [...requestKeys.all, "list"] as const,

  detail: (id: string) => [...requestKeys.all, "detail", id] as const,

  types: ["request-types"] as const,
};

export const useRequests = () => {
  return useQuery({
    queryKey: requestKeys.list(),
    queryFn: getRequests,
  });
};

export const useRequest = (requestId: string) => {
  return useQuery({
    queryKey: requestKeys.detail(requestId),
    queryFn: () => getRequest(requestId),
    enabled: Boolean(requestId),
  });
};

export const useRequestTypes = () => {
  return useQuery({
    queryKey: requestKeys.types,
    queryFn: getRequestTypes,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRequestInput) => createRequest(input),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: requestKeys.list(),
      });
    },
  });
};

export const useSubmitRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => submitRequest(requestId),

    onSuccess: (request) => {
      void queryClient.invalidateQueries({
        queryKey: requestKeys.list(),
      });

      void queryClient.invalidateQueries({
        queryKey: requestKeys.detail(request._id),
      });
    },
  });
};
