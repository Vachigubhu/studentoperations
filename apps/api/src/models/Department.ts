import { Schema, model, type InferSchemaType } from "mongoose";

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      unique: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 20,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export type Department = InferSchemaType<typeof departmentSchema>;

export const DepartmentModel = model("Department", departmentSchema);
