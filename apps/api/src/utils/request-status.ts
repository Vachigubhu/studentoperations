import type { RequestStatus } from "../types/request.js";

const allowedTransitions: Record<RequestStatus, RequestStatus[]> = {
  DRAFT: ["SUBMITTED"],

  SUBMITTED: ["UNDER_REVIEW"],

  UNDER_REVIEW: ["CORRECTION_REQUIRED", "APPROVED", "REJECTED"],

  CORRECTION_REQUIRED: ["UNDER_REVIEW"],

  APPROVED: ["COMPLETED"],

  REJECTED: [],

  COMPLETED: [],
};

export const canTransition = (
  currentStatus: RequestStatus,
  nextStatus: RequestStatus,
): boolean => {
  return allowedTransitions[currentStatus].includes(nextStatus);
};
