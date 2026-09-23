import { RequestModel } from "../models/Request.js";
import { AppError } from "./AppError.js";

export type RequestAccessUser = {
  userId: string;
  role: "STUDENT" | "STAFF" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";
  departmentId?: string;
};

export const getAccessibleRequest = async (
  requestId: string,
  user: RequestAccessUser,
) => {
  let request;

  if (user.role === "STUDENT") {
    request = await RequestModel.findOne({
      _id: requestId,
      student: user.userId,
    });
  } else if (user.role === "STAFF" || user.role === "MANAGER") {
    if (!user.departmentId) {
      throw new AppError(403, "User is not assigned to a department");
    }

    request = await RequestModel.findOne({
      _id: requestId,
      department: user.departmentId,
    });
  } else {
    request = await RequestModel.findById(requestId);
  }

  if (!request) {
    throw new AppError(404, "Request not found");
  }

  return request;
};
