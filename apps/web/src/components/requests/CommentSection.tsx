import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "../../hooks/useComments";

type CommentsSectionProps = {
  requestId: string;
};

export const CommentsSection = ({ requestId }: CommentsSectionProps) => {
  const { user } = useAuth();

  const commentsQuery = useComments(requestId);
  const createMutation = useCreateComment();
  const updateMutation = useUpdateComment();
  const deleteMutation = useDeleteComment();

  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    const trimmedBody = body.trim();

    if (!trimmedBody) {
      setError("Comment cannot be empty.");
      return;
    }

    if (trimmedBody.length > 2000) {
      setError("Comment cannot exceed 2000 characters.");
      return;
    }

    setError("");

    try {
      await createMutation.mutateAsync({
        requestId,
        body: trimmedBody,
      });

      setBody("");
    } catch {
      setError("The comment could not be added.");
    }
  };

  const handleUpdate = async (commentId: string) => {
    const trimmedBody = editingBody.trim();

    if (!trimmedBody) {
      setError("Comment cannot be empty.");
      return;
    }

    if (trimmedBody.length > 2000) {
      setError("Comment cannot exceed 2000 characters.");
      return;
    }

    setError("");

    try {
      await updateMutation.mutateAsync({
        commentId,
        body: trimmedBody,
      });

      setEditingId(null);
      setEditingBody("");
    } catch {
      setError("The comment could not be updated.");
    }
  };

  const handleDelete = async (commentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteMutation.mutateAsync({
        commentId,
        requestId,
      });
    } catch {
      setError("The comment could not be deleted.");
    }
  };

  const getAuthorName = (
    author: NonNullable<typeof commentsQuery.data>[number]["author"],
  ) => {
    if (typeof author === "string") {
      return "User";
    }

    return `${author.firstName} ${author.lastName}`;
  };

  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Comments</h2>

        <p className="mt-1 text-sm text-gray-500">
          Communicate with the people handling this request.
        </p>
      </div>

      {user && (
        <div className="mt-6">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Write a comment..."
            rows={4}
            maxLength={2000}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
          />

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">{body.length}/2000</span>

            <button
              type="button"
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? "Posting..." : "Add Comment"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {commentsQuery.isLoading && (
        <p className="mt-6 text-sm text-gray-500">Loading comments...</p>
      )}

      {commentsQuery.isError && (
        <p className="mt-6 text-sm text-red-600">Failed to load comments.</p>
      )}

      {!commentsQuery.isLoading &&
        !commentsQuery.isError &&
        commentsQuery.data?.length === 0 && (
          <div className="mt-6 rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="font-medium text-gray-700">No comments yet</p>

            <p className="mt-1 text-sm text-gray-500">
              Start the conversation about this request.
            </p>
          </div>
        )}

      <div className="mt-6 space-y-4">
        {commentsQuery.data?.map((comment) => {
          const isAuthorObject = typeof comment.author !== "string";

          const isOwnComment =
            typeof comment.author !== "string" &&
            user?.id === comment.author._id;

          const isEditing = editingId === comment._id;

          return (
            <article
              key={comment._id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {getAuthorName(comment.author)}
                  </p>

                  {isAuthorObject && (
                    <p className="text-xs text-gray-500">
                      {getAuthorName(comment.author)}
                    </p>
                  )}
                </div>

                <time className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </time>
              </div>

              {isEditing ? (
                <div className="mt-4">
                  <textarea
                    value={editingBody}
                    onChange={(event) => setEditingBody(event.target.value)}
                    rows={3}
                    maxLength={2000}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                  />

                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(comment._id)}
                      disabled={updateMutation.isPending}
                      className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      {updateMutation.isPending ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditingBody("");
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {comment.body}
                  </p>

                  {isOwnComment && (
                    <div className="mt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditingBody(comment.body);
                        }}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(comment._id)}
                        disabled={deleteMutation.isPending}
                        className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
