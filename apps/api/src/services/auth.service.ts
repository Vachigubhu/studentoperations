import { emitAuditEvent } from "../events/audit.js";
import { UserModel } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { createAccessToken } from "../utils/tokens.js";
import { createInitialRefreshSession } from "./refresh-token.service.js";

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await UserModel.findOne({
    email: input.email,
  });

  if (existingUser) {
    throw new AppError(409, "Email is already registered");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await UserModel.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    password: passwordHash,
  });

  emitAuditEvent(
    user._id.toString(),
    "USER_REGISTERED",
    "User",
    user._id.toString(),
  );

  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await UserModel.findOne({
    email: input.email,
  }).select("+password");

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatches = await comparePassword(input.password, user.password);

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new AppError(403, "Account is inactive");
  }

  const payload = {
    userId: user._id.toString(),
    role: user.role,
    departmentId: user.department ? user.department.toString() : undefined,
  };

  const refreshSession = await createInitialRefreshSession(
    user._id.toString(),
    user.role,
    user.department ? user.department.toString() : undefined,
  );

  emitAuditEvent(
    user._id.toString(),
    "USER_LOGIN",
    "User",
    user._id.toString(),
  );

  return {
    user: {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },

    accessToken: createAccessToken(payload),

    refreshToken: refreshSession.refreshToken,
  };
};
