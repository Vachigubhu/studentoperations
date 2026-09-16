import type { RequestHandler } from "express";

import {
  createRequestType,
  listRequestTypes,
  updateRequestType,
  updateRequestTypeStatus,
} from "../services/request-type.service.js";

import {
  createRequestTypeSchema,
  updateRequestTypeSchema,
  updateRequestTypeStatusSchema,
} from "../validators/admin-request-type.validator.js";

export const listRequestTypesController: RequestHandler = async (
  _req,
  res,
  next,
) => {
  try {
    const requestTypes = await listRequestTypes();

    res.status(200).json({
      data: requestTypes,
    });
  } catch (error) {
    next(error);
  }
};

export const createRequestTypeController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const input = createRequestTypeSchema.parse(req.body);

    const requestType = await createRequestType(input);

    res.status(201).json({
      data: requestType,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRequestTypeController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    const input = updateRequestTypeSchema.parse(req.body);

    const requestType = await updateRequestType(req.params.id, input);

    res.status(200).json({
      data: requestType,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRequestTypeStatusController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    const input = updateRequestTypeStatusSchema.parse(req.body);

    const requestType = await updateRequestTypeStatus(
      req.params.id,
      input.isActive,
    );

    res.status(200).json({
      data: requestType,
    });
  } catch (error) {
    next(error);
  }
};
