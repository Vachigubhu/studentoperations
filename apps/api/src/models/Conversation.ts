import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    request: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },

    subject: {
      type: String,
      trim: true,
      maxLength: 200,
      required: true,
    },

    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({
  participants: 1,
  lastMessageAt: -1,
});

conversationSchema.index({
  request: 1,
  participants: 1,
});

export const ConversationModel = model("Conversation", conversationSchema);
