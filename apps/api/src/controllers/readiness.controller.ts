import type { Request, Response } from "express";
import { getReadinessStatus } from "../services/readiness.service.js";

export const getReadiness = (_req: Request, res: Response): void => {
  const result = getReadinessStatus();

  res.status(result.ready ? 200 : 503).json({
    status: result.ready ? "success" : "error",
    data: result,
  });
};
