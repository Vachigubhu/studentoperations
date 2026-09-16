import { api } from "./client";

export type RequestStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "CORRECTION_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

export type RequestPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type RequestType = {
  _id: string;
  name: string;
  code: string;
  description?: string;
  department:
    | string
    | {
        _id: string;
        name: string;
        code: string;
      };
  isActive: boolean;
};

export type RequestStudent =
  | string
  | {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };

export type RequestAssignedTo =
  | string
  | {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    }
  | null;

export type StudentRequest = {
  _id: string;

  student: RequestStudent;

  requestType:
    | string
    | {
        _id: string;
        name: string;
        code: string;
      };

  department:
    | string
    | {
        _id: string;
        name: string;
        code: string;
      };

  title: string;
  description: string;

  status: RequestStatus;
  priority: RequestPriority;

  assignedTo: RequestAssignedTo;

  submittedAt?: string | null;
  completedAt?: string | null;

  createdAt: string;
  updatedAt: string;
};

export type GetRequestResponse = {
  status: string;
  data: {
    request: StudentRequest;
  };
};

export type CreateRequestResponse = {
  status: string;
  data: {
    request: StudentRequest;
  };
};

export type RequestsResponse = {
  status: string;
  data: {
    requests: StudentRequest[];
  };
};

export type RequestTypesResponse = {
  status: string;
  data: {
    requestTypes: RequestType[];
  };
};

export type CreateRequestInput = {
  requestTypeId: string;
  title: string;
  description: string;
  priority?: RequestPriority;
};

export type SubmitRequestResponse = {
  status: string;
  data: {
    request: StudentRequest;
  };
};

export const getRequests = async () => {
  const response = await api.get<RequestsResponse>("/requests");

  return response.data;
};

export const getRequest = async (requestId: string) => {
  const response = await api.get<GetRequestResponse>(`/requests/${requestId}`);

  return response.data.data.request;
};

export const getRequestTypes = async () => {
  const response = await api.get<RequestTypesResponse>("/request-types");

  return response.data;
};

export const createRequest = async (input: CreateRequestInput) => {
  const response = await api.post<CreateRequestResponse>("/requests", input);

  return response.data;
};

export const submitRequest = async (requestId: string) => {
  const response = await api.post<SubmitRequestResponse>(
    `/requests/${requestId}/submit`,
  );

  return response.data.data.request;
};
