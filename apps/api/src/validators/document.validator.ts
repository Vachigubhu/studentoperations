import z from "zod";

export const uploadDocumentSchema = z.object({
  category: z.string().trim().min(2).max(100),
});
