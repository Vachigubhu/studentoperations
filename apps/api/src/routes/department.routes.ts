import { Router } from "express";

import {
  createDepartmentController,
  listDepartmentsController,
  updateDepartmentController,
  updateDepartmentStatusController,
} from "../controllers/admin-department.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN", "SUPER_ADMIN"));

router.get("/", listDepartmentsController);

router.post("/", createDepartmentController);

router.patch("/:id", updateDepartmentController);

router.patch("/:id/status", updateDepartmentStatusController);

export default router;
