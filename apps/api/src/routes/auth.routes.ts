import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
} from "../controllers/auth.controller.js";
import { authRateLimiter } from "../middleware/rate-limiters.js";

const router = Router();

router.post("/register", authRateLimiter, registerController);
router.post("/login", authRateLimiter, loginController);
router.post("/refresh", authRateLimiter, refreshController);
router.post("/logout", logoutController);

export default router;
