import { Router } from "express";

import {
  uploadDocumentController,
  getStudentDocumentsController,
  deleteDocumentController,
  downloadDocumentController,
} from "../controllers/document.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { uploadDocument } from "../middleware/upload.middleware.js";

const requestDocumentRouter = Router();

requestDocumentRouter.post(
  "/:id/documents",
  authenticate,
  authorize("STUDENT"),
  uploadDocument.single("file"),
  uploadDocumentController,
);

requestDocumentRouter.get(
  "/:id/documents",
  authenticate,
  authorize("STUDENT"),
  getStudentDocumentsController,
);

const documentRouter = Router();

documentRouter.delete(
  "/:id",
  authenticate,
  authorize("STUDENT"),
  deleteDocumentController,
);

documentRouter.get("/:id/download", authenticate, downloadDocumentController);

export { requestDocumentRouter };

export default documentRouter;
