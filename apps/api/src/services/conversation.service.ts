import { AppError } from "../utils/AppError.js";
import { ConversationModel } from "../models/Conversation.js";
import { UserModel } from "../models/User.js";
import { getAccessibleRequest } from "../utils/request-access.js";

type ConversationUser = {
  userId: string;
  role: "STUDENT" | "STAFF" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";
  departmentId?: string;
};

type CreateConversationInput = {
  creator: ConversationUser;
  participantId: string;
  subject: string;
  requestId?: string;
};

export const createConversation = async ({
  creator,
  participantId,
  subject,
  requestId,
}: CreateConversationInput) => {
  if (creator.userId === participantId) {
    throw new AppError(400, "You cannot create a conversation with yourself");
  }

  const participant = await UserModel.findOne({
    _id: participantId,
    isActive: true,
  });

  if (!participant) {
    throw new AppError(404, "Participant not found");
  }

  if (requestId) {
    await getAccessibleRequest(requestId, creator);

    const participantHasAccess =
      participant.role === "ADMIN" || participant.role === "SUPER_ADMIN";

    if (!participantHasAccess) {
      if (participant.role === "STUDENT") {
        await getAccessibleRequest(requestId, {
          userId: participant._id.toString(),
          role: "STUDENT",
        });
      } else if (
        participant.role === "STAFF" ||
        participant.role === "MANAGER"
      ) {
        if (!participant.department) {
          throw new AppError(
            403,
            "Participant is not assigned to a department",
          );
        }

        const request = await getAccessibleRequest(requestId, {
          userId: participant._id.toString(),
          role: participant.role,
          departmentId: participant.department.toString(),
        });

        if (!request) {
          throw new AppError(
            403,
            "Participant does not have access to this request",
          );
        }
      }
    }
  }

  const existingConversation = await ConversationModel.findOne({
    request: requestId ?? null,
    participants: {
      $all: [creator.userId, participantId],
    },
  });

  if (existingConversation) {
    return existingConversation;
  }

  const conversation = await ConversationModel.create({
    participants: [creator.userId, participantId],
    request: requestId ?? null,
    subject,
  });

  return conversation;
};

export const getUserConversations = async (userId: string) => {
  return ConversationModel.find({
    participants: userId,
  })
    .populate("participants", "firstName lastName email role department")
    .populate("request", "title status priority")
    .sort({
      lastMessageAt: -1,
      createdAt: -1,
    });
};
