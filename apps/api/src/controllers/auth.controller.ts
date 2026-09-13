import type { RequestHandler } from "express";
import { registerSchema, loginShema } from "../validators/auth.validator.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { refreshTokenSchema } from "../validators/refresh-token.validator.js";
import {
  refreshAccessToken,
  revokeRefreshToken,
} from "../services/refresh-token.service.js";

export const registerController: RequestHandler = async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);

    const user = await registerUser(input);

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController: RequestHandler = async (req, res, next) => {
  try {
    const input = loginShema.parse(req.body);

    const result = await loginUser(input);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshController: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    const result = await refreshAccessToken(refreshToken);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    await revokeRefreshToken(refreshToken);

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};