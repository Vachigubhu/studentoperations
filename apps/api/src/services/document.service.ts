import crypto from "node:crypto";
import { DocumentModel } from "../models/Document.js";
import { RequestModel } from "../models/Request.js";
import { AppError } from "../utils/AppError.js";
import { deleteFile, saveFile } from "../utils/file-storage.js";
import path from "node:path";

export const uploadDocument = async (
  requestId: string,
  userId: string,
  category: string,
  file: Express.Multer.File,
) => {
  const request = await RequestModel.findOne({
    _id: requestId,
    student: userId,
  });

  if (!request) {
    throw new AppError(404, "Request not found");
  }

  if (request.status === "COMPLETED") {
    throw new AppError(400, "Cannot upload documents to a copmleted request");
  }

  const extension = file.originalname.includes(".")
    ? path.extname(file.originalname).toLowerCase()
    : "";

  const storageKey = `${crypto.randomUUID()}${extension}`;

  try {
    await saveFile(file, storageKey);

    const document = await DocumentModel.create({
      request: request._id,
      uploadedBy: userId,
      originalName: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      size: file.size,
      category,
    });
  } catch (error) {
    await deleteFile(storageKey);
    throw error;
  }
};

export const getStudentDocuments = async (
  requestId: string,
  userId: string,
) => {
  const request = await RequestModel.findOne({
    _id: requestId,
    student: userId,
  });

  if (!request) {
    throw new AppError(404, "Request not found");
  }

  return DocumentModel.find({
    request: request._id,
  }).sort({ createdAt: -1 });
};

export const deleteDocument = async (documentId: string, userId: string) => {
  const document = await DocumentModel.findOne({
    _id: documentId,
    uploadedBy: userId,
  });

  if (!document) {
    throw new AppError(404, "Document not found");
  }

  await deleteFile(document.storageKey);

  await document.deleteOne();

  return document;
};