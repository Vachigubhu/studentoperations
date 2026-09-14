import { Schema, model } from "mongoose";

const documentSchema = new Schema(
  {
    request: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    storageKey: {
      type: String,
      required: true,
      unique: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
      min: 1,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  },
);

documentSchema.index({
  request: 1,
  createdAt: -1,
});

export type Document = {
  _id: Schema.Types.ObjectId;
  request: Schema.Types.ObjectId;
  uploadedBy: Schema.Types.ObjectId;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

export const DocumentModel = model("Document", documentSchema);
