import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongodbUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed: ", error);
    process.exit(1);
  }
};
