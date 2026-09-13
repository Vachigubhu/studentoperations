export const USER_ROLES = [
  "STUDENT",
  "STAFF",
  "MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
] as const;

export type UserRole = (typeof USER_ROLES)[number];
