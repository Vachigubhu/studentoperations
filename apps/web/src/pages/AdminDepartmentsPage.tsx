import { useState } from "react";

import {
  useAdminDepartments,
  useCreateAdminDepartment,
  useUpdateAdminDepartment,
  useUpdateAdminDepartmentStatus,
} from "../hooks/useAdminDepartments";

type FormState = {
  name: string;
  code: string;
  description: string;
};

const emptyForm: FormState = {
  name: "",
  code: "",
  description: "",
};

export const AdminDepartmentsPage = () => {
  const {
    data: departments = [],
    isLoading,
    isError,
    error,
  } = useAdminDepartments();

  const createDepartment = useCreateAdminDepartment();

  const updateDepartment = useUpdateAdminDepartment();

  const updateStatus = useUpdateAdminDepartmentStatus();

  const [form, setForm] = useState<FormState>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || undefined,
    };

    if (editingId) {
      updateDepartment.mutate(
        {
          departmentId: editingId,
          input,
        },
        {
          onSuccess: () => {
            setEditingId(null);
            setForm(emptyForm);
          },
        },
      );

      return;
    }

    createDepartment.mutate(input, {
      onSuccess: () => {
        setForm(emptyForm);
      },
    });
  };

  const startEditing = (department: (typeof departments)[number]) => {
    setEditingId(department._id);

    setForm({
      name: department.name,
      code: department.code,
      description: department.description ?? "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleStatusToggle = (departmentId: string, currentStatus: boolean) => {
    updateStatus.mutate({
      departmentId,
      isActive: !currentStatus,
    });
  };

  const isSubmitting = createDepartment.isPending || updateDepartment.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Department Management
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Create, update, and manage StudentOps departments.
        </p>
      </div>

      {/* Create / Edit form */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingId ? "Edit Department" : "Create Department"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="department-name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Name
              </label>

              <input
                id="department-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
                minLength={2}
                maxLength={100}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                placeholder="e.g. Student Affairs"
              />
            </div>

            <div>
              <label
                htmlFor="department-code"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Code
              </label>

              <input
                id="department-code"
                value={form.code}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    code: event.target.value,
                  }))
                }
                required
                minLength={2}
                maxLength={20}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase outline-none focus:border-gray-500"
                placeholder="e.g. SA"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="department-description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="department-description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              maxLength={500}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              placeholder="Describe the department..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : editingId
                  ? "Update Department"
                  : "Create Department"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>

          {createDepartment.isError && (
            <p className="text-sm text-red-600">
              {createDepartment.error instanceof Error
                ? createDepartment.error.message
                : "Failed to create department."}
            </p>
          )}

          {updateDepartment.isError && (
            <p className="text-sm text-red-600">
              {updateDepartment.error instanceof Error
                ? updateDepartment.error.message
                : "Failed to update department."}
            </p>
          )}
        </form>
      </section>

      {/* Department table */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading && (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading departments...
          </div>
        )}

        {isError && (
          <div className="p-8 text-center text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Failed to load departments."}
          </div>
        )}

        {!isLoading && !isError && departments.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">
            No departments found.
          </div>
        )}

        {!isLoading && !isError && departments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Department
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Code
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Description
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
                {departments.map((department) => (
                  <tr key={department._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {department.name}
                    </td>

                    <td className="px-6 py-4 font-mono text-sm text-gray-700">
                      {department.code}
                    </td>

                    <td className="max-w-md px-6 py-4 text-sm text-gray-600">
                      {department.description || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          department.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {department.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(department)}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            handleStatusToggle(
                              department._id,
                              department.isActive,
                            )
                          }
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          {department.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
