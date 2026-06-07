import { IUser, INeed, IResponsiveImage } from "./";
import { ObjectId } from "./object-id.type";

export enum SubmissionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export type SubmissionStatusType = "pending" | "approved" | "rejected";

export interface ISupporterSubmission {
  _id: string;
  submitter: IUser | ObjectId | string;
  need: INeed | ObjectId | string;
  image: IResponsiveImage;
  caption?: string;
  status: SubmissionStatusType;
  createdAt: Date;
  updatedAt: Date;
}
