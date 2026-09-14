import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserRole } from "../types/roles.js";

export type AccessTokenPayload = {
  userId: string;
  role: UserRole;
  departmentId?: string;
  type: "access";
};

export type RefreshTokenPayload = {
  userId: string;
  role: UserRole;
  departmentId?: string;
  type: "refresh";
};

export const createAccessToken = (
  payload: Omit<AccessTokenPayload, "type">,
): string => {
  const secret = env.jwt.accessSecret as Secret;
  const options: SignOptions = {
    expiresIn: env.jwt.accessExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign({ ...payload, type: "access" }, secret, options);
};

export const createRefreshToken = (
  payload: Omit<RefreshTokenPayload, "type">,
): string => {
  const secret = env.jwt.refreshSecret as Secret;
  const options: SignOptions = {
    expiresIn: env.jwt.refreshExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign({ ...payload, type: "refresh" }, secret, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const payload = jwt.verify(token, env.jwt.accessSecret) as AccessTokenPayload;

  if (payload.type !== "access") {
    throw new Error("Invalid access token");
  }

  return payload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const payload = jwt.verify(
    token,
    env.jwt.refreshSecret,
  ) as RefreshTokenPayload;

  if (payload.type !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  return payload;
};

export const getTokenExpirationDate = (token: string): Date => {
  const decoded = jwt.decode(token);

  if (
    !decoded ||
    typeof decoded !== "object" ||
    typeof decoded.exp !== "number"
  ) {
    throw new Error("Invalid token expiration");
  }

  return new Date(decoded.exp * 1000);
};
