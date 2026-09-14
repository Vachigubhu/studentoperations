import { Router } from "express";
import {
  createCommentController,
  deleteCommentController,
  getRequestCommentsController,
  updateCommentController,
} from "../controllers/comment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.post(
  "/requests/:id/comments",
  authenticate,
  authorize("STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"),
  createCommentController,
);

router.get(
  "/requests/:id/comments",
  authenticate,
  authorize("STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"),
  getRequestCommentsController,
);

router.patch(
  "/comments/:id",
  authenticate,
  authorize("STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"),
  updateCommentController,
);

router.delete(
  "/comments/:id",
  authenticate,
  authorize("STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"),
  deleteCommentController,
);

export default router;
