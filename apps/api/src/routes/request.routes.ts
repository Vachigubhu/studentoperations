import { Router } from "express";
import {
  createRequestController,
  getStudentRequestsController,
  getStudentRequestController,
  submitRequestController,
  getStaffRequestsController,
  getStaffRequestController,
  assignRequestController,
  transitionRequestController,
  resubmitRequestController,
} from "../controllers/request.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.post("/", authenticate, authorize("STUDENT"), createRequestController);

router.get(
  "/",
  authenticate,
  authorize("STUDENT"),
  getStudentRequestsController,
);

router.post(
  "/:id/submit",
  authenticate,
  authorize("STUDENT"),
  submitRequestController,
);

router.post(
  "/:id/resubmit",
  authenticate,
  authorize("STUDENT"),
  resubmitRequestController,
);

router.get(
  "/department",
  authenticate,
  authorize("STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"),
  getStaffRequestsController,
);

router.get(
  "/department/:id",
  authenticate,
  authorize("STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"),
  getStaffRequestController,
);

router.get(
  "/:id",
  authenticate,
  authorize("STUDENT"),
  getStudentRequestController,
);

router.post(
  "/:id/assign",
  authenticate,
  authorize("STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"),
  assignRequestController,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"),
  transitionRequestController,
);

export default router;
