import type { RequestHandler } from "express";
import {
  createConversation,
  getUserConversations,
  getTotalUnreadMessageCount,
} from "../services/conversation.service.js";
import { AppError } from "../utils/AppError.js";

export const createConversationController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const conversation = await createConversation({
      creator: req.user!,
      participantId: req.body.participantId,
      subject: req.body.subject,
      requestId: req.body.requestId,
    });

    res.status(201).json({
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const listConversationsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const conversations = await getUserConversations(req.user!.userId);

    res.status(200).json({
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const getTotalUnreadMessageCountController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const count = await getTotalUnreadMessageCount(req.user.userId);

    res.status(200).json({
      status: "success",
      data: {
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};
