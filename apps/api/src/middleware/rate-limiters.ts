import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Please try again later.",
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Please try again later.",
  },
});
