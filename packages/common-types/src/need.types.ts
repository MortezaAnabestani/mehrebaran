import { IUser } from "./";

export interface INeedCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export type NeedStatus = "pending" | "approved" | "in_progress" | "completed" | "rejected";

export interface IGeoLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
}

export interface IAttachment {
  fileType: "image" | "audio" | "video";
  url: string;
}

export interface INeedUpdate {
  _id: string;
  title: string;
  description: string;
  date: Date;
}

export interface INeed {
  _id: string;
  title: string;
  slug: string;
  description: string;

  category: INeedCategory | string;
  status: NeedStatus;

  submittedBy: {
    user?: IUser | string;
    guestName?: string;
  };

  attachments: IAttachment[];

  upvotes: (IUser | string)[];
  supporters?: (IUser | string)[];
  location?: IGeoLocation;
  updates?: INeedUpdate[];
  createdAt: Date;
  updatedAt: Date;
}
