import { Router } from "express";
import {
  getCurrentUser,
  getUserDirectory,
} from "../controllers/user.controller.js";
import {
  listUsersController,
  updateUserRoleController,
  updateUserStatusController,
} from "../controllers/admin-user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.get("/me", authenticate, getCurrentUser);

router.get("/directory", authenticate, getUserDirectory);

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  listUsersController,
);

router.patch(
  "/:id/role",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  updateUserRoleController,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  updateUserStatusController,
);

export default router;
