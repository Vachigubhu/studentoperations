import type { RequestHandler } from "express";

import { getAuditLogs } from "../services/audit-query.service.js";
import { auditQuerySchema } from "../validators/audit.validator.js";

export const listAuditLogs: RequestHandler = async (req, res, next) => {
  try {
    const query = auditQuerySchema.parse(req.query);

    const result = await getAuditLogs(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
