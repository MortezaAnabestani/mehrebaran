import { Schema, model, Document } from "mongoose";

/**
 * Need Comment Model - کامنت‌های مربوط به نیازها
 */

export interface INeedComment extends Document {
  content: string;
  user: Schema.Types.ObjectId;
  target: Schema.Types.ObjectId;
  targetType: "need" | "update";
  parent?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const needCommentSchema = new Schema<INeedComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
    targetType: {
      type: String,
      required: true,
      enum: ["need", "update"],
      default: "need",
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "NeedComment",
    },
  },
  { timestamps: true }
);

needCommentSchema.index({ target: 1, createdAt: -1 });
needCommentSchema.index({ user: 1, createdAt: -1 });

export const NeedComment = model<INeedComment>("NeedComment", needCommentSchema);
