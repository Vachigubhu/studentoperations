import "dotenv/config";
import mongoose from "mongoose";

import { UserModel } from "../models/User.js";
import { env } from "../config/env.js";
import { USER_ROLES, type UserRole } from "../types/roles.js";

const email = process.argv[2];
const role = process.argv[3] as UserRole;

if (!email || !role) {
  console.error(
    "Usage: pnpm --filter api exec tsx src/scripts/set-role.ts <email> <role>",
  );
  process.exit(1);
}

const run = async (): Promise<void> => {
  await mongoose.connect(env.mongodbUrl);

  const user = await UserModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role },
    { new: true },
  );

  if (!user) {
    console.error(`User not found: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`Updated ${user.email} -> ${user.role}`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
