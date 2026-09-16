import { useState } from "react";
import { Link } from "react-router-dom";

import type { RequestPriority, RequestStatus } from "../api/requests";

import { useStaffRequests } from "../hooks/useStaffRequests";

const statuses: RequestStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "CORRECTION_REQUIRED",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

const priorities: RequestPriority[] = ["LOW", "NORMAL", "HIGH", "URGENT"];

const statusStyles: Record<RequestStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
  CORRECTION_REQUIRED: "bg-orange-100 text-orange-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

export const StaffRequestsPage = () => {
  const [status, setStatus] = useState<RequestStatus | "">("");

  const [priority, setPriority] = useState<RequestPriority | "">("");

  const { data, isLoading, isError, refetch } = useStaffRequests({
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
  });

  const requests = data?.data.requests ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <p className="text-sm font-medium text-gray-500">StudentOps · Staff</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Request Queue
        </h1>

        <p className="mt-2 text-gray-600">
          Review and process requests assigned to your department.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as RequestStatus | "")
            }
            className="mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>

            {statuses.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            Priority
          </label>

          <select
            id="priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as RequestPriority | "")
            }
            className="mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All priorities</option>

            {priorities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8">
          <p className="text-gray-600">Loading requests...</p>
        </div>
      )}

      {isError && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-800">
            Unable to load the request queue.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && requests.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">No requests found</h2>

          <p className="mt-2 text-sm text-gray-500">
            There are no requests matching the selected filters.
          </p>
        </div>
      )}

      {!isLoading && !isError && requests.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Request
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Priority
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        to={`/staff/requests/${request._id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {request.title}
                      </Link>

                      <p className="mt-1 text-sm text-gray-500">
                        {typeof request.requestType === "string"
                          ? request.requestType
                          : request.requestType.name}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                      >
                        {request.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold">
                      {request.priority}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
