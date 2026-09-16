import { Link } from "react-router-dom";

import { useRequests } from "../hooks/useRequests";
import type {
  RequestPriority,
  RequestStatus,
  StudentRequest,
} from "../api/requests";

const statusStyles: Record<RequestStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
  CORRECTION_REQUIRED: "bg-orange-100 text-orange-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

const priorityStyles: Record<RequestPriority, string> = {
  LOW: "text-gray-600",
  NORMAL: "text-blue-600",
  HIGH: "text-orange-600",
  URGENT: "text-red-600",
};

const getRequestTypeName = (request: StudentRequest) => {
  if (typeof request.requestType === "string") {
    return request.requestType;
  }

  return request.requestType.name;
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const RequestsPage = () => {
  const { data, isLoading, isError, refetch } = useRequests();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-gray-600">Loading your requests...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-800">
            Unable to load requests
          </h1>

          <p className="mt-2 text-sm text-red-700">
            Something went wrong while loading your requests.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const requests = data?.data.requests ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">StudentOps</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            My Requests
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage your student service requests.
          </p>
        </div>

        <Link
          to="/requests/new"
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No requests yet
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Create your first student service request.
          </p>

          <Link
            to="/requests/new"
            className="mt-5 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
          >
            Create Request
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Request
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Department
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
                  <tr key={request._id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        to={`/requests/${request._id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {request.title}
                      </Link>

                      <p className="mt-1 text-sm text-gray-500">
                        {getRequestTypeName(request)}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {typeof request.department === "string"
                        ? request.department
                        : request.department.name}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                      >
                        {request.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td
                      className={`px-6 py-4 text-sm font-semibold ${priorityStyles[request.priority]}`}
                    >
                      {request.priority}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(request.createdAt)}
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
