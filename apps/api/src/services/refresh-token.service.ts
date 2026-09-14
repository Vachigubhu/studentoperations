import crypto from "node:crypto";
import { RefreshSessionModel } from "../models/RefreshSession.js";
import { AppError } from "../utils/AppError.js";
import { UserModel } from "../models/User.js";
import { hashToken } from "../utils/token-hash.js";
import {
  createAccessToken,
  createRefreshToken,
  getTokenExpirationDate,
  verifyRefreshToken,
} from "../utils/tokens.js";

const createRefreshSession = async (
  userId: string,
  role: "STUDENT" | "STAFF" | "MANAGER" | "ADMIN" | "SUPER_ADMIN",
  departmentId: string | undefined,
  familyId: string = crypto.randomUUID(),
) => {
  const refreshToken = createRefreshToken({
    userId,
    role,
    departmentId,
  });

  await RefreshSessionModel.create({
    user: userId,
    tokenHash: hashToken(refreshToken),
    familyId,
    expiresAt: getTokenExpirationDate(refreshToken),
  });

  return {
    refreshToken,
    familyId,
  };
};

export const createInitialRefreshSession = async (
  userId: string,
  role: "STUDENT" | "STAFF" | "MANAGER" | "ADMIN" | "SUPER_ADMIN",
  departmentId: string | undefined,
) => {
  return createRefreshSession(userId, role, departmentId);
};

export const refreshAccessToken = async (refreshToken: string) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, "Invalid or expired refresh token");
  }

  const tokenHash = hashToken(refreshToken);

  const session = await RefreshSessionModel.findOne({
    tokenHash,
  });

  if (!session) {
    throw new AppError(401, "Invalid refresh token");
  }

  if (session.revokedAt) {
    await RefreshSessionModel.updateMany(
      {
        familyId: session.familyId,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    );
    throw new AppError(401, "Refresh token reuse detected");
  }

  if (session.expiresAt <= new Date()) {
    throw new AppError(402, "Refresh token expired");
  }

  const user = await UserModel.findById(payload.userId);

  if (!user) {
    throw new AppError(401, "User not found");
  }

  if (!user.isActive) {
    throw new AppError(403, "Account is inactive");
  }

  //Revoke the token that was just used
  session.revokedAt = new Date();
  await session.save();

  //Issue a completely new refresh token.
  const newSession = await createRefreshSession(
    user._id.toString(),
    user.role,
    user.department ? user.department.toString() : undefined,
    session.familyId,
  );

  const accessToken = createAccessToken({
    userId: user._id.toString(),
    role: user.role,
    departmentId: user.department ? user.department.toString() : undefined,
  });

  return {
    accessToken,
    refreshToken: newSession.refreshToken,
  };
};

export const revokeRefreshToken = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);

  await RefreshSessionModel.updateOne(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );
};
