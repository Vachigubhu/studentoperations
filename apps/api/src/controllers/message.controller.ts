import type { RequestHandler } from "express";

import {
  sendMessage,
  getConversationMessages,
  markConversationMessagesAsRead,
  getUnreadMessageCount,
} from "../services/message.service.js";
import { messageQuerySchema } from "../validators/message.validator.js";

export const sendMessageController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    const message = await sendMessage(req.params.id, req.user!, req.body.body);

    res.status(201).json({
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const listMessagesController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    const query = messageQuerySchema.parse(req.query);

    const result = await getConversationMessages(
      req.params.id,
      req.user!,
      query.page,
      query.limit,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const markMessagesAsReadController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    const result = await markConversationMessagesAsRead(
      req.params.id,
      req.user!,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const unreadMessageCountController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    const count = await getUnreadMessageCount(req.params.id, req.user!);

    res.status(200).json({
      data: {
        unreadCount: count,
      },
    });
  } catch (error) {
    next(error);
  }
};
