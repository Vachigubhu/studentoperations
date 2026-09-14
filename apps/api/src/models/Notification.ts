import { Schema, model } from "mongoose";

export const NOTIFICATION_TYPES = [
  "REQUEST_SUBMITTED",
  "REQUEST_ASSIGNED",
  "REQUEST_STATUS_CHANGED",
  "APPROVAL_DECISION",
  "COMMENT_ADDED",
  "DOCUMENT_UPLOADED",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    request: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      default: null,
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

export type Notification = {
  _id: Schema.Types.ObjectId;
  recipient: Schema.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  request?: Schema.Types.ObjectId | null;
  isRead: boolean;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export const NotificationModel = model("Notification", notificationSchema);
