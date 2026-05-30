import { IUser, INeed } from "./";
import { ObjectId } from "./object-id.type";

export interface IPollOption {
  _id: string;
  text: string;
  votes: (IUser | ObjectId | string)[];
  votesCount?: number;
}

export interface IPoll {
  _id: string;
  question: string;
  options: IPollOption[];
  need: INeed | ObjectId | string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
