import { RequestTypeModel } from "../models/RequestType.js";
import "../models/Department.js";
import { AppError } from "../utils/AppError.js";
import { Types } from "mongoose";

type CreateRequestTypeInput = {
  name: string;
  code: string;
  description?: string;
  departmentId: string;
};

type UpdateRequestTypeInput = Partial<CreateRequestTypeInput>;

export const getActiveRequestTypes = async () => {
  return RequestTypeModel.find({
    isActive: true,
  })
    .populate("department", "name code")
    .sort({ name: 1 });
};

export const listRequestTypes = async () => {
  return RequestTypeModel.find()
    .populate("department", "name code")
    .sort({ name: 1 });
};

export const createRequestType = async (input: CreateRequestTypeInput) => {
  const code = input.code.trim().toUpperCase();

  const existing = await RequestTypeModel.findOne({ code });

  if (existing) {
    throw new AppError(409, "A request type with this code already exists");
  }

  if (!Types.ObjectId.isValid(input.departmentId)) {
    throw new AppError(400, "Invalid department ID");
  }

  const requestType = await RequestTypeModel.create({
    name: input.name.trim(),
    code,
    description: input.description?.trim(),
    department: new Types.ObjectId(input.departmentId),
  });

  return requestType.populate("department", "name code");
};

export const updateRequestType = async (
  requestTypeId: string,
  input: UpdateRequestTypeInput,
) => {
  const requestType = await RequestTypeModel.findById(requestTypeId);

  if (!requestType) {
    throw new AppError(404, "Request type not found");
  }

  if (input.code !== undefined) {
    const code = input.code.trim().toUpperCase();

    const existing = await RequestTypeModel.findOne({
      code,
      _id: { $ne: requestTypeId },
    });

    if (existing) {
      throw new AppError(409, "A request type with this code already exists");
    }

    requestType.code = code;
  }

  if (input.name !== undefined) {
    requestType.name = input.name.trim();
  }

  if (input.description !== undefined) {
    requestType.description = input.description.trim();
  }

  if (input.departmentId !== undefined) {
    if (!Types.ObjectId.isValid(input.departmentId)) {
      throw new AppError(400, "Invalid department ID");
    }

    requestType.department = new Types.ObjectId(input.departmentId);
  }

  await requestType.save();

  return requestType.populate("department", "name code");
};

export const updateRequestTypeStatus = async (
  requestTypeId: string,
  isActive: boolean,
) => {
  const requestType = await RequestTypeModel.findByIdAndUpdate(
    requestTypeId,
    { isActive },
    { new: true, runValidators: true },
  ).populate("department", "name code");

  if (!requestType) {
    throw new AppError(404, "Request type not found");
  }

  return requestType;
};
