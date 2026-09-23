import { api } from "./client";

export type ActivityType =
  | "CREATED"
  | "SUBMITTED"
  | "STATUS_CHANGED"
  | "APPROVAL"
  | "COMMENT"
  | "DOCUMENT";

export type RequestActivity = {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  createdAt: string;
};

export const getRequestActivity = async (requestId: string) => {
  const response = await api.get<{
    status: string;
    data: {
      activities: RequestActivity[];
    };
  }>(`/requests/${requestId}/activity`);

  return response.data.data.activities;
};
