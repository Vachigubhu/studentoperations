import { Schema, model, type InferSchemaType } from "mongoose";
import { USER_ROLES } from "../types/roles.js";

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
      enum: USER_ROLES,
      default: "STUDENT",
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      default: null,
      index: true,
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
