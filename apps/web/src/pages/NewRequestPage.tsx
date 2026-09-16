import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useCreateRequest, useRequestTypes } from "../hooks/useRequests";

const createRequestSchema = z.object({
  requestTypeId: z.string().min(1, "Select a request type"),

  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description cannot exceed 5000 characters"),

  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
});

type CreateRequestFormData = z.infer<typeof createRequestSchema>;

export const NewRequestPage = () => {
  const navigate = useNavigate();

  const {
    data: requestTypesData,
    isLoading: requestTypesLoading,
    isError: requestTypesError,
  } = useRequestTypes();

  const createMutation = useCreateRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRequestFormData>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      priority: "NORMAL",
    },
  });

  const onSubmit = async (values: CreateRequestFormData) => {
    const request = await createMutation.mutateAsync(values);

    navigate(`/requests/${request.data.request._id}`);
  };

  const requestTypes = requestTypesData?.data.requestTypes ?? [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div>
        <p className="text-sm font-medium text-gray-500">StudentOps</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Create Request
        </h1>

        <p className="mt-2 text-gray-600">
          Submit a service request to the appropriate university department.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="requestTypeId"
            className="block text-sm font-medium text-gray-900"
          >
            Request Type
          </label>

          <select
            id="requestTypeId"
            {...register("requestTypeId")}
            disabled={requestTypesLoading}
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900"
          >
            <option value="">
              {requestTypesLoading
                ? "Loading request types..."
                : "Select a request type"}
            </option>

            {requestTypes.map((requestType) => (
              <option key={requestType._id} value={requestType._id}>
                {requestType.name}
              </option>
            ))}
          </select>

          {errors.requestTypeId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.requestTypeId.message}
            </p>
          )}

          {requestTypesError && (
            <p className="mt-1 text-sm text-red-600">
              Unable to load request types.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-900"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            placeholder="e.g. Request for bonafide certificate"
            {...register("title")}
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900"
          />

          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-900"
          >
            Description
          </label>

          <textarea
            id="description"
            rows={6}
            placeholder="Describe your request in detail..."
            {...register("description")}
            className="mt-2 block w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-900"
          >
            Priority
          </label>

          <select
            id="priority"
            {...register("priority")}
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900"
          >
            <option value="LOW">Low</option>

            <option value="NORMAL">Normal</option>

            <option value="HIGH">High</option>

            <option value="URGENT">Urgent</option>
          </select>
        </div>

        {createMutation.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to create the request. Please check your information and try
            again.
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={() => navigate("/requests")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create Request"}
          </button>
        </div>
      </form>
    </div>
  );
};
