import { Router } from "express";
import {
  adminTestController,
  managerTestController,
  staffTestController,
} from "../controllers/role-test.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.get(
  "/staff",
  authenticate,
  authorize("STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"),
  staffTestController,
);

router.get(
  "/manager",
  authenticate,
  authorize("MANAGER", "ADMIN", "SUPER_ADMIN"),
  managerTestController,
);

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  adminTestController,
);

export default router;
