import type { RequestHandler } from "express";
import { verifyAccessToken } from "../utils/tokens.js";
import { AppError } from "../utils/AppError.js";
import type { UserRole } from "../types/roles.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate: RequestHandler = (req, _res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError(401, "Authentication required");
    }

    const token = authorization.substring(7);

    const payload = verifyAccessToken(token);

    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError(401, "Invalid or expired access token"));
  }
};
