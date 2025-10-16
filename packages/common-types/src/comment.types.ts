import { IUser } from "./user.types";
import { Types } from "mongoose";

export enum CommentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IComment {
  _id: string;
  content: string;
  author?: IUser | Types.ObjectId | string;
  guestName?: string;
  guestEmail?: string;
  post: Types.ObjectId | string;
  postType: "News" | "Article" | "Project";
  parent?: IComment | Types.ObjectId | string;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
}
