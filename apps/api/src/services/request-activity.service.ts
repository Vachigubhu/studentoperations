import { ApprovalModel } from "../models/Approval.js";
import { AuditLogModel } from "../models/AuditLog.js";
import { CommentModel } from "../models/Comment.js";
import { DocumentModel } from "../models/Document.js";
import { RequestModel } from "../models/Request.js";
import { getAccessibleRequest } from "../utils/request-access.js";

type ActivityType =
  | "CREATED"
  | "SUBMITTED"
  | "STATUS_CHANGED"
  | "APPROVAL"
  | "COMMENT"
  | "DOCUMENT";

type RequestActivity = {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  createdAt: Date;
};

export const getRequestActivity = async (
  requestId: string,
  user: {
    userId: string;
    role: "STUDENT" | "STAFF" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";
    departmentId?: string;
  },
) => {
  const request = await getAccessibleRequest(requestId, user);

  const [auditLogs, approvals, comments, documents] = await Promise.all([
    AuditLogModel.find({
      resourceType: "Request",
      resourceId: request._id.toString(),
    })
      .sort({ createdAt: 1 })
      .lean(),

    ApprovalModel.find({
      request: request._id,
    })
      .populate("approver", "firstName lastName role")
      .sort({ createdAt: 1 })
      .lean(),

    CommentModel.find({
      request: request._id,
    })
      .populate("author", "firstName lastName role")
      .sort({ createdAt: 1 })
      .lean(),

    DocumentModel.find({
      request: request._id,
    })
      .populate("uploadedBy", "firstName lastName role")
      .sort({ createdAt: 1 })
      .lean(),
  ]);

  const activities: RequestActivity[] = [];

  for (const log of auditLogs) {
    switch (log.action) {
      case "REQUEST_CREATED":
        activities.push({
          id: log._id.toString(),
          type: "CREATED",
          title: "Request created",
          createdAt: log.createdAt,
        });
        break;

      case "REQUEST_SUBMITTED":
        activities.push({
          id: log._id.toString(),
          type: "SUBMITTED",
          title: "Request submitted",
          createdAt: log.createdAt,
        });
        break;

      case "REQUEST_STATUS_CHANGED":
        activities.push({
          id: log._id.toString(),
          type: "STATUS_CHANGED",
          title: "Request status changed",
          description: getStatusDescription(log.metadata),
          createdAt: log.createdAt,
        });
        break;

      case "REQUEST_ASSIGNED":
        activities.push({
          id: log._id.toString(),
          type: "STATUS_CHANGED",
          title: "Request assigned",
          description: "A staff member was assigned to this request.",
          createdAt: log.createdAt,
        });
        break;

      default:
        break;
    }
  }

  for (const approval of approvals) {
    activities.push({
      id: approval._id.toString(),
      type: "APPROVAL",
      title: `Approval: ${approval.decision.replaceAll("_", " ")}`,
      description: approval.comment || undefined,
      createdAt: approval.createdAt,
    });
  }

  for (const comment of comments) {
    activities.push({
      id: comment._id.toString(),
      type: "COMMENT",
      title: "Comment added",
      description: comment.body,
      createdAt: comment.createdAt,
    });
  }

  for (const document of documents) {
    activities.push({
      id: document._id.toString(),
      type: "DOCUMENT",
      title: "Document uploaded",
      description: document.originalName,
      createdAt: document.createdAt,
    });
  }

  activities.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return activities;
};

const getStatusDescription = (
  metadata: Record<string, unknown> | undefined,
) => {
  if (!metadata) {
    return undefined;
  }

  const from = metadata.from;
  const to = metadata.to;

  if (typeof from === "string" && typeof to === "string") {
    return `${from.replaceAll("_", " ")} → ${to.replaceAll("_", " ")}`;
  }

  return undefined;
};
