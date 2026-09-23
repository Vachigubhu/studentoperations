import { useRef, useState } from "react";

import {
  useDeleteDocument,
  useDocuments,
  useUploadDocument,
} from "../../hooks/useDocuments";

type DocumentsSectionProps = {
  requestId: string;
  canUpload: boolean;
  canDelete: boolean;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

export const DocumentsSection = ({
  requestId,
  canUpload,
  canDelete,
}: DocumentsSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState("SUPPORTING_DOCUMENT");
  const [error, setError] = useState("");

  const documentsQuery = useDocuments(requestId);
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (file.size > 5 * 1024 * 1024) {
      setError("File size cannot exceed 5 MB.");

      event.target.value = "";
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, JPEG, and PNG files are allowed.");

      event.target.value = "";
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        requestId,
        file,
        category,
      });

      event.target.value = "";
    } catch {
      setError("The document could not be uploaded.");
    }
  };

  const handleDelete = async (documentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteMutation.mutateAsync({
        documentId,
        requestId,
      });
    } catch {
      setError("The document could not be deleted.");
    }
  };

  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Documents</h2>

          <p className="mt-1 text-sm text-gray-500">
            Supporting documents attached to this request.
          </p>
        </div>

        {canUpload && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="SUPPORTING_DOCUMENT">Supporting Document</option>

              <option value="IDENTITY">Identity Document</option>

              <option value="VISA">Visa Document</option>
            </select>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {documentsQuery.isLoading && (
        <p className="mt-6 text-sm text-gray-500">Loading documents...</p>
      )}

      {documentsQuery.isError && (
        <p className="mt-6 text-sm text-red-600">Failed to load documents.</p>
      )}

      {!documentsQuery.isLoading &&
        !documentsQuery.isError &&
        documentsQuery.data?.length === 0 && (
          <div className="mt-6 rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="font-medium text-gray-700">No documents uploaded</p>

            <p className="mt-1 text-sm text-gray-500">
              Upload PDF, JPEG, or PNG supporting documents.
            </p>
          </div>
        )}

      <div className="mt-6 space-y-3">
        {documentsQuery.data?.map((document) => (
          <div
            key={document._id}
            className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-900">
                {document.originalName}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {document.mimeType} · {formatFileSize(document.size)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Uploaded {formatDate(document.createdAt)}
              </p>
            </div>

            {canDelete && (
              <button
                type="button"
                onClick={() => handleDelete(document._id)}
                disabled={deleteMutation.isPending}
                className="self-start rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 sm:self-auto"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
