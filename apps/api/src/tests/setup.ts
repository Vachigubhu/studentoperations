import { beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";

beforeAll(async () => {
  await connectDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});
