import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuditLogs } from "../hooks/useAuditLogs";
import { type AuditLogFilters } from "../api/audit-logs";

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

const getActorName = (
  actor:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      },
) => {
  if (typeof actor === "string") {
    return actor;
  }

  return `${actor.firstName} ${actor.lastName}`;
};

const getActorEmail = (
  actor:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      },
) => {
  if (typeof actor === "string") {
    return "Unknown";
  }

  return actor.email;
};

const getActorRole = (
  actor:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      },
) => {
  if (typeof actor === "string") {
    return "Unknown";
  }

  return actor.role;
};

export const AdminAuditLogsPage = () => {
  const [actor, setActor] = useState("");
  const [action, setAction] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [page, setPage] = useState(1);

  const filters = useMemo<AuditLogFilters>(() => {
    return {
      actor: actor.trim() || undefined,
      action: action.trim() || undefined,
      resourceType: resourceType.trim() || undefined,
      resourceId: resourceId.trim() || undefined,
      page,
      limit: 50,
    };
  }, [actor, action, resourceType, resourceId, page]);

  const { data, isLoading, isError, error } = useAuditLogs(filters);

  const logs = data?.data ?? [];
  const pagination = data?.pagination;

  const clearFilters = () => {
    setActor("");
    setAction("");
    setResourceType("");
    setResourceId("");
    setPage(1);
  };

  const applyFilters = () => {
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <Link
        to="/admin/dashboard"
        className="text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        ← Back to Admin Dashboard
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>

        <p className="mt-1 text-sm text-gray-600">
          Review administrative activity across StudentOps.
        </p>
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="actor"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Actor ID
            </label>

            <input
              id="actor"
              value={actor}
              onChange={(event) => setActor(event.target.value)}
              placeholder="User ID"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="action"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Action
            </label>

            <input
              id="action"
              value={action}
              onChange={(event) => setAction(event.target.value)}
              placeholder="e.g. USER_LOGIN"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="resourceType"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Resource Type
            </label>

            <input
              id="resourceType"
              value={resourceType}
              onChange={(event) => setResourceType(event.target.value)}
              placeholder="e.g. Request"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="resourceId"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Resource ID
            </label>

            <input
              id="resourceId"
              value={resourceId}
              onChange={(event) => setResourceId(event.target.value)}
              placeholder="Resource ID"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={applyFilters}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Apply Filters
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading && (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading audit logs...
          </div>
        )}

        {isError && (
          <div className="p-8 text-center text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Failed to load audit logs."}
          </div>
        )}

        {!isLoading && !isError && logs.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">
            No audit logs found.
          </div>
        )}

        {!isLoading && !isError && logs.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actor
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Resource
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Resource ID
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {getActorName(log.actor)}
                        </div>

                        <div className="text-xs text-gray-500">
                          {getActorEmail(log.actor)}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          {getActorRole(log.actor)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {log.action}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {log.resourceType}
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        {log.resourceId}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages} ·{" "}
                  {pagination.total} total
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={pagination.page <= 1}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() =>
                      setPage((current) =>
                        Math.min(pagination.totalPages, current + 1),
                      )
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
