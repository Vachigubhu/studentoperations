import { Schema, model } from "mongoose";

export const AUDIT_ACTIONS = [
  "USER_REGISTERED",
  "USER_LOGIN",
  "REQUEST_CREATED",
  "REQUEST_SUBMITTED",
  "REQUEST_ASSIGNED",
  "REQUEST_STATUS_CHANGED",
  "APPROVAL_CREATED",
  "COMMENT_CREATED",
  "COMMENT_UPDATED",
  "COMMENT_DELETED",
  "DOCUMENT_UPLOADED",
  "DOCUMENT_DELETED",
  "NOTIFICATION_READ",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

const auditLogSchema = new Schema(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: AUDIT_ACTIONS,
      required: true,
      index: true,
    },

    resourceType: {
      type: String,
      required: true,
      trim: true,
    },

    resourceId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

auditLogSchema.index({
  actor: 1,
  createdAt: -1,
});

auditLogSchema.index({
  resourceType: 1,
  resourceId: 1,
  createdAt: -1,
});

export type AuditLog = {
  _id: Schema.Types.ObjectId;
  actor: Schema.Types.ObjectId;
  action: AuditAction;
  resourceType: string;
  resourceId: Schema.Types.ObjectId;
  metadata: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const AuditLogModel = model("AuditLog", auditLogSchema);
