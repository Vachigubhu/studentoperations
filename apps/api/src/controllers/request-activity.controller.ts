import type { RequestHandler } from "express";

import { getRequestActivity } from "../services/request-activity.service.js";

export const getRequestActivityController: RequestHandler<{
  id: string;
}> = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
  }

  const activities = await getRequestActivity(req.params.id, req.user);

  return res.status(200).json({
    status: "success",
    data: {
      activities,
    },
  });
};
