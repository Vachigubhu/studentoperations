import { useState } from "react";
import { Link } from "react-router-dom";

import { useManagerRequests } from "../hooks/useManagerOperations";

import type { RequestPriority, RequestStatus } from "../api/requests";

const statuses: RequestStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "CORRECTION_REQUIRED",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

const priorities: RequestPriority[] = ["LOW", "NORMAL", "HIGH", "URGENT"];

const statusClasses: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
  CORRECTION_REQUIRED: "bg-orange-100 text-orange-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

export function ManagerRequestsPage() {
  const [status, setStatus] = useState<RequestStatus | "">("");
  const [priority, setPriority] = useState<RequestPriority | "">("");

  const query = useManagerRequests({
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
  });

  const requests = query.data?.data.requests ?? [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-500">Manager</p>

        <h1 className="text-2xl font-bold text-gray-900">
          Department Requests
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review and manage requests within your department.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Status Filter */}
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as RequestStatus | "")
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        >
          <option value="">All statuses</option>

          {statuses.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value as RequestPriority | "")
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        >
          <option value="">All priorities</option>

          {priorities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {query.isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">Loading department requests...</p>
        </div>
      )}

      {/* Error */}
      {query.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">
            Failed to load department requests.
          </p>

          <button
            type="button"
            onClick={() => query.refetch()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!query.isLoading && !query.isError && requests.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="font-medium text-gray-900">No requests found.</p>

          <p className="mt-1 text-sm text-gray-500">
            There are no requests matching the selected filters.
          </p>
        </div>
      )}

      {/* Requests Table */}
      {!query.isLoading && !query.isError && requests.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Request
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Student
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Priority
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Assigned To
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Created
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    {/* Request */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {request.title}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {request.requestType &&
                        typeof request.requestType !== "string"
                          ? request.requestType.name
                          : "Request"}
                      </p>
                    </td>

                    {/* Student */}
                    <td className="px-6 py-4">
                      {request.student &&
                      typeof request.student !== "string" ? (
                        <>
                          <p className="text-sm font-medium text-gray-900">
                            {request.student.firstName}{" "}
                            {request.student.lastName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {request.student.email}
                          </p>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Unknown student
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusClasses[request.status]
                        }`}
                      >
                        {request.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        {request.priority}
                      </span>
                    </td>

                    {/* Assigned Staff */}
                    <td className="px-6 py-4">
                      {request.assignedTo &&
                      typeof request.assignedTo !== "string" ? (
                        <>
                          <p className="text-sm font-medium text-gray-900">
                            {request.assignedTo.firstName}{" "}
                            {request.assignedTo.lastName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {request.assignedTo.email}
                          </p>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/manager/requests/${request._id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {requests.length}
              </span>{" "}
              {requests.length === 1 ? "request" : "requests"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
