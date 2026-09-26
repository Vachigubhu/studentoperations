import { emitEvent, eventBus } from "./event-bus.js";
import { EVENTS } from "./events.js";
import type { AuditAction } from "../models/AuditLog.js";

type AuditEventOptions = {
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

export const emitAuditEvent = (
  actorId: string,
  action: AuditAction,
  resourceType: string,
  resourceId: string,
  options?: AuditEventOptions,
) => {
  emitEvent(EVENTS.AUDIT_LOG, {
    actorId,
    action,
    resourceType,
    resourceId,
    metadata: options?.metadata,
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
  });
};
