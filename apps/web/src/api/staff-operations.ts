import { api } from "./client";
import type { RequestStatus, StudentRequest } from "./requests";

export type ApprovalDecision = "APPROVED" | "REJECTED" | "CORRECTION_REQUIRED";

export type Approval = {
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
  decision: ApprovalDecision;
  comment?: string;
  createdAt: string;
  updatedAt: string;
};

export const getStaffRequest = async (requestId: string) => {
  const response = await api.get<{ data: StudentRequest }>(
    `/requests/department/${requestId}`,
  );

  return response.data.data;
};

export const assignStaffRequest = async (
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

export const updateRequestStatus = async (
  requestId: string,
  status: RequestStatus,
) => {
  const response = await api.patch<{ data: StudentRequest }>(
    `/requests/${requestId}/status`,
    { status },
  );

  return response.data.data;
};

export const createApproval = async (
  requestId: string,
  decision: ApprovalDecision,
  comment?: string,
) => {
  const response = await api.post<{ data: Approval }>(
    `/requests/${requestId}/approvals`,
    { decision, comment },
  );

  return response.data.data;
};

export const getApprovals = async (requestId: string) => {
  const response = await api.get<{ data: Approval[] }>(
    `/requests/${requestId}/approvals`,
  );

  return response.data.data;
};
