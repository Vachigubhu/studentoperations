import { requestContext } from "./request-context.js";

type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

const writeLog = (
  level: LogLevel,
  message: string,
  context: LogContext = {},
): void => {
  const requestId = requestContext.getRequestId();

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service: "studentops-api",
    message,
    ...(requestId ? { requestId } : {}),
    ...context,
  };

  const output = JSON.stringify(entry);

  if (level === "error") {
    console.error(output);
    return;
  }

  console.log(output);
};

export const logger = {
  info(message: string, context?: LogContext): void {
    writeLog("info", message, context);
  },

  warn(message: string, context?: LogContext): void {
    writeLog("warn", message, context);
  },

  error(message: string, context?: LogContext): void {
    writeLog("error", message, context);
  },
};
