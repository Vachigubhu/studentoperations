import { emitAuditEvent } from "../events/audit.js";
import { CommentModel } from "../models/Comment.js";
import { AppError } from "../utils/AppError.js";
import { getAccessibleRequest } from "../utils/request-access.js";

type RequestAccessUser = {
  userId: string;
  role: "STUDENT" | "STAFF" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";
  departmentId?: string;
};

export const createComment = async (
  requestId: string,
  user: RequestAccessUser,
  body: string,
) => {
  const request = await getAccessibleRequest(requestId, user);

  const comment = await CommentModel.create({
    request: request._id,
    author: user.userId,
    body,
  });

  emitAuditEvent(
    user.userId,
    "COMMENT_CREATED",
    "Comment",
    comment._id.toString(),
    {
      metadata: {
        requestId: requestId,
      },
    },
  );

  return comment.populate({
    path: "author",
    select: "firstName lastName email role",
  });
};

export const getRequestComments = async (
  requestId: string,
  user: RequestAccessUser,
) => {
  await getAccessibleRequest(requestId, user);

  return CommentModel.find({
    request: requestId,
  })
    .populate("author", "firstName lastName email role")
    .sort({ createdAt: 1 });
};

export const updateComment = async (
  commentId: string,
  user: RequestAccessUser,
  body: string,
) => {
  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    throw new AppError(404, "Comment not found");
  }

  await getAccessibleRequest(comment.request.toString(), user);

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  const isOwner = comment.author.toString() === user.userId;

  if (!isOwner && !isAdmin) {
    throw new AppError(403, "You are not allowed to modify this comment");
  }

  comment.body = body;

  await comment.save();

  emitAuditEvent(
    user.userId,
    "COMMENT_UPDATED",
    "Comment",
    comment._id.toString(),
    {
      metadata: {
        requestId: comment.request.toString(),
      },
    },
  );

  return comment.populate({
    path: "author",
    select: "firstName lastName email role",
  });
};

export const deleteComment = async (
  commentId: string,
  user: RequestAccessUser,
) => {
  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    throw new AppError(404, "Comment not found");
  }

  await getAccessibleRequest(comment.request.toString(), user);

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  const isOwner = comment.author.toString() === user.userId;

  if (!isOwner && !isAdmin) {
    throw new AppError(403, "You are not allowed to delete this comment");
  }

  const requestId = comment.request.toString();

  await comment.deleteOne();

  emitAuditEvent(
    user.userId,
    "COMMENT_DELETED",
    "Comment",
    comment._id.toString(),
    {
      metadata: {
        requestId,
      },
    },
  );

};
