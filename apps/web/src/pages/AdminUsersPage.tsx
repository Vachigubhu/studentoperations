import { useEffect, useState } from "react";

import {
  useAdminUsers,
  useUpdateAdminUserRole,
  useUpdateAdminUserStatus,
} from "../hooks/useAdminUsers";

import type { UserRole } from "../types/auth";

const roles: UserRole[] = [
  "STUDENT",
  "STAFF",
  "MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
];

export const AdminUsersPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [roleError, setRoleError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const filters = {
    search: search || undefined,
    role: role || undefined,
    isActive: isActive === "" ? undefined : isActive === "true",
    page,
    limit: 50,
  };

  const { data, isLoading, isError, error } = useAdminUsers(filters);

  const updateRole = useUpdateAdminUserRole();
  const updateStatus = useUpdateAdminUserStatus();

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setRoleError("");

    updateRole.mutate(
      {
        userId,
        role: newRole,
      },
      {
        onError: (error) => {
          const message =
            (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message ?? "Unable to update the user's role.";

          setRoleError(message);

          window.setTimeout(() => {
            setRoleError("");
          }, 4000);
        },
      },
    );
  };

  const handleStatusToggle = (userId: string, currentStatus: boolean) => {
    updateStatus.mutate({
      userId,
      isActive: !currentStatus,
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setRole("");
    setIsActive("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {roleError && (
        <div className="fixed right-6 top-6 z-50 w-full max-w-md rounded-xl border border-red-300 bg-red-50 px-5 py-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              !
            </div>

            <div>
              <div className="font-semibold text-red-800">
                Unable to change role
              </div>

              <div className="mt-1 text-sm leading-5 text-red-700">
                {roleError}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>

        <p className="mt-1 text-sm text-gray-600">
          Manage StudentOps users, roles, and account status.
        </p>
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="search"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Search
            </label>

            <input
              id="search"
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name or email..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Role
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) => {
                setRole(event.target.value as UserRole | "");
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="">All roles</option>

              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              value={isActive}
              onChange={(event) => {
                setIsActive(event.target.value as "" | "true" | "false");
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading && (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading users...
          </div>
        )}

        {isError && (
          <div className="p-8 text-center text-sm text-red-600">
            {error instanceof Error ? error.message : "Failed to load users."}
          </div>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">
            No users found.
          </div>
        )}

        {!isLoading && !isError && users.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Department
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>

                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          disabled={updateRole.isPending}
                          onChange={(event) =>
                            handleRoleChange(
                              user._id,
                              event.target.value as UserRole,
                            )
                          }
                          className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                        >
                          {roles.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {typeof user.department === "string"
                          ? user.department
                          : (user.department?.code ?? "Unassigned")}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            handleStatusToggle(user._id, user.isActive)
                          }
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
