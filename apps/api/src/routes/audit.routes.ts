import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { listAuditLogs } from "../controllers/audit.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("ADMIN", "SUPER_ADMIN"), listAuditLogs);

export default router;
