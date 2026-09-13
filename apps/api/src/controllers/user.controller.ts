import { RequestHandler } from "express";
import { UserModel } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const getCurrentUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const user = await UserModel.findById(req.user.userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
