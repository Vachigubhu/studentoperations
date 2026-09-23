import { AppError } from "../utils/AppError.js";
import { UserModel } from "../models/User.js";
import { USER_ROLES, type UserRole } from "../types/roles.js";

type ListUsersQuery = {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

export const listUsers = async ({
  search,
  role,
  isActive,
  page = 1,
  limit = 50,
}: ListUsersQuery) => {
  const filter: Record<string, unknown> = {};

  if (role) {
    filter.role = role;
  }

  if (typeof isActive === "boolean") {
    filter.isActive = isActive;
  }

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    UserModel.find(filter)
      .select(
        "_id firstName lastName email role department isActive createdAt updatedAt",
      )
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    UserModel.countDocuments(filter),
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateUserRole = async (
  userId: string,
  role: UserRole,
  currentUserRole: UserRole,
) => {
  if (role === "SUPER_ADMIN" && currentUserRole !== "SUPER_ADMIN") {
    throw new AppError(
      403,
      "Only a SUPER_ADMIN can assign the SUPER_ADMIN role",
    );
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { role },
    {
      new: true,
      runValidators: true,
    },
  )
    .select(
      "_id firstName lastName email role department isActive createdAt updatedAt",
    )
    .populate("department", "name code");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

export const updateUserStatus = async (userId: string, isActive: boolean) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { isActive },
    {
      new: true,
      runValidators: true,
    },
  )
    .select(
      "_id firstName lastName email role department isActive createdAt updatedAt",
    )
    .populate("department", "name code");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};
