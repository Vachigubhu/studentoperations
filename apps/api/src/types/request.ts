export const REQUEST_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "CORRECTION_REQUIRED",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;

export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];
