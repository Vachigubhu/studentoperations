import type { RequestHandler } from "express";

import {
  createDepartment,
  listDepartments,
  updateDepartment,
  updateDepartmentStatus,
} from "../services/admin-department.service.js";

import {
  createDepartmentSchema,
  updateDepartmentSchema,
  updateDepartmentStatusSchema,
} from "../validators/admin-department.validator.js";

export const listDepartmentsController: RequestHandler = async (
  _req,
  res,
  next,
) => {
  try {
    const departments = await listDepartments();

    res.status(200).json({
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

export const createDepartmentController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const input = createDepartmentSchema.parse(req.body);

    const department = await createDepartment(input);

    res.status(201).json({
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDepartmentController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    const input = updateDepartmentSchema.parse(req.body);

    const department = await updateDepartment(req.params.id, input);

    res.status(200).json({
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDepartmentStatusController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    const { isActive } = updateDepartmentStatusSchema.parse(req.body);

    const department = await updateDepartmentStatus(req.params.id, isActive);

    res.status(200).json({
      data: department,
    });
  } catch (error) {
    next(error);
  }
};
