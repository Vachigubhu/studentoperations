import { Link } from "react-router-dom";
import { useManagerRequests } from "../hooks/useManagerOperations";
import type { RequestStatus } from "../api/requests";

const statusLabels: Record<RequestStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  CORRECTION_REQUIRED: "Correction Required",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
};

const statusClasses: Record<RequestStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
  CORRECTION_REQUIRED: "bg-orange-100 text-orange-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

export function ManagerDashboardPage() {
  const requestsQuery = useManagerRequests();

  if (requestsQuery.isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading manager dashboard...</p>
      </div>
    );
  }

  if (requestsQuery.isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">
            Failed to load dashboard data.
          </p>

          <button
            type="button"
            onClick={() => requestsQuery.refetch()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const requests = requestsQuery.data?.data.requests ?? [];

  const totalRequests = requests.length;

  const pendingReview = requests.filter(
    (request) =>
      request.status === "SUBMITTED" || request.status === "UNDER_REVIEW",
  ).length;

  const correctionRequired = requests.filter(
    (request) => request.status === "CORRECTION_REQUIRED",
  ).length;

  const approved = requests.filter(
    (request) => request.status === "APPROVED",
  ).length;

  const completed = requests.filter(
    (request) => request.status === "COMPLETED",
  ).length;

  const urgentRequests = requests.filter(
    (request) => request.priority === "URGENT",
  ).length;

  const highPriorityRequests = requests.filter(
    (request) => request.priority === "HIGH",
  ).length;

  const recentRequests = [...requests]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-gray-500">Manager</p>

          <h1 className="text-2xl font-bold text-gray-900">
            Department Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of requests within your department.
          </p>
        </div>

        <Link
          to="/manager/requests"
          className="w-fit rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          View All Requests
        </Link>
      </div>

      {/* Primary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Requests</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalRequests}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pending Review</p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingReview}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Submitted or under review
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>

          <p className="mt-2 text-3xl font-bold text-green-600">{approved}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {completed}
          </p>
        </div>
      </div>

      {/* Attention Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Urgent</p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {urgentRequests}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Requires immediate attention
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">High Priority</p>

          <p className="mt-2 text-2xl font-bold text-orange-600">
            {highPriorityRequests}
          </p>

          <p className="mt-1 text-xs text-gray-500">High-priority requests</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Correction Required</p>

          <p className="mt-2 text-2xl font-bold text-orange-600">
            {correctionRequired}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Waiting for student correction
          </p>
        </div>
      </div>

      {/* Status Breakdown */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Request Status</h2>

        <div className="mt-4 space-y-3">
          {(Object.keys(statusLabels) as RequestStatus[]).map((status) => {
            const count = requests.filter(
              (request) => request.status === status,
            ).length;

            return (
              <div
                key={status}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[status]}`}
                >
                  {statusLabels[status]}
                </span>

                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Requests */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recently Updated
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              The five most recently updated departmental requests.
            </p>
          </div>

          <Link
            to="/manager/requests"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <p className="mt-6 text-sm text-gray-500">No requests available.</p>
        ) : (
          <div className="mt-5 divide-y divide-gray-200">
            {recentRequests.map((request) => (
              <Link
                key={request._id}
                to={`/manager/requests/${request._id}`}
                className="flex flex-col gap-3 py-4 hover:bg-gray-50 md:flex-row md:items-center md:justify-between md:px-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{request.title}</p>

                  <p className="mt-1 text-xs text-gray-500">
                    Updated {new Date(request.updatedAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusClasses[request.status]}`}
                >
                  {statusLabels[request.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
