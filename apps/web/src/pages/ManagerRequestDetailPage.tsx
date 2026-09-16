import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  useCreateManagerApproval,
  useManagerApprovals,
  useManagerRequest,
  useAssignManagerRequest,
  useUpdateManagerRequestStatus,
} from "../hooks/useManagerOperations";

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

const priorityClasses: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-700",
  NORMAL: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

export function ManagerRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const requestQuery = useManagerRequest(id ?? "");

  const assignMutation = useAssignManagerRequest(id ?? "");

  const statusMutation = useUpdateManagerRequestStatus(id ?? "");

  const approvalsQuery = useManagerApprovals(id ?? "");

  const approvalMutation = useCreateManagerApproval(id ?? "");

  if (!id) {
    return (
      <div className="p-6">
        <p className="text-red-600">Request ID is missing.</p>
      </div>
    );
  }

  if (requestQuery.isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading request...</p>
      </div>
    );
  }

  if (requestQuery.isError || !requestQuery.data) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">Failed to load request.</p>

          <button
            type="button"
            onClick={() => requestQuery.refetch()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const request = requestQuery.data;

  const requestType =
    typeof request.requestType === "object" ? request.requestType : null;

  const department =
    typeof request.department === "object" ? request.department : null;

  const assignedStaff =
    request.assignedTo && typeof request.assignedTo === "object"
      ? request.assignedTo
      : null;

  const isTerminal =
    request.status === "REJECTED" || request.status === "COMPLETED";

  const canStartReview = request.status === "SUBMITTED";

  const canApprove = request.status === "UNDER_REVIEW";

  const canComplete = request.status === "APPROVED";

  /*
   * The Assign to Me button disappears when:
   *
   * - the request is terminal
   * - OR it is already assigned to the current manager
   *
   * If it is assigned to another staff member, the manager
   * can still reassign it.
   */
  const isAssignedToMe =
    Boolean(user?.id) &&
    Boolean(
      request.assignedTo &&
      (typeof request.assignedTo === "string"
        ? request.assignedTo === user?.id
        : request.assignedTo._id === user?.id),
    );

  const handleAssignToMe = async () => {
    if (!user?.id) {
      return;
    }

    await assignMutation.mutateAsync(user.id);
  };

  const handleStatusChange = async (status: RequestStatus) => {
    await statusMutation.mutateAsync(status);
  };

  const handleApproval = async (
    decision: "APPROVED" | "REJECTED" | "CORRECTION_REQUIRED",
  ) => {
    await approvalMutation.mutateAsync({
      decision,
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Back to Requests */}
      <Link
        to="/manager/requests"
        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to all requests
      </Link>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-gray-500">Manager / Requests / Detail</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {request.title}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Request ID: {request._id}
          </p>
        </div>

        <div className="flex gap-2">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              statusClasses[request.status]
            }`}
          >
            {statusLabels[request.status]}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              priorityClasses[request.priority] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {request.priority}
          </span>
        </div>
      </div>

      {/* Request Information */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Request Information
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Request Type</p>

            <p className="mt-1 font-medium text-gray-900">
              {requestType?.name ?? "Request Type"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Department</p>

            <p className="mt-1 font-medium text-gray-900">
              {department?.name ?? "Department information unavailable"}
            </p>

            {department?.code && (
              <p className="text-xs text-gray-500">{department.code}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Created</p>

            <p className="mt-1 font-medium text-gray-900">
              {new Date(request.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Last Updated</p>

            <p className="mt-1 font-medium text-gray-900">
              {new Date(request.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">Description</p>

          <div className="mt-2 rounded-lg bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-gray-800">
              {request.description}
            </p>
          </div>
        </div>
      </section>

      {/* Assignment */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Assignment</h2>

            <p className="mt-1 text-sm text-gray-500">
              {assignedStaff
                ? `Assigned to: ${assignedStaff.firstName} ${assignedStaff.lastName}`
                : request.assignedTo
                  ? `Assigned to: ${request.assignedTo}`
                  : "This request is currently unassigned."}
            </p>

            {assignedStaff?.email && (
              <p className="mt-1 text-xs text-gray-500">
                {assignedStaff.email}
              </p>
            )}
          </div>

          {!isTerminal && !isAssignedToMe && (
            <button
              type="button"
              onClick={handleAssignToMe}
              disabled={assignMutation.isPending}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {assignMutation.isPending ? "Assigning..." : "Assign to Me"}
            </button>
          )}
        </div>

        {isAssignedToMe && !isTerminal && (
          <p className="mt-3 text-sm font-medium text-green-600">
            This request is assigned to you.
          </p>
        )}

        {assignMutation.isError && (
          <p className="mt-3 text-sm text-red-600">Failed to assign request.</p>
        )}
      </section>

      {/* Status Actions */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Status Actions</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          {canStartReview && (
            <button
              type="button"
              onClick={() => handleStatusChange("UNDER_REVIEW")}
              disabled={statusMutation.isPending}
              className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {statusMutation.isPending ? "Updating..." : "Start Review"}
            </button>
          )}

          {/* Manager completes APPROVED requests */}
          {canComplete && (
            <button
              type="button"
              onClick={() => handleStatusChange("COMPLETED")}
              disabled={statusMutation.isPending}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {statusMutation.isPending ? "Completing..." : "Mark Completed"}
            </button>
          )}

          {isTerminal && (
            <p className="text-sm text-gray-500">
              No further status actions are available.
            </p>
          )}
        </div>

        {statusMutation.isError && (
          <p className="mt-3 text-sm text-red-600">
            Failed to update request status.
          </p>
        )}
      </section>

      {/* Approval Actions */}
      {canApprove && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Approval Decision
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Review this request and record a decision.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleApproval("APPROVED")}
              disabled={approvalMutation.isPending}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {approvalMutation.isPending ? "Processing..." : "Approve"}
            </button>

            <button
              type="button"
              onClick={() => handleApproval("CORRECTION_REQUIRED")}
              disabled={approvalMutation.isPending}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Request Correction
            </button>

            <button
              type="button"
              onClick={() => handleApproval("REJECTED")}
              disabled={approvalMutation.isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject
            </button>
          </div>

          {approvalMutation.isError && (
            <p className="mt-3 text-sm text-red-600">
              Failed to record approval decision.
            </p>
          )}
        </section>
      )}

      {/* Approval History */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Approval History
        </h2>

        {approvalsQuery.isLoading && (
          <p className="mt-4 text-sm text-gray-500">
            Loading approval history...
          </p>
        )}

        {approvalsQuery.isError && (
          <p className="mt-4 text-sm text-red-600">
            Failed to load approval history.
          </p>
        )}

        {!approvalsQuery.isLoading &&
          !approvalsQuery.isError &&
          approvalsQuery.data?.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              No approval decisions have been recorded.
            </p>
          )}

        <div className="mt-4 space-y-4">
          {approvalsQuery.data?.map((approval) => {
            const approver =
              typeof approval.approver === "object" ? approval.approver : null;

            return (
              <div
                key={approval._id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {approver
                        ? `${approver.firstName} ${approver.lastName}`
                        : "Manager"}
                    </p>

                    {approver?.email && (
                      <p className="text-xs text-gray-500">{approver.email}</p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      approval.decision === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : approval.decision === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {approval.decision}
                  </span>
                </div>

                {approval.comment && (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">
                    {approval.comment}
                  </p>
                )}

                <p className="mt-3 text-xs text-gray-500">
                  {new Date(approval.createdAt).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
