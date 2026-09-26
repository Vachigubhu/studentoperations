import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import mongoose from "mongoose";
import multer from "multer";
import { logger } from "../utils/logger.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const requestId = req.requestId;

  if (error instanceof ZodError) {
    logger.warn("Validation error", {
      requestId,
      method: req.method,
      path: req.originalUrl,
    });

    res.status(400).json({
      status: "error",
      message: "validation failed",
      errors: error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
      })),
    });
    return;
  }

  if (error instanceof multer.MulterError) {
    logger.warn("File upload error", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      code: error.code,
    });

    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        status: "error",
        message: "File is too large. Maximum file size is 5 MB.",
      });
      return;
    }

    res.status(400).json({
      status: "error",
      message: "File upload failed.",
    });
    return;
  }

  if (error instanceof AppError) {
    const logMethod = error.statusCode >= 500 ? "error" : "warn";

    logger[logMethod]("Application error", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: error.statusCode,
      message: error.message,
    });

    res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    logger.warn("Invalid resource ID", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      field: error.path,
    });

    res.status(400).json({
      status: "error",
      message: "Invalid resource ID",
    });
    return;
  }

  logger.error("Unhandled server error", {
    requestId,
    method: req.method,
    path: req.originalUrl,
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : String(error),
  });

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
