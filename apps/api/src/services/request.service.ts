import { RequestModel } from "../models/Request.js";
import { RequestTypeModel } from "../models/RequestType.js";
import { AppError } from "../utils/AppError.js";
import type { RequestStatus } from "../types/request.js";
import { canTransition } from "../utils/request-status.js";
import "../models/Department.js";
import { UserModel } from "../models/User.js";
import { UserRole } from "../types/roles.js";
import { emitAuditEvent } from "../events/audit.js";
import { eventBus } from "../events/event-bus.js";
import { EVENTS } from "../events/events.js";

type CreateRequestInput = {
  requestTypeId: string;
  title: string;
  description: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
};

export const createRequest = async (
  studentId: string,
  input: CreateRequestInput,
) => {
  const requestType = await RequestTypeModel.findOne({
    _id: input.requestTypeId,
    isActive: true,
  });

  if (!requestType) {
    throw new AppError(404, "Request type not found");
  }

  const request = await RequestModel.create({
    student: studentId,
    requestType: requestType._id,
    department: requestType.department,
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: "DRAFT",
  });

  emitAuditEvent(
    studentId,
    "REQUEST_CREATED",
    "Request",
    request._id.toString(),
    {
      metadata: {
        requestTypeId: request.requestType.toString(),
        departmentId: request.department.toString(),
        priority: request.priority,
      },
    },
  );

  return request.populate([
    {
      path: "requestType",
      select: "name code",
    },
    {
      path: "department",
      select: "name code",
    },
  ]);
};

export const submitRequest = async (requestId: string, studentId: string) => {
  const request = await RequestModel.findOne({
    _id: requestId,
    student: studentId,
  });

  if (!request) {
    throw new AppError(404, "Request not found");
  }

  if (request.status !== "DRAFT") {
    throw new AppError(
      400,
      `Request cannot be submitted from ${request.status} status`,
    );
  }

  request.status = "SUBMITTED";
  request.submittedAt = new Date();

  emitAuditEvent(
    studentId,
    "REQUEST_SUBMITTED",
    "Request",
    request._id.toString(),
  );

  await request.save();

  return request;
};

export const getStudentRequests = async (studentId: string) => {
  return RequestModel.find({
    student: studentId,
  })
    .populate("requestType", "name code")
    .populate("department", "name code")
    .populate("assignedTo", "firstName lastName email")
    .sort({ createdAt: -1 });
};

export const getStudentRequest = async (
  requestId: string,
  studentId: string,
) => {
  const request = await RequestModel.findOne({
    _id: requestId,
    student: studentId,
  })
    .populate("requestType", "name code")
    .populate("department", "name code")
    .populate("assignedTo", "firstName lastName email");

  if (!request) {
    throw new AppError(404, "Request not found");
  }

  return request;
};

export const transitionRequest = async (
  requestId: string,
  departmentId: string,
  nextStatus: RequestStatus,
  userRole: UserRole,
  actorId: string,
) => {
  const request = await RequestModel.findOne({
    _id: requestId,
    department: departmentId,
  });

  if (!request) {
    throw new AppError(404, "Request not found");
  }

  const currentStatus = request.status as RequestStatus;

  if (!canTransition(currentStatus, nextStatus)) {
    throw new AppError(
      400,
      `Cannot transition request from ${currentStatus} to ${nextStatus}`,
    );
  }

  const staffAllowedStatuses: RequestStatus[] = [
    "UNDER_REVIEW",
    "CORRECTION_REQUIRED",
    "REJECTED",
  ];

  const managerAllowedStatuses: RequestStatus[] = [
    "UNDER_REVIEW",
    "CORRECTION_REQUIRED",
    "APPROVED",
    "REJECTED",
    "COMPLETED",
  ];

  if (userRole === "STAFF" && !staffAllowedStatuses.includes(nextStatus)) {
    throw new AppError(
      403,
      `STAFF cannot transition requests to ${nextStatus}`,
    );
  }

  if (
    (userRole === "MANAGER" ||
      userRole === "ADMIN" ||
      userRole === "SUPER_ADMIN") &&
    !managerAllowedStatuses.includes(nextStatus)
  ) {
    throw new AppError(
      403,
      `${userRole} cannot transition requests to ${nextStatus}`,
    );
  }

  request.status = nextStatus;

  if (nextStatus === "COMPLETED") {
    request.completedAt = new Date();
  }

  await request.save();

  emitAuditEvent(
    actorId,
    "REQUEST_STATUS_CHANGED",
    "Request",
    request._id.toString(),
    {
      metadata: {
        from: currentStatus,
        to: nextStatus,
      },
    },
  );

  return getStaffRequest(requestId, departmentId);
};

export const getStaffRequests = async (departmentId: string) => {
  return RequestModel.find({
    department: departmentId,
    status: {
      $in: ["SUBMITTED", "UNDER_REVIEW", "CORRECTION_REQUIRED", "APPROVED"],
    },
  })
    .populate("requestType", "name code")
    .populate("department", "name code")
    .populate("student", "firstName lastName email")
    .populate("assignedTo", "firstName lastName email")
    .sort({ createdAt: -1 });
};

export const getStaffRequest = async (
  requestId: string,
  departmentId: string,
) => {
  const request = await RequestModel.findOne({
    _id: requestId,
    department: departmentId,
  })
    .populate("requestType", "name code")
    .populate("department", "name code")
    .populate("student", "firstName lastName email")
    .populate("assignedTo", "firstName lastName email");

  if (!request) {
    throw new AppError(404, "Request not found");
  }

  return request;
};

export const assignRequest = async (
  requestId: string,
  departmentId: string,
  staffId: string,
  actorId: string,
  actorRole: UserRole,
) => {
  const request = await RequestModel.findOne({
    _id: requestId,
    department: departmentId,
  });

  if (!request) {
    throw new AppError(404, "Request not found");
  }

  const staff = await UserModel.findOne({
    _id: staffId,
    department: departmentId,
    role: { $in: ["STAFF", "MANAGER"] },
    isActive: true,
  });

  if (!staff) {
    throw new AppError(404, "Staff member not found");
  }

  request.assignedTo = staff._id;
  await request.save();

  emitAuditEvent(
    actorId,
    "REQUEST_ASSIGNED",
    "Request",
    request._id.toString(),
    {
      metadata: {
        assignedTo: staffId,
      },
    },
  );

  return getStaffRequest(requestId, departmentId);
};

export const resubmitRequest = async (requestId: string, studentId: string) => {
  const request = await RequestModel.findOne({
    _id: requestId,
    student: studentId,
  });

  if (!request) {
    throw new AppError(404, "Request not found");
  }

  if (request.status !== "CORRECTION_REQUIRED") {
    throw new AppError(
      400,
      "Only requests requiring correction can be resubmitted",
    );
  }

  request.status = "UNDER_REVIEW";

  await request.save();

  return getStudentRequest(requestId, studentId);
};
