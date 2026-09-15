import mongoose from "mongoose";
import { ApprovalModel } from "../models/Approval.js";
import { RequestModel } from "../models/Request.js";
import { UserModel } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { eventBus } from "../events/event-bus.js";
import { EVENTS } from "../events/events.js";
import { emitAuditEvent } from "../events/audit.js";

type ApprovalDecision = "APPROVED" | "REJECTED" | "CORRECTION_REQUIRED";

type ApproverRole = "STAFF" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";

export const createApproval = async (
  requestId: string,
  approverId: string,
  approverRole: ApproverRole,
  decision: ApprovalDecision,
  comment?: string,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const request = await RequestModel.findById(requestId).session(session);

    if (!request) {
      throw new AppError(404, "Request not found");
    }

    if (request.status !== "UNDER_REVIEW") {
      throw new AppError(
        400,
        "Only requests under review can receive an approval decision",
      );
    }

    if (approverRole === "STAFF" || approverRole === "MANAGER") {
      const approver = await UserModel.findOne({
        _id: approverId,
        department: request.department,
        role: approverRole,
        isActive: true,
      }).session(session);

      if (!approver) {
        throw new AppError(
          403,
          "You are not authorized to approve requests from this department",
        );
      }
    }

    const statusMap: Record<
      ApprovalDecision,
      "APPROVED" | "REJECTED" | "CORRECTION_REQUIRED"
    > = {
      APPROVED: "APPROVED",
      REJECTED: "REJECTED",
      CORRECTION_REQUIRED: "CORRECTION_REQUIRED",
    };

    const nextStatus = statusMap[decision];

    const [approval] = await ApprovalModel.create(
      [
        {
          request: request._id,
          approver: approverId,
          decision,
          comment,
        },
      ],
      { session },
    );

    request.status = nextStatus;

    await request.save({ session });

    const populatedApproval = await approval.populate([
      {
        path: "approver",
        select: "firstName lastName email role",
      },
      {
        path: "request",
        select: "title status priority",
      },
    ]);

    await session.commitTransaction();

    eventBus.emit(EVENTS.APPROVAL_DECISION, {
      requestId: request._id.toString(),
      studentId: request.student.toString(),
      decision,
    });

    emitAuditEvent(
      approverId,
      "APPROVAL_CREATED",
      "Request",
      request._id.toString(),
      {
        metadata: {
          decision,
          comment,
        },
      },
    );

    return populatedApproval;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

export const getRequestApprovals = async (requestId: string) => {
  const request = await RequestModel.findById(requestId);

  if (!request) {
    throw new AppError(404, "Request not found");
  }

  return ApprovalModel.find({
    request: requestId,
  })
    .populate("approver", "firstName lastName email role")
    .sort({ createdAt: -1 });
};
