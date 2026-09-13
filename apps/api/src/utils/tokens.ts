import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type AccessTokenPayload = {
  userId: string;
  role: string;
};

export const createAccessToken = (payload: AccessTokenPayload): string => {
  const secret = env.jwt.accessSecret as Secret;
  const options: SignOptions = {
    expiresIn: env.jwt.accessExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const createRefreshToken = (payload: AccessTokenPayload): string => {
  const secret = env.jwt.refreshSecret as Secret;
  const options: SignOptions = {
    expiresIn: env.jwt.refreshExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.jwt.accessSecret) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.jwt.refreshSecret) as AccessTokenPayload;
};
