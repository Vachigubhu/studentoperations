import { Router } from "express";

import {
  createRequestTypeController,
  listRequestTypesController,
  updateRequestTypeController,
  updateRequestTypeStatusController,
} from "../controllers/admin-request-type.controller.js";

import { getRequestTypesController } from "../controllers/request-type.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.get("/", authenticate, getRequestTypesController);

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  createRequestTypeController,
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  updateRequestTypeController,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  updateRequestTypeStatusController,
);

export default router;
