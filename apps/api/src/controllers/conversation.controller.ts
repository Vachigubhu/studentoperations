import type { RequestHandler } from "express";

import {
  createConversation,
  getUserConversations,
} from "../services/conversation.service.js";

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
