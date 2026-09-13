import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minLenth: 2,
      maxLength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"],
      default: "STUDENT",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
