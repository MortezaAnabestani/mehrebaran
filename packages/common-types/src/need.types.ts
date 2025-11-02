import { IUser } from "./";

export interface INeedCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStatusHistory {
  status: NeedStatus;
  changedBy?: IUser | string;
  changedAt: Date;
  reason?: string;
}

export type NeedStatus =
  | "draft"
  | "pending"
  | "under_review"
  | "approved"
  | "in_progress"
  | "completed"
  | "rejected"
  | "archived"
  | "cancelled";

export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export interface IGeoLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
  locationName?: string; // نام محلی مثل "روستای کوهستان"
  city?: string;
  province?: string;
  country?: string;
  isLocationApproximate?: boolean;
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
  statusHistory?: IStatusHistory[];
  urgencyLevel: UrgencyLevel;

  submittedBy: {
    user?: IUser | string;
    guestName?: string;
    guestEmail?: string;
  };

  attachments: IAttachment[];

  // Social
  upvotes: (IUser | string)[];
  supporters?: (IUser | string)[];
  viewsCount: number;

  // Planning
  estimatedDuration?: string; // مثل "2 هفته" یا "3 ماه"
  requiredSkills: string[];
  tags: string[];

  // Location
  location?: IGeoLocation;

  // Timeline
  updates?: INeedUpdate[];
  deadline?: Date;

  // System
  priority?: number; // امتیاز محاسبه‌شده برای ranking
  createdAt: Date;
  updatedAt: Date;
}
