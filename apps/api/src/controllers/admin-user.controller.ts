import type { RequestHandler } from "express";

import {
  listUsers,
  updateUserRole,
  updateUserStatus,
} from "../services/admin-user.service.js";

import {
  listUsersSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "../validators/admin-user.validator.js";

export const listUsersController: RequestHandler = async (req, res, next) => {
  try {
    const query = listUsersSchema.parse(req.query);

    const result = await listUsers(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    const { role } = updateUserRoleSchema.parse(req.body);

    const user = await updateUserRole(req.params.id, role);

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatusController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    const { isActive } = updateUserStatusSchema.parse(req.body);

    const user = await updateUserStatus(req.params.id, isActive);

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
