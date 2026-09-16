import { api } from "./client";
import type { StudentRequest } from "./requests";

export type StaffRequestsResponse = {
  status: string;
  data: {
    requests: StudentRequest[];
  };
};

export type StaffRequestFilters = {
  status?: string;
  priority?: string;
};

export const getStaffRequests = async (filters?: StaffRequestFilters) => {
  const response = await api.get<StaffRequestsResponse>(
    "/requests/department",
    {
      params: filters,
    },
  );

  return response.data;
};

export const assignRequest = async (requestId: string, staffId: string) => {
  const response = await api.post<{
    status: string;
    message: string;
    data: StudentRequest;
  }>(`/requests/${requestId}/assign`, {
    staffId,
  });

  return response.data.data;
};
