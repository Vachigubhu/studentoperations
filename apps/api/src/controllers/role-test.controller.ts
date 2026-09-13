import type { RequestHandler } from "express";

export const staffTestController: RequestHandler = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "You can access staff resources.",
    user: req.user,
  });
};

export const managerTestController: RequestHandler = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "You can access manager resources.",
    user: req.user,
  });
};

export const adminTestController: RequestHandler = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "You can access admin resources.",
    user: req.user,
  });
};
