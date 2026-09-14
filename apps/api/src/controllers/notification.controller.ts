import type { Request, Response, NextFunction, RequestHandler } from "express";

import { AppError } from "../utils/AppError.js";

import {
  getUserNotifications,
  markNotificationAsRead,
} from "../services/notification.service.js";

export const getUserNotificationsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const notifications = await getUserNotifications(req.user.userId);

    res.status(200).json({
      status: "success",
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsReadController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const notification = await markNotificationAsRead(
      req.params.id,
      req.user.userId,
    );

    res.status(200).json({
      status: "success",
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};
