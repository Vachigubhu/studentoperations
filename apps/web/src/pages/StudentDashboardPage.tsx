import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRequests } from "../hooks/useRequests";

export const StudentDashboardPage = () => {
  const { user } = useAuth();

  const { data, isLoading, isError } = useRequests();

  const requests = data?.data ?? [];

  const total = requests.length;

  const pending = requests.filter(
    (request) =>
      request.status === "SUBMITTED" || request.status === "UNDER_REVIEW",
  ).length;

  const approved = requests.filter(
    (request) => request.status === "APPROVED",
  ).length;

  const completed = requests.filter(
    (request) => request.status === "COMPLETED",
  ).length;

  const correctionRequired = requests.filter(
    (request) => request.status === "CORRECTION_REQUIRED",
  ).length;

  const rejected = requests.filter(
    (request) => request.status === "REJECTED",
  ).length;

  const recentRequests = [...requests]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const getRequestTypeName = (request: (typeof requests)[number]) => {
    if (typeof request.requestType === "string") {
      return request.requestType;
    }

    return request.requestType.name;
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>

        <p className="mt-2 text-red-600">Unable to load your dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <p className="text-sm font-medium text-gray-500">StudentOps</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Student Dashboard
        </h1>

        <p className="mt-2 text-gray-600">Welcome back, {user?.firstName}.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Requests" value={total} />
        <StatCard label="Pending" value={pending} />
        <StatCard label="Approved" value={approved} />
        <StatCard label="Completed" value={completed} />
        <StatCard label="Correction Required" value={correctionRequired} />
        <StatCard label="Rejected" value={rejected} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest request activity.
              </p>
            </div>

            <Link
              to="/requests"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              View all
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500">
                You haven't created any requests yet.
              </p>

              <Link
                to="/requests/new"
                className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Create your first request
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentRequests.map((request) => (
                <Link
                  key={request._id}
                  to={`/requests/${request._id}`}
                  className="block px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {request.title}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {getRequestTypeName(request)}
                      </p>
                    </div>

                    <StatusBadge status={request.status} />
                  </div>

                  <div className="mt-2 text-xs text-gray-400">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
          </div>

          <div className="space-y-3 p-6">
            <QuickAction
              to="/requests/new"
              title="New Request"
              description="Submit a new service request."
            />

            <QuickAction
              to="/requests"
              title="My Requests"
              description="View and track your requests."
            />

            <QuickAction
              to="/notifications"
              title="Notifications"
              description="Check your latest notifications."
            />

            <QuickAction
              to="/messages"
              title="Messages"
              description="Communicate with staff."
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>

      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
      {status.replaceAll("_", " ")}
    </span>
  );
};

const QuickAction = ({
  to,
  title,
  description,
}: {
  to: string;
  title: string;
  description: string;
}) => {
  return (
    <Link
      to={to}
      className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
    >
      <p className="font-medium text-gray-900">{title}</p>

      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
};
