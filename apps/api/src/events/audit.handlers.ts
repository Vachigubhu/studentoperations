import { eventBus } from "./event-bus.js";
import { EVENTS } from "./events.js";
import { createAuditLog } from "../services/audit.service.js";

eventBus.on(EVENTS.AUDIT_LOG, async (payload) => {
  try {
    await createAuditLog(payload);
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
});
