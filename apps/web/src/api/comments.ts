import { api } from "./client";

export type CommentAuthor = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export type RequestComment = {
  _id: string;
  request: string;
  author: CommentAuthor | string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentsResponse = {
  data: RequestComment[];
};

export const getComments = async (requestId: string) => {
  const response = await api.get<CommentsResponse>(
    `/requests/${requestId}/comments`,
  );

  return response.data.data;
};

export const createComment = async (requestId: string, body: string) => {
  const response = await api.post<{ data: RequestComment }>(
    `/requests/${requestId}/comments`,
    { body },
  );

  return response.data.data;
};

export const updateComment = async (commentId: string, body: string) => {
  const response = await api.patch<{ data: RequestComment }>(
    `/comments/${commentId}`,
    { body },
  );

  return response.data.data;
};

export const deleteComment = async (commentId: string) => {
  await api.delete(`/comments/${commentId}`);
};
