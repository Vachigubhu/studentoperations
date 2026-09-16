import { Link, useParams } from "react-router-dom";

import { useRequest, useSubmitRequest } from "../hooks/useRequests";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
  CORRECTION_REQUIRED: "bg-orange-100 text-orange-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

const getName = (
  value:
    | string
    | {
        name: string;
      },
) => {
  if (typeof value === "string") {
    return value;
  }

  return value.name;
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const RequestDetailPage = () => {
  const { id } = useParams();

  const { data: request, isLoading, isError, refetch } = useRequest(id ?? "");

  const submitMutation = useSubmitRequest();

  if (!id) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-red-600">Invalid request ID.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-gray-600">Loading request...</p>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-800">
            Unable to load request
          </h1>

          <p className="mt-2 text-sm text-red-700">
            The request could not be loaded.
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

  const canSubmit =
    request.status === "DRAFT" || request.status === "CORRECTION_REQUIRED";

  const handleSubmit = async () => {
    await submitMutation.mutateAsync(request._id);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        to="/requests"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to My Requests
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            StudentOps Request
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            {request.title}
          </h1>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${statusStyles[request.status]}`}
        >
          {request.status.replaceAll("_", " ")}
        </span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Request Type</p>

          <p className="mt-1 font-semibold text-gray-900">
            {getName(request.requestType)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Department</p>

          <p className="mt-1 font-semibold text-gray-900">
            {getName(request.department)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Priority</p>

          <p className="mt-1 font-semibold text-gray-900">{request.priority}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Description</h2>

        <p className="mt-3 whitespace-pre-wrap text-gray-700">
          {request.description}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Request Timeline
        </h2>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">Created</dt>

            <dd className="mt-1 text-sm font-medium text-gray-900">
              {formatDate(request.createdAt)}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Submitted</dt>

            <dd className="mt-1 text-sm font-medium text-gray-900">
              {formatDate(request.submittedAt)}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Last Updated</dt>

            <dd className="mt-1 text-sm font-medium text-gray-900">
              {formatDate(request.updatedAt)}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Completed</dt>

            <dd className="mt-1 text-sm font-medium text-gray-900">
              {formatDate(request.completedAt)}
            </dd>
          </div>
        </dl>
      </div>

      {canSubmit && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitMutation.isPending}
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitMutation.isPending
              ? "Submitting..."
              : request.status === "CORRECTION_REQUIRED"
                ? "Resubmit Request"
                : "Submit Request"}
          </button>
        </div>
      )}

      {submitMutation.isError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to submit the request. Please try again.
        </div>
      )}
    </div>
  );
};
