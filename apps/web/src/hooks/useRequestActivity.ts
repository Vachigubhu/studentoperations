import { useQuery } from "@tanstack/react-query";

import { getRequestActivity } from "../api/request-activity";

export const requestActivityKeys = {
  all: ["request-activity"] as const,

  detail: (requestId: string) =>
    [...requestActivityKeys.all, requestId] as const,
};

export const useRequestActivity = (requestId: string) => {
  return useQuery({
    queryKey: requestActivityKeys.detail(requestId),
    queryFn: () => getRequestActivity(requestId),
    enabled: !!requestId,
  });
};
