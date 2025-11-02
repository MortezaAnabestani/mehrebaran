import { Schema, model, Types } from "mongoose";
import { IMention } from "common-types";

const mentionSchema = new Schema<IMention>(
  {
    mentionedUser: { type: Types.ObjectId, ref: "User", required: true, index: true },
    mentionedBy: { type: Types.ObjectId, ref: "User", required: true },
    context: {
      type: String,
      enum: ["comment", "message", "need_update", "task_description", "team_invitation", "direct_message"],
      required: true,
    },
    contextId: { type: String, required: true },
    relatedModel: { type: String, required: true },
    relatedId: { type: String, required: true, index: true },
    text: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for efficient queries
mentionSchema.index({ mentionedUser: 1, isRead: 1, createdAt: -1 });
mentionSchema.index({ context: 1, contextId: 1 });
mentionSchema.index({ relatedModel: 1, relatedId: 1 });

export const MentionModel = model<IMention>("Mention", mentionSchema);
