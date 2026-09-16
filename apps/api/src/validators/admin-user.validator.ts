import { z } from "zod";

export const listUsersSchema = z.object({
  search: z.string().trim().optional(),
  role: z
    .enum(["STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"])
    .optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"]),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});
