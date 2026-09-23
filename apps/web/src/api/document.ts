import { api } from "./client";

export type Document = {
  _id: string;
  request: string;
  uploadedBy: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type DocumentsResponse = {
  data: Document[];
};

export const getDocuments = async (requestId: string) => {
  const response = await api.get<DocumentsResponse>(
    `/requests/${requestId}/documents`,
  );

  return response.data.data;
};

export const uploadDocument = async (
  requestId: string,
  file: File,
  category: string,
) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("category", category);

  const response = await api.post<{ data: Document }>(
    `/requests/${requestId}/documents`,
    formData,
  );

  return response.data.data;
};

export const deleteDocument = async (documentId: string) => {
  await api.delete(`/documents/${documentId}`);
};
