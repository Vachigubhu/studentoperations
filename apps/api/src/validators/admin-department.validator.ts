import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2).max(100),
  code: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Code may only contain letters, numbers, underscores, and hyphens",
    ),
  description: z.string().trim().max(500).optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const updateDepartmentStatusSchema = z.object({
  isActive: z.boolean(),
});
