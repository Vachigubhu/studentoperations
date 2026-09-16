import { api } from "./client";

export type NotificationType =
  | "REQUEST_SUBMITTED"
  | "REQUEST_ASSIGNED"
  | "REQUEST_STATUS_CHANGED"
  | "APPROVAL_DECISION"
  | "COMMENT_ADDED"
  | "DOCUMENT_UPLOADED"
  | "MESSAGE_RECEIVED";

export type Notification = {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  request?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificationsResponse = {
  data: Notification[];
};

export const getNotifications = async () => {
  const response = await api.get<NotificationsResponse>("/notifications");

  return response.data.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await api.patch<{
    data: Notification;
  }>(`/notifications/${notificationId}/read`);

  return response.data.data;
};
