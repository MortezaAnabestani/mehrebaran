import { Schema, model, Document } from "mongoose";

/**
 * Like Model - برای لایک کردن needs, comments, stories و غیره
 */

export interface ILike extends Document {
  user: Schema.Types.ObjectId;
  target: Schema.Types.ObjectId;
  targetType: "need" | "comment" | "story" | "user";
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
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
      enum: ["need", "comment", "story", "user"],
    },
  },
  { timestamps: true }
);

// هر کاربر فقط یک بار می‌تواند یک target را لایک کند
likeSchema.index({ user: 1, target: 1, targetType: 1 }, { unique: true });

export const Like = model<ILike>("Like", likeSchema);
