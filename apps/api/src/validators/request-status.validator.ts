import { z } from "zod";

export const transitionRequestSchema = z.object({
  status: z.enum([
    "UNDER_REVIEW",
    "CORRECTION_REQUIRED",
    "APPROVED",
    "REJECTED",
    "COMPLETED",
  ]),
});
