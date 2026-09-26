import { EventEmitter } from "node:events";
import { requestContext } from "../utils/request-context.js";

export const eventBus = new EventEmitter();

export const emitEvent = (
  event: string,
  payload: Record<string, unknown>,
): void => {
  const requestId = requestContext.getRequestId();

  eventBus.emit(event, {
    ...payload,
    ...(requestId ? { requestId } : {}),
  });
};
