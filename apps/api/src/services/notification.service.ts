import { NotificationModel } from "../models/Notification.js";
import { AppError } from "../utils/AppError.js";

type CreateNotificationInput = {
  recipientId: string;
  type:
    | "REQUEST_SUBMITTED"
    | "REQUEST_ASSIGNED"
    | "REQUEST_STATUS_CHANGED"
    | "APPROVAL_DECISION"
    | "COMMENT_ADDED"
    | "DOCUMENT_UPLOADED";
  title: string;
  message: string;
  requestId?: string;
};

export const createNotification = async (input: CreateNotificationInput) => {
  return NotificationModel.create({
    recipient: input.recipientId,
    type: input.type,
    title: input.title,
    message: input.message,
    request: input.requestId ?? null,
  });
};

export const getUserNotifications = async (userId: string) => {
  return NotificationModel.find({
    recipient: userId,
  })
    .sort({ createdAt: -1 })
    .limit(50);
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string,
) => {
  const notification = await NotificationModel.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new AppError(404, "Notification not found");
  }

  notification.isRead = true;
  notification.readAt = new Date();

  await notification.save();

  return notification;
};
