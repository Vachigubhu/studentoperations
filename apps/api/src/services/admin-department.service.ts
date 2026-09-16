import { AppError } from "../utils/AppError.js";
import { DepartmentModel } from "../models/Department.js";

type CreateDepartmentInput = {
  name: string;
  code: string;
  description?: string;
};

type UpdateDepartmentInput = {
  name?: string;
  code?: string;
  description?: string;
};

export const listDepartments = async () => {
  return DepartmentModel.find().sort({ name: 1 }).lean();
};

export const createDepartment = async ({
  name,
  code,
  description,
}: CreateDepartmentInput) => {
  const normalizedCode = code.trim().toUpperCase();

  const existing = await DepartmentModel.findOne({
    $or: [{ code: normalizedCode }, { name: name.trim() }],
  });

  if (existing) {
    throw new AppError(
      409,
      "A department with this name or code already exists",
    );
  }

  return DepartmentModel.create({
    name: name.trim(),
    code: normalizedCode,
    description: description?.trim(),
  });
};

export const updateDepartment = async (
  departmentId: string,
  input: UpdateDepartmentInput,
) => {
  const update: UpdateDepartmentInput = {};

  if (input.name !== undefined) {
    update.name = input.name.trim();
  }

  if (input.code !== undefined) {
    update.code = input.code.trim().toUpperCase();
  }

  if (input.description !== undefined) {
    update.description = input.description.trim();
  }

  if (update.name || update.code) {
    const duplicateFilter: Record<string, unknown> = {
      _id: { $ne: departmentId },
      $or: [],
    };

    const conditions: Record<string, unknown>[] = [];

    if (update.name) {
      conditions.push({ name: update.name });
    }

    if (update.code) {
      conditions.push({ code: update.code });
    }

    duplicateFilter.$or = conditions;

    const existing = await DepartmentModel.findOne(duplicateFilter);

    if (existing) {
      throw new AppError(
        409,
        "A department with this name or code already exists",
      );
    }
  }

  const department = await DepartmentModel.findByIdAndUpdate(
    departmentId,
    update,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!department) {
    throw new AppError(404, "Department not found");
  }

  return department;
};

export const updateDepartmentStatus = async (
  departmentId: string,
  isActive: boolean,
) => {
  const department = await DepartmentModel.findByIdAndUpdate(
    departmentId,
    { isActive },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!department) {
    throw new AppError(404, "Department not found");
  }

  return department;
};
