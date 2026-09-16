import type { RequestHandler } from "express";
import { getActiveRequestTypes } from "../services/request-type.service.js";
import { AppError } from "../utils/AppError.js";

export const getRequestTypesController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const requestTypes = await getActiveRequestTypes();

    res.status(200).json({
      status: "success",
      data: {
        requestTypes,
      },
    });
  } catch (error) {
    next(error);
  }
};
