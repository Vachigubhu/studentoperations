import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { logger } from "../utils/logger.js";
import { requestContext } from "../utils/request-context.js";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export const requestLogger: RequestHandler = (req, res, next) => {
  const requestId = randomUUID();

  req.requestId = requestId;

  res.setHeader("X-Request-Id", requestId);

  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    const logContext = {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
    };

    if (res.statusCode >= 500) {
      logger.error("HTTP request completed", logContext);
      return;
    }

    if (res.statusCode >= 400) {
      logger.warn("HTTP request completed", logContext);
      return;
    }

    logger.info("HTTP request completed", logContext);
  });

  requestContext.run({ requestId }, () => {
    next();
  });
};
