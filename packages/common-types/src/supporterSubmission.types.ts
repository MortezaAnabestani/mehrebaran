import { Types } from "mongoose";
import { IUser, INeed, IResponsiveImage } from "./";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface ISupporterSubmission {
  _id: string;
  submitter: IUser | Types.ObjectId | string;
  need: INeed | Types.ObjectId | string;
  image: IResponsiveImage;
  caption?: string;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}
