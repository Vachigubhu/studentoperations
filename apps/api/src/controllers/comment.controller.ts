import type { RequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import { createCommentSchema } from "../validators/comment.validator.js";
import {
  createComment,
  deleteComment,
  getRequestComments,
  updateComment,
} from "../services/comment.service.js";

export const createCommentController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const input = createCommentSchema.parse(req.body);

    const comment = await createComment(req.params.id, req.user, input.body);

    res.status(201).json({
      status: "success",
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const getRequestCommentsController: RequestHandler<{
  id: string;
}> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const comments = await getRequestComments(req.params.id, req.user);

    res.status(200).json({
      status: "success",
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCommentController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const input = createCommentSchema.parse(req.body);

    const comment = await updateComment(req.params.id, req.user, input.body);

    res.status(200).json({
      status: "success",
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCommentController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    await deleteComment(req.params.id, req.user);

    res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
