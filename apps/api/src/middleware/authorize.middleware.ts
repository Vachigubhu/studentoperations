import type { RequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import type { UserRole } from "../types/roles.js";
import { User } from "../models/User.js";

export const authorize = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      next(new AppError(401, "Authentication required"));
      return;
    }

    const userRole = req.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      next(new AppError(403, "Forbidden"));
      return;
    }

    next();
  };
};
