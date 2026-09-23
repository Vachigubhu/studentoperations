import { useQuery } from "@tanstack/react-query";

import { getRequestDetails } from "../api/request-details";

export const requestDetailKeys = {
  all: ["request-details"] as const,

  detail: (requestId: string) => [...requestDetailKeys.all, requestId] as const,
};

export const useRequestDetails = (requestId: string) => {
  return useQuery({
    queryKey: requestDetailKeys.detail(requestId),
    queryFn: () => getRequestDetails(requestId),
    enabled: !!requestId,
  });
};
