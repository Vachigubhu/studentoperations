import { useState } from "react";
import { Link } from "react-router-dom";

import type { RequestPriority, RequestStatus } from "../api/requests";
import { useRequests } from "../hooks/useRequests";

const statuses: RequestStatus[] = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "CORRECTION_REQUIRED",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

const priorities: RequestPriority[] = ["LOW", "NORMAL", "HIGH", "URGENT"];

const formatStatus = (status: RequestStatus) => status.replaceAll("_", " ");

export const RequestsPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RequestStatus | "">("");
  const [priority, setPriority] = useState<RequestPriority | "">("");
  const [page, setPage] = useState(1);

  const filters = {
    search: search.trim() || undefined,
    status: status || undefined,
    priority: priority || undefined,
    page,
    limit: 10,
  };

  const requestsQuery = useRequests(filters);

  const requests = requestsQuery.data?.data ?? [];
  const pagination = requestsQuery.data?.pagination;

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-gray-500">StudentOps</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            My Requests
          </h1>

          <p className="mt-2 text-gray-600">
            Track and manage your submitted requests.
          </p>
        </div>

        <Link
          to="/requests/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          New Request
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search requests..."
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as RequestStatus | "");
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="">All statuses</option>

            {statuses.map((item) => (
              <option key={item} value={item}>
                {formatStatus(item)}
              </option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(event) => {
              setPriority(event.target.value as RequestPriority | "");
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="">All priorities</option>

            {priorities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {requestsQuery.isLoading && (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading requests...
          </div>
        )}

        {requestsQuery.isError && (
          <div className="p-8 text-center text-sm text-red-600">
            Failed to load requests.
          </div>
        )}

        {!requestsQuery.isLoading &&
          !requestsQuery.isError &&
          requests.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-medium text-gray-900">No requests found</p>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your filters or create a new request.
              </p>
            </div>
          )}

        {requests.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Request
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Department
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Priority
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {requests.map((request) => {
                  const requestType =
                    typeof request.requestType === "string"
                      ? request.requestType
                      : request.requestType.name;

                  const department =
                    typeof request.department === "string"
                      ? request.department
                      : request.department.name;

                  return (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          to={`/requests/${request._id}`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          {request.title}
                        </Link>

                        <p className="mt-1 text-xs text-gray-500">
                          {requestType}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {department}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {formatStatus(request.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {request.priority}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
