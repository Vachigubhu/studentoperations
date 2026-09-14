import { z } from "zod";

export const createApprovalSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED", "CORRECTION_REQUIRED"]),

  comment: z.string().trim().max(2000).optional(),
});
