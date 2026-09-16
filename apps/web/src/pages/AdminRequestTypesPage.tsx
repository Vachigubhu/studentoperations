import { useEffect, useState } from "react";
import {
  useAdminRequestTypes,
  useCreateAdminRequestType,
  useUpdateAdminRequestType,
  useUpdateAdminRequestTypeStatus,
} from "../hooks/useAdminRequestTypes";
import { useAdminDepartments } from "../hooks/useAdminDepartments";
import type { CreateRequestTypeInput } from "../api/admin-request-types";

type FormState = {
  name: string;
  code: string;
  description: string;
  departmentId: string;
};

const emptyForm: FormState = {
  name: "",
  code: "",
  description: "",
  departmentId: "",
};

export const AdminRequestTypesPage = () => {
  const { data: requestTypes, isLoading, isError } = useAdminRequestTypes();

  const { data: departments, isLoading: departmentsLoading } =
    useAdminDepartments();

  const createMutation = useCreateAdminRequestType();

  const updateMutation = useUpdateAdminRequestType();

  const statusMutation = useUpdateAdminRequestTypeStatus();

  const [form, setForm] = useState<FormState>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (
      !editingId &&
      !form.departmentId &&
      departments &&
      departments.length > 0
    ) {
      const activeDepartment = departments.find(
        (department) => department.isActive,
      );

      if (activeDepartment) {
        setForm((current) => ({
          ...current,
          departmentId: activeDepartment._id,
        }));
      }
    }
  }, [departments, editingId, form.departmentId]);

  const handleChange = (field: keyof FormState, value: string) => {
    setSubmitError(null);

    setForm((current) => ({
      ...current,
      [field]: field === "code" ? value.toUpperCase() : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      departmentId:
        departments?.find((department) => department.isActive)?._id ?? "",
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSubmitError(null);

    if (!form.name.trim() || !form.code.trim() || !form.departmentId) {
      setSubmitError("Name, code, and department are required.");
      return;
    }

    const input: CreateRequestTypeInput = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || undefined,
      departmentId: form.departmentId,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          requestTypeId: editingId,
          input,
        });
      } else {
        await createMutation.mutateAsync(input);
      }

      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Failed to save request type.");
      }
    }
  };

  const handleEdit = (
    requestType: NonNullable<typeof requestTypes>[number],
  ) => {
    setEditingId(requestType._id);

    setForm({
      name: requestType.name,
      code: requestType.code,
      description: requestType.description ?? "",
      departmentId:
        typeof requestType.department === "string"
          ? requestType.department
          : requestType.department._id,
    });
  };

  const handleToggleStatus = async (
    requestType: NonNullable<typeof requestTypes>[number],
  ) => {
    await statusMutation.mutateAsync({
      requestTypeId: requestType._id,
      isActive: !requestType.isActive,
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Request Types</h1>

        <div className="rounded-xl border bg-white p-6">
          Loading request types...
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Request Types</h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Failed to load request types.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Request Types</h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure the services students can request and assign them to
          departments.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Request Type" : "Create Request Type"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {submitError}
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="e.g. Visa Extension"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Code
              </label>

              <input
                value={form.code}
                onChange={(event) => handleChange("code", event.target.value)}
                placeholder="VISA_EXTENSION"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 uppercase outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Department
              </label>

              <select
                value={form.departmentId}
                onChange={(event) =>
                  handleChange("departmentId", event.target.value)
                }
                disabled={departmentsLoading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-gray-500"
              >
                <option value="">Select department</option>

                {departments
                  ?.filter((department) => department.isActive)
                  .map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name} ({department.code})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                rows={4}
                placeholder="Describe this service..."
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Create Request Type"}
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Configured Request Types
            </h2>
          </div>

          {!requestTypes || requestTypes.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No request types found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Service
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Department
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {requestTypes.map((requestType) => {
                    const department =
                      typeof requestType.department === "string"
                        ? requestType.department
                        : `${requestType.department.name} (${requestType.department.code})`;

                    return (
                      <tr key={requestType._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {requestType.name}
                          </div>

                          <div className="mt-1 text-xs font-mono text-gray-500">
                            {requestType.code}
                          </div>

                          {requestType.description && (
                            <div className="mt-1 max-w-md text-sm text-gray-500">
                              {requestType.description}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {department}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              requestType.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {requestType.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(requestType)}
                              className="rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleToggleStatus(requestType)
                              }
                              disabled={statusMutation.isPending}
                              className="rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                              {requestType.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
