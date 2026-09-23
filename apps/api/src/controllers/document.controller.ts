import type { RequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import { uploadDocumentSchema } from "../validators/document.validator.js";
import {
  deleteDocument,
  getStudentDocuments,
  uploadDocument,
} from "../services/document.service.js";
import { getDocumentFile } from "../services/document.service.js";

export const uploadDocumentController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    if (!req.file) {
      throw new AppError(400, "Document file is required");
    }

    const input = uploadDocumentSchema.parse(req.body);

    const document = await uploadDocument(
      req.params.id,
      req.user.userId,
      input.category,
      req.file,
    );

    res.status(201).json({
      status: "success",
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentDocumentsController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const documents = await getStudentDocuments(req.params.id, req.user.userId);

    res.status(200).json({
      status: "success",
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocumentController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    await deleteDocument(req.params.id, req.user.userId);

    res.status(200).json({
      status: "success",
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const downloadDocumentController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    const user = req.user!;

    const { document, stream } = await getDocumentFile(req.params.id, user);

    res.setHeader("Content-Type", document.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(document.originalName)}"`,
    );

    stream.on("error", next);
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};
