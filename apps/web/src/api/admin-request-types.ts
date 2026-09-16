import { api } from "./client";

export type AdminRequestType = {
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
  createdAt: string;
  updatedAt: string;
};

export type CreateRequestTypeInput = {
  name: string;
  code: string;
  description?: string;
  departmentId: string;
};

export type UpdateRequestTypeInput = Partial<CreateRequestTypeInput>;

export const getAdminRequestTypes = async () => {
  const response = await api.get<{
    status: string;
    data: {
      requestTypes: AdminRequestType[];
    };
  }>("/request-types");

  return response.data.data.requestTypes;
};

export const createAdminRequestType = async (input: CreateRequestTypeInput) => {
  const response = await api.post<{
    data: AdminRequestType;
  }>("/request-types", input);

  return response.data.data;
};

export const updateAdminRequestType = async (
  requestTypeId: string,
  input: UpdateRequestTypeInput,
) => {
  const response = await api.patch<{
    data: AdminRequestType;
  }>(`/request-types/${requestTypeId}`, input);

  return response.data.data;
};

export const updateAdminRequestTypeStatus = async (
  requestTypeId: string,
  isActive: boolean,
) => {
  const response = await api.patch<{
    data: AdminRequestType;
  }>(`/request-types/${requestTypeId}/status`, {
    isActive,
  });

  return response.data.data;
};
