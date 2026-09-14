import { Router } from "express";
import {
  createApprovalController,
  getRequestApprovalsController,
} from "../controllers/approval.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.post(
  "/requests/:id/approvals",
  authenticate,
  authorize("STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"),
  createApprovalController,
);

router.get(
  "/requests/:id/approvals",
  authenticate,
  authorize("STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"),
  getRequestApprovalsController,
);

export default router;
