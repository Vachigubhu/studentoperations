import { Router } from "express";

import {
  getUserNotificationsController,
  markNotificationAsReadController,
} from "../controllers/notification.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/notifications", authenticate, getUserNotificationsController);

router.patch(
  "/notifications/:id/read",
  authenticate,
  markNotificationAsReadController,
);

export default router;
