import { z } from "zod";

export const createRequestTypeSchema = z.object({
  name: z.string().trim().min(2).max(100),

  code: z
    .string()
    .trim()
    .min(2)
    .max(30)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Code may only contain letters, numbers, underscores, and hyphens",
    ),

  description: z.string().trim().max(500).optional(),

  departmentId: z.string().min(1),
});

export const updateRequestTypeSchema = createRequestTypeSchema.partial();

export const updateRequestTypeStatusSchema = z.object({
  isActive: z.boolean(),
});
