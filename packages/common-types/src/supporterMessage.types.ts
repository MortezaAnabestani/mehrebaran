import { IUser, INeed } from "./";
import { ObjectId } from "./object-id.type";

export interface ISupporterMessage {
  _id: string;
  content: string;
  author: IUser | string | ObjectId;
  need: INeed | string | ObjectId;
  parentMessage?: ISupporterMessage | string | ObjectId;
  likes: (IUser | string | ObjectId)[];
  createdAt: Date;
  updatedAt: Date;
}
