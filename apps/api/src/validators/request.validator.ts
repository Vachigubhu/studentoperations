import { z } from "zod";

export const createRequestSchema = z.object({
  requestTypeId: z.string().min(1),

  title: z.string().trim().min(5).max(200),

  description: z.string().trim().min(10).max(5000),

  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
});
