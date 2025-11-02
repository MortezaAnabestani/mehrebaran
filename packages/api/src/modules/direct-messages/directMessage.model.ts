import { Schema, model, Types } from "mongoose";
import { IDirectMessage } from "common-types";

const messageAttachmentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["image", "document", "video", "audio"],
      required: true,
    },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    fileSize: { type: Number },
    mimeType: { type: String },
  },
  { _id: false }
);

const readBySchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    readAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const directMessageSchema = new Schema<IDirectMessage>(
  {
    conversation: { type: Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    readBy: [readBySchema],
    attachments: [messageAttachmentSchema],
    replyTo: { type: Types.ObjectId, ref: "DirectMessage" },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// Index for efficient querying
directMessageSchema.index({ conversation: 1, createdAt: -1 });
directMessageSchema.index({ sender: 1 });

// Middleware to update conversation's lastMessage when new message is created
directMessageSchema.post("save", async function (doc) {
  const ConversationModel = model("Conversation");
  await ConversationModel.findByIdAndUpdate(doc.conversation, {
    lastMessage: doc._id,
    lastMessageAt: doc.createdAt,
  });
});

export const DirectMessageModel = model<IDirectMessage>("DirectMessage", directMessageSchema);
