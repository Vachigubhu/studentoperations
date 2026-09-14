import { Schema, model, type InferSchemaType } from "mongoose";

import { REQUEST_PRIORITIES, REQUEST_STATUSES } from "../types/request.js";

const requestSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    requestType: {
      type: Schema.Types.ObjectId,
      ref: "RequestType",
      required: true,
      index: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: REQUEST_STATUSES,
      default: "DRAFT",
      index: true,
    },

    priority: {
      type: String,
      enum: REQUEST_PRIORITIES,
      default: "NORMAL",
      index: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

requestSchema.index({
  student: 1,
  createdAt: -1,
});

requestSchema.index({
  department: 1,
  status: 1,
});

export type StudentRequest = InferSchemaType<typeof requestSchema>;

export const RequestModel = model("Request", requestSchema);
