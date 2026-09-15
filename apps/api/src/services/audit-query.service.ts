import { AuditLogModel } from "../models/AuditLog.js";

type AuditQuery = {
  actor?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  page?: number;
  limit?: number;
};

export const getAuditLogs = async ({
  actor,
  action,
  resourceType,
  resourceId,
  page = 1,
  limit = 50,
}: AuditQuery) => {
  const filter: Record<string, unknown> = {};

  if (actor) {
    filter.actor = actor;
  }

  if (action) {
    filter.action = action;
  }

  if (resourceType) {
    filter.resourceType = resourceType;
  }

  if (resourceId) {
    filter.resourceId = resourceId;
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLogModel.find(filter)
      .populate("actor", "firstName lastName email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    AuditLogModel.countDocuments(filter),
  ]);

  return {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
