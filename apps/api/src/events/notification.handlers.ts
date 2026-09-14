import { eventBus } from "./event-bus.js";
import { EVENTS } from "./events.js";
import { createNotification } from "../services/notification.service.js";

eventBus.on(
  EVENTS.APPROVAL_DECISION,
  async (payload: {
    requestId: string;
    studentId: string;
    decision: string;
  }) => {
    const decisionMessages: Record<string, string> = {
      APPROVED: "Your request has been approved.",

      REJECTED: "Your request has been rejected.",

      CORRECTION_REQUIRED: "Your request requires correction.",
    };

    await createNotification({
      recipientId: payload.studentId,
      type: "APPROVAL_DECISION",
      title: "Request decision updated",
      message:
        decisionMessages[payload.decision] ??
        "Your request status has been updated.",
      requestId: payload.requestId,
    });
  },
);
