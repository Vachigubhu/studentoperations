import { emitAuditEvent } from "../events/audit.js";
import { MessageModel } from "../models/Message.js";
import { emitToUser } from "../socket/socket-server.js";
import { getAccessibleConversation } from "../utils/conversation-access.js";
import { createNotification } from "./notification.service.js";

type MessageUser = {
  userId: string;
  role: "STUDENT" | "STAFF" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";
};

export const sendMessage = async (
  conversationId: string,
  user: MessageUser,
  body: string,
) => {
  const conversation = await getAccessibleConversation(conversationId, user);

  const message = await MessageModel.create({
    conversation: conversation._id,
    sender: user.userId,
    body,
  });

  const recipients = conversation.participants
    .map((participant) => participant.toString())
    .filter((participantId) => participantId !== user.userId);

  for (const recipientId of recipients) {
    await createNotification({
      recipientId,
      type: "MESSAGE_RECEIVED",
      title: "New message",
      message: `You have a new message in "${conversation.subject}".`,
      requestId: conversation.request
        ? conversation.request.toString()
        : undefined,
    });

    emitToUser(recipientId, "message:new", {
      message,
      conversationId: conversation._id.toString(),
    });
  }

  conversation.lastMessageAt = message.createdAt;

  await conversation.save();

  emitAuditEvent(
    user.userId,
    "MESSAGE_SENT",
    "Message",
    message._id.toString(),
    {
      metadata: {
        conversationId: conversation._id.toString(),
      },
    },
  );

  return message.populate("sender", "firstName lastName email role");
};

export const getConversationMessages = async (
  conversationId: string,
  user: MessageUser,
  page = 1,
  limit = 50,
) => {
  await getAccessibleConversation(conversationId, user);

  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    MessageModel.find({
      conversation: conversationId,
    })
      .populate("sender", "firstName lastName email role")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    MessageModel.countDocuments({
      conversation: conversationId,
    }),
  ]);

  return {
    data: messages.reverse(),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const markConversationMessagesAsRead = async (
  conversationId: string,
  user: MessageUser,
) => {
  await getAccessibleConversation(conversationId, user);

  const result = await MessageModel.updateMany(
    {
      conversation: conversationId,
      sender: {
        $ne: user.userId,
      },
      readAt: null,
    },
    {
      $set: {
        readAt: new Date(),
      },
    },
  );

  return {
    modifiedCount: result.modifiedCount,
  };
};

export const getUnreadMessageCount = async (
  conversationId: string,
  user: MessageUser,
) => {
  await getAccessibleConversation(conversationId, user);

  return MessageModel.countDocuments({
    conversation: conversationId,
    sender: {
      $ne: user.userId,
    },
    readAt: null,
  });
};
