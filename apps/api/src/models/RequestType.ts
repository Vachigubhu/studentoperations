import { Schema, model, type InferSchemaType } from "mongoose";

const requestTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 30,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
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

requestTypeSchema.index({ code: 1 }, { unique: true });

export type RequestType = InferSchemaType<typeof requestTypeSchema>;

export const RequestTypeModel = model("RequestType", requestTypeSchema);
