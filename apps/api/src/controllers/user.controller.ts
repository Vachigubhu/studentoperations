import type { RequestHandler } from "express";
import { UserModel } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import "../models/Department.js";

type PopulatedDepartment = {
  _id: string;
  name: string;
  code: string;
};

export const getCurrentUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const user = await UserModel.findById(req.user.userId)
      .select("+department")
      .populate<{
        department: PopulatedDepartment | null;
      }>("department", "name code")
      .lean();

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
          department: user.department
            ? {
                id: user.department._id.toString(),
                name: user.department.name,
                code: user.department.code,
              }
            : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDirectory: RequestHandler = async (req, res, next) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await UserModel.find(query)
      .select("firstName lastName email role department")
      .populate<{
        department: PopulatedDepartment | null;
      }>("department", "name code")
      .sort({ firstName: 1, lastName: 1 })
      .lean();

    res.status(200).json({
      status: "success",
      data: {
        users: users.map((user) => ({
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          department: user.department
            ? {
                id: user.department._id.toString(),
                name: user.department.name,
                code: user.department.code,
              }
            : null,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
