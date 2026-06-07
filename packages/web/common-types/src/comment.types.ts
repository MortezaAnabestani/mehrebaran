import { IUser } from "./user.types";

export type ObjectId = string;

export enum CommentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IComment {
  _id: string;
  content: string;

  author?: IUser | ObjectId;

  guestName?: string;
  guestEmail?: string;

  post: ObjectId;

  postType: "News" | "Article" | "Video" | "Gallery" | "Project";

  parent?: IComment | ObjectId;

  status: CommentStatus;

  createdAt: Date;
  updatedAt: Date;
}
