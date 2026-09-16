import { Router } from "express";
import { getRequestTypesController } from "../controllers/request-type.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.get("/", authenticate, authorize("STUDENT"), getRequestTypesController);

export default router;
