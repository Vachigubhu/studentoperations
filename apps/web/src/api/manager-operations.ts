import { api } from "./client";
import type {
  RequestPriority,
  RequestStatus,
  StudentRequest,
} from "./requests";

export type ManagerRequestFilters = {
  status?: RequestStatus;
  priority?: RequestPriority;
};

export type ManagerRequestsResponse = {
  status: string;
  data: {
    requests: StudentRequest[];
  };
};

export type ManagerApprovalDecision =
  | "APPROVED"
  | "REJECTED"
  | "CORRECTION_REQUIRED";

export type ManagerApproval = {
  _id: string;
  request: string;
  approver:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      };
  decision: ManagerApprovalDecision;
  comment?: string;
  createdAt: string;
  updatedAt: string;
};

export const getManagerRequests = async (
  filters: ManagerRequestFilters = {},
) => {
  const response = await api.get<ManagerRequestsResponse>(
    "/requests/department",
    {
      params: filters,
    },
  );

  return response.data;
};

export const getManagerRequest = async (requestId: string) => {
  const response = await api.get<{
    status: string;
    data: StudentRequest;
  }>(`/requests/department/${requestId}`);

  return response.data.data;
};

export const assignManagerRequest = async (
  requestId: string,
  staffId: string,
) => {
  const response = await api.post<{
    status: string;
    message: string;
    data: StudentRequest;
  }>(`/requests/${requestId}/assign`, {
    staffId,
  });

  return response.data.data;
};

export const updateManagerRequestStatus = async (
  requestId: string,
  status: RequestStatus,
) => {
  const response = await api.patch<{
    status: string;
    message: string;
    data: StudentRequest;
  }>(`/requests/${requestId}/status`, {
    status,
  });

  return response.data.data;
};

export const createManagerApproval = async (
  requestId: string,
  decision: ManagerApprovalDecision,
  comment?: string,
) => {
  const response = await api.post<{
    status: string;
    data: ManagerApproval;
  }>(`/requests/${requestId}/approvals`, {
    decision,
    comment,
  });

  return response.data.data;
};

export const getManagerApprovals = async (requestId: string) => {
  const response = await api.get<{
    status: string;
    data: ManagerApproval[];
  }>(`/requests/${requestId}/approvals`);

  return response.data.data;
};
