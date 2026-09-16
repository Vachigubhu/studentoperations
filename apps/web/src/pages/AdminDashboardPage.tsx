import { Link } from "react-router-dom";

import { useAdminUsers } from "../hooks/useAdminUsers";
import { useAdminDepartments } from "../hooks/useAdminDepartments";
import { useAdminRequestTypes } from "../hooks/useAdminRequestTypes";
import { useAuditLogs } from "../hooks/useAuditLogs";

export const AdminDashboardPage = () => {
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useAdminUsers({
    page: 1,
    limit: 100,
  });

  const {
    data: departments,
    isLoading: departmentsLoading,
    isError: departmentsError,
  } = useAdminDepartments();

  const {
    data: requestTypes,
    isLoading: requestTypesLoading,
    isError: requestTypesError,
  } = useAdminRequestTypes();

  const {
    data: auditData,
    isLoading: auditLoading,
    isError: auditError,
  } = useAuditLogs({
    page: 1,
    limit: 5,
  });

  const isLoading =
    usersLoading || departmentsLoading || requestTypesLoading || auditLoading;

  const hasError =
    usersError || departmentsError || requestTypesError || auditError;

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
          Loading administration overview...
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Failed to load one or more dashboard resources. Please refresh and try
          again.
        </div>
      </section>
    );
  }

  const users = usersData?.data ?? [];
  const activeUsers = users.filter((user) => user.isActive);

  const activeDepartments =
    departments?.filter((department) => department.isActive) ?? [];

  const inactiveDepartments =
    departments?.filter((department) => !department.isActive) ?? [];

  const activeRequestTypes =
    requestTypes?.filter((requestType) => requestType.isActive) ?? [];

  const inactiveRequestTypes =
    requestTypes?.filter((requestType) => !requestType.isActive) ?? [];

  const roleCounts = {
    STUDENT: users.filter((user) => user.role === "STUDENT").length,

    STAFF: users.filter((user) => user.role === "STAFF").length,

    MANAGER: users.filter((user) => user.role === "MANAGER").length,

    ADMIN: users.filter((user) => user.role === "ADMIN").length,

    SUPER_ADMIN: users.filter((user) => user.role === "SUPER_ADMIN").length,
  };

  const statCards = [
    {
      label: "Total Users",
      value: usersData?.pagination.total ?? users.length,
      description: `${activeUsers.length} active users`,
      href: "/admin/users",
    },
    {
      label: "Departments",
      value: departments?.length ?? 0,
      description: `${activeDepartments.length} active`,
      href: "/admin/departments",
    },
    {
      label: "Request Types",
      value: requestTypes?.length ?? 0,
      description: `${activeRequestTypes.length} active`,
      href: "/admin/request-types",
    },
    {
      label: "Audit Events",
      value: auditData?.pagination.total ?? 0,
      description: "Recorded platform events",
      href: "/admin/audit-logs",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        <p className="mt-2 text-gray-600">
          Monitor and manage the StudentOps platform.
        </p>
      </div>

      {/* Overview */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">{card.label}</p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {card.value}
            </p>

            <p className="mt-2 text-sm text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>

      {/* Platform configuration */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Platform Configuration
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current configuration of core StudentOps resources.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-sm text-gray-600">Active Departments</span>

              <span className="font-semibold text-gray-900">
                {activeDepartments.length}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-sm text-gray-600">
                Inactive Departments
              </span>

              <span className="font-semibold text-gray-900">
                {inactiveDepartments.length}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-sm text-gray-600">
                Active Request Types
              </span>

              <span className="font-semibold text-gray-900">
                {activeRequestTypes.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Inactive Request Types
              </span>

              <span className="font-semibold text-gray-900">
                {inactiveRequestTypes.length}
              </span>
            </div>
          </div>
        </div>

        {/* User distribution */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            User Distribution
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Users grouped by platform role.
          </p>

          <div className="mt-6 space-y-4">
            {Object.entries(roleCounts).map(([role, count]) => (
              <div
                key={role}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <span className="text-sm text-gray-600">{role}</span>

                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent audit activity */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Recent Audit Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest recorded administrative and platform events.
            </p>
          </div>

          <Link
            to="/admin/audit-logs"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            View all
          </Link>
        </div>

        {!auditData?.data.length ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No audit activity found.
          </div>
        ) : (
          <div className="divide-y">
            {auditData.data.map((log) => {
              const actor =
                typeof log.actor === "string"
                  ? log.actor
                  : `${log.actor.firstName} ${log.actor.lastName}`;

              return (
                <div
                  key={log._id}
                  className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{log.action}</p>

                    <p className="mt-1 text-sm text-gray-500">
                      {actor} · {log.resourceType}
                    </p>
                  </div>

                  <time
                    dateTime={log.createdAt}
                    className="text-sm text-gray-400"
                  >
                    {new Date(log.createdAt).toLocaleString()}
                  </time>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Administration</h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/users"
            className="rounded-lg border px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Manage Users
          </Link>

          <Link
            to="/admin/departments"
            className="rounded-lg border px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Manage Departments
          </Link>

          <Link
            to="/admin/request-types"
            className="rounded-lg border px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Manage Request Types
          </Link>

          <Link
            to="/admin/audit-logs"
            className="rounded-lg border px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Review Audit Logs
          </Link>
        </div>
      </div>
    </section>
  );
};
