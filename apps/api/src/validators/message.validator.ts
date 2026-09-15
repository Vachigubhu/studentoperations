import { z } from "zod";

export const createConversationSchema = z.object({
  participantId: z.string().min(1),
  requestId: z.string().optional(),
  subject: z.string().trim().min(1).max(200),
});

export const sendMessageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(5000, "Message cannot exceed 5000 characters"),
});

export const messageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(50),
});