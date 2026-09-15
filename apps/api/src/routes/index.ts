import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import roleTestRoutes from "./role-test.routes.js";
import requestRoutes from "./request.routes.js";
import documentRoutes from "./document.routes.js";
import aprovalRoutes from "./approval.routes.js";
import commentRoutes from "./comment.routes.js";
import notificationRoutes from "./notification.routes.js";
import auditRoutes from "./audit.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/role-tests", roleTestRoutes);
router.use("/requests", requestRoutes);
router.use(documentRoutes);
router.use(aprovalRoutes);
router.use(commentRoutes);
router.use(notificationRoutes);
router.use("/audit-logs", auditRoutes);

export default router;
