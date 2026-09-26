import { AuditLogModel } from "../models/AuditLog.js";
import type { AuditAction } from "../models/AuditLog.js";

export type CreateAuditLogInput = {
  actorId: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

export const createAuditLog = async (input: CreateAuditLogInput) => {
  return AuditLogModel.create({
    actor: input.actorId,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    metadata: input.metadata ?? {},
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
  });
};
