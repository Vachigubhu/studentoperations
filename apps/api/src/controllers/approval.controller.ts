import type { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import { createApprovalSchema } from "../validators/approval.validator.js";
import {
  createApproval,
  getRequestApprovals,
} from "../services/approval.service.js";

export const createApprovalController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const input = createApprovalSchema.parse(req.body);

    if (
      req.user.role !== "STAFF" &&
      req.user.role !== "MANAGER" &&
      req.user.role !== "ADMIN" &&
      req.user.role !== "SUPER_ADMIN"
    ) {
      throw new AppError(403, "You are not authorized to approve requests");
    }

    const approval = await createApproval(
      req.params.id,
      req.user.userId,
      req.user.role,
      input.decision,
      input.comment,
    );

    res.status(201).json({
      status: "success",
      message: "Approval recorded successfully",
      data: approval,
    });
  } catch (error) {
    next(error);
  }
};

export const getRequestApprovalsController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const approvals = await getRequestApprovals(req.params.id);

    res.status(200).json({
      status: "success",
      data: approvals,
    });
  } catch (error) {
    next(error);
  }
};
