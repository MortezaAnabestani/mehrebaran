import { Schema, model, Types } from "mongoose";
import { ISupporterMessage } from "common-types";

const supporterMessageSchema = new Schema<ISupporterMessage>(
  {
    content: { type: String, required: true },
    author: { type: Types.ObjectId, ref: "User", required: true },
    need: { type: Types.ObjectId, ref: "Need", required: true },
    parentMessage: { type: Types.ObjectId, ref: "SupporterMessage" },
    likes: [{ type: Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const SupporterMessageModel = model<ISupporterMessage>("SupporterMessage", supporterMessageSchema);
