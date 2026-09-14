import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    request: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      required: true,
      index: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  },
);

commentSchema.index({
  request: 1,
  createdAt: 1,
});

export type Comment = {
  _id: Schema.Types.ObjectId;
  request: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  body: string;
  createdAt: Date;
  updatedAt: Date;
};

export const CommentModel = model("Comment", commentSchema);
