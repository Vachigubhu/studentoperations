import { api } from "./client";

export type AuditActor = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export type AuditLog = {
  _id: string;
  actor: string | AuditActor;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuditLogFilters = {
  actor?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  page?: number;
  limit?: number;
};

export type AuditLogsResponse = {
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getAuditLogs = async (filters: AuditLogFilters = {}) => {
  const response = await api.get<AuditLogsResponse>("/audit-logs", {
    params: filters,
  });

  return response.data;
};
