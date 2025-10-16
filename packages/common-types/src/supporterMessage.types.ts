import { IUser, INeed } from "./";
import { Types } from "mongoose";

export interface ISupporterMessage {
  _id: string;
  content: string;
  author: IUser | string | Types.ObjectId;
  need: INeed | string | Types.ObjectId;
  parentMessage?: ISupporterMessage | string | Types.ObjectId;
  likes: (IUser | string | Types.ObjectId)[];
  createdAt: Date;
  updatedAt: Date;
}
