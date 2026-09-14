import { Schema, model } from "mongoose";

export const APPROVAL_DECISIONS = [
  "APPROVED",
  "REJECTED",
  "CORRECTION_REQUIRED",
] as const;

export type ApprovalDecision = (typeof APPROVAL_DECISIONS)[number];

const approvalSchema = new Schema(
  {
    request: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      required: true,
      index: true,
    },

    approver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    decision: {
      type: String,
      enum: APPROVAL_DECISIONS,
      required: true,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  },
);

approvalSchema.index({
  request: 1,
  createdAt: -1,
});

export type Approval = {
  _id: Schema.Types.ObjectId;
  request: Schema.Types.ObjectId;
  approver: Schema.Types.ObjectId;
  decision: ApprovalDecision;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
};

export const ApprovalModel = model("Approval", approvalSchema);
