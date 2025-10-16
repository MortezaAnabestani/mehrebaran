import { Schema, model } from "mongoose";
import { IComment, CommentStatus } from "common-types";

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    guestName: { type: String },
    guestEmail: { type: String },
    post: { type: Schema.Types.ObjectId, required: true, refPath: "postType" },
    postType: { type: String, required: true, enum: ["News", "Article", "Project"] },
    parent: { type: Schema.Types.ObjectId, ref: "Comment" },
    status: {
      type: String,
      enum: Object.values(CommentStatus),
      default: CommentStatus.PENDING,
    },
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, author: 1, content: 1 }, { unique: true });
commentSchema.index({ post: 1, guestEmail: 1, content: 1 }, { unique: true });

export const CommentModel = model<IComment>("Comment", commentSchema);
