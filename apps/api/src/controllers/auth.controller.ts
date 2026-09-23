import type { RequestHandler } from "express";
import { registerSchema, loginShema } from "../validators/auth.validator.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import {
  refreshAccessToken,
  revokeRefreshToken,
} from "../services/refresh-token.service.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

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

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.cookieSecure,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/v1/auth",
    });

    const { refreshToken, ...responseData } = result;

    res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshController: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(401, "Refresh token is required");
    }

    const result = await refreshAccessToken(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.cookieSecure,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/v1/auth",
    });

    res.status(200).json({
      status: "success",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(401, "Refresh token is required");
    }

    await revokeRefreshToken(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.cookieSecure,
      sameSite: "strict",
      path: "/api/v1/auth",
    });

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
