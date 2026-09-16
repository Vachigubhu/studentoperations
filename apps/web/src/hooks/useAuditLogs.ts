import { useQuery } from "@tanstack/react-query";

import { getAuditLogs, type AuditLogFilters } from "../api/audit-logs";

export const auditLogKeys = {
  all: ["audit-logs"] as const,

  list: (filters: AuditLogFilters = {}) =>
    [...auditLogKeys.all, filters] as const,
};

export const useAuditLogs = (filters: AuditLogFilters = {}) => {
  return useQuery({
    queryKey: auditLogKeys.list(filters),
    queryFn: () => getAuditLogs(filters),
  });
};
