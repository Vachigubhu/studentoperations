import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongodbUrl);

    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection failed", {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : String(error),
    });

    process.exit(1);
  }
};
