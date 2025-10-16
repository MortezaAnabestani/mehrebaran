import { Types } from "mongoose";
import { IUser, INeed } from "./";

export interface IPollOption {
  _id: string;
  text: string;
  votes: (IUser | Types.ObjectId | string)[];
  votesCount?: number;
}

export interface IPoll {
  _id: string;
  question: string;
  options: IPollOption[];
  need: INeed | Types.ObjectId | string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
