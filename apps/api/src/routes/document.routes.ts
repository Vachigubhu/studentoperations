import { Router } from "express";
import {
  uploadDocumentController,
  getStudentDocumentsController,
  deleteDocumentController,
} from "../controllers/document.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { uploadDocument } from "../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/requests/:id/documents",
  authenticate,
  authorize("STUDENT"),
  uploadDocument.single("file"),
  uploadDocumentController,
);

router.get(
  "/requests/:id/documents",
  authenticate,
  authorize("STUDENT"),
  getStudentDocumentsController,
);

router.delete(
  "/documents/:id",
  authenticate,
  authorize("STUDENT"),
  deleteDocumentController,
);

export default router;