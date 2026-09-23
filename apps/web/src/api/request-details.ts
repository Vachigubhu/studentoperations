import { api } from "./client";
import type { StudentRequest } from "./requests";

export type RequestActivity = {
  id: string;
  type:
    | "CREATED"
    | "SUBMITTED"
    | "STATUS_CHANGED"
    | "APPROVAL"
    | "COMMENT"
    | "DOCUMENT";
  title: string;
  description?: string;
  createdAt: string;
};

export type RequestDetails = StudentRequest & {
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null;
};

export const getRequestDetails = async (requestId: string) => {
  const response = await api.get<{ data: RequestDetails }>(
    `/requests/${requestId}`,
  );

  return response.data.data;
};
