import { Router } from "express";
import { getReadiness } from "../controllers/readiness.controller.js";

const router = Router();

router.get("/", getReadiness);

export default router;
