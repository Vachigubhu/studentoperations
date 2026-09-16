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

export const getUserDirectory: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const query: Record<string, unknown> = {
      isActive: true,
      _id: { $ne: req.user.userId },
    };

    if (search) {
      const searchRegex = new RegExp(search, "i");

      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    const users = await UserModel.find(query)
      .select("firstName lastName email role department")
      .populate("department", "name code")
      .sort({ firstName: 1, lastName: 1 })
      .limit(20)
      .lean();

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};