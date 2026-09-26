import { eventBus } from "./event-bus.js";
import { EVENTS } from "./events.js";
import {
  createAuditLog,
  type CreateAuditLogInput,
} from "../services/audit.service.js";
import { logger } from "../utils/logger.js";

eventBus.on(EVENTS.AUDIT_LOG, async (payload: CreateAuditLogInput) => {
  try {
    await createAuditLog(payload);

    logger.info("Audit event processed", {
      action: payload.action,
      resourceType: payload.resourceType,
      resourceId: payload.resourceId,
    });
  } catch (error) {
    logger.error("Failed to create audit log", {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : String(error),
    });
  }
});
