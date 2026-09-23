import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import mongoose from "mongoose";
import multer from "multer";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  if (error instanceof ZodError) {
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
    res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      status: "error",
      message: "Invalid resource ID",
    });
    return;
  }

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
