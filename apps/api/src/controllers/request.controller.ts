import type { RequestHandler } from "express";
import {
  assignRequest,
  createRequest,
  getStaffRequest,
  getStaffRequests,
  getStudentRequest,
  getStudentRequests,
  resubmitRequest,
  submitRequest,
  transitionRequest,
} from "../services/request.service.js";
import { createRequestSchema } from "../validators/request.validator.js";
import { AppError } from "../utils/AppError.js";
import { transitionRequestSchema } from "../validators/request-status.validator.js";

export const createRequestController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const input = createRequestSchema.parse(req.body);

    const request = await createRequest(req.user.userId, input);

    res.status(201).json({
      status: "success",
      data: {
        request,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentRequestsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const requests = await getStudentRequests(req.user.userId);

    res.status(200).json({
      status: "success",
      data: {
        requests,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentRequestController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const request = await getStudentRequest(req.params.id, req.user.userId);

    res.status(200).json({
      status: "success",
      data: {
        request,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitRequestController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const request = await submitRequest(req.params.id, req.user.userId);

    res.status(200).json({
      status: "success",
      data: {
        request,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStaffRequestController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    if (!req.user.departmentId) {
      throw new AppError(403, "User is not assigned to a department");
    }

    const request = await getStaffRequest(req.params.id, req.user.departmentId);

    res.status(200).json({
      status: "success",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const assignRequestController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    if (!req.user.departmentId) {
      throw new AppError(403, "User is not assigned to a department");
    }

    const { staffId } = req.body;

    if (!staffId || typeof staffId !== "string") {
      throw new AppError(400, "staffId is required");
    }

    const request = await assignRequest(
      req.params.id,
      req.user.departmentId,
      staffId,
    );

    res.status(200).json({
      status: "success",
      message: "Request assigned successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const transitionRequestController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    if (!req.user.departmentId) {
      throw new AppError(403, "User is not assigned to a department");
    }

    const input = transitionRequestSchema.parse(req.body);

    const request = await transitionRequest(
      req.params.id,
      req.user.departmentId,
      input.status,
      req.user.role,
    );

    res.status(200).json({
      status: "success",
      message: "Request status updated successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const getStaffRequestsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    if (!req.user.departmentId) {
      throw new AppError(403, "User is not assigned to a department");
    }

    const requests = await getStaffRequests(req.user.departmentId);

    res.status(200).json({
      status: "success",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const resubmitRequestController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const request = await resubmitRequest(req.params.id, req.user.userId);

    res.status(200).json({
      status: "success",
      message: "Request resubmitted successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
