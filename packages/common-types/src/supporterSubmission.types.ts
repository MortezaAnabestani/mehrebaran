import { Types } from "mongoose";
import { IUser, INeed, IResponsiveImage } from "./";

export enum SubmissionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export type SubmissionStatusType = "pending" | "approved" | "rejected";

export interface ISupporterSubmission {
  _id: string;
  submitter: IUser | Types.ObjectId | string;
  need: INeed | Types.ObjectId | string;
  image: IResponsiveImage;
  caption?: string;
  status: SubmissionStatusType;
  createdAt: Date;
  updatedAt: Date;
}
