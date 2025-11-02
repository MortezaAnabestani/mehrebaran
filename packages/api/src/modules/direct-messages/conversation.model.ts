import { Schema, model, Types } from "mongoose";
import { IConversation } from "common-types";

const conversationSchema = new Schema<IConversation>(
  {
    need: { type: Types.ObjectId, ref: "Need", required: true },
    participants: [{ type: Types.ObjectId, ref: "User", required: true }],
    type: {
      type: String,
      enum: ["one_to_one", "group"],
      default: "one_to_one",
    },
    title: { type: String }, // For group conversations
    lastMessage: { type: Types.ObjectId, ref: "DirectMessage" },
    lastMessageAt: { type: Date },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    isArchived: { type: Boolean, default: false },
    archivedBy: [{ type: Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Index for efficient querying
conversationSchema.index({ need: 1, participants: 1 });
conversationSchema.index({ participants: 1, lastMessageAt: -1 });

// Virtual for unread count (will be calculated in service)
conversationSchema.virtual("unreadCount").get(function () {
  return 0; // This will be populated dynamically in the service
});

// Ensure virtuals are included in JSON
conversationSchema.set("toJSON", { virtuals: true });
conversationSchema.set("toObject", { virtuals: true });

export const ConversationModel = model<IConversation>("Conversation", conversationSchema);
