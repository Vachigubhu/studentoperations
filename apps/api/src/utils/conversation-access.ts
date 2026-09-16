import { AppError } from "./AppError.js";
import { ConversationModel } from "../models/Conversation.js";
import { Types } from "mongoose";

type ConversationAccessUser = {
  userId: string;
  role: "STUDENT" | "STAFF" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";
};

export const getAccessibleConversation = async (
  conversationId: string,
  user: ConversationAccessUser,
) => {
  if (!Types.ObjectId.isValid(conversationId)) {
    throw new AppError(400, "Invalid conversation ID");
  }

  const conversation = await ConversationModel.findById(conversationId);

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const isParticipant = conversation.participants.some((participant) =>
    participant.equals(user.userId),
  );

  const isPrivileged = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  if (!isParticipant && !isPrivileged) {
    throw new AppError(403, "Forbidden");
  }

  return conversation;
};
