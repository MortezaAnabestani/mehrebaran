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

export type MilestoneStatus = "pending" | "in_progress" | "completed" | "delayed";

export interface IMilestone {
  _id: string;
  title: string;
  description: string;
  targetDate: Date;
  completionDate?: Date;
  status: MilestoneStatus;
  progressPercentage: number;
  order: number;
  evidence?: string[];  // URLs of images/documents
}

export type BudgetItemStatus = "pending" | "partial" | "fully_funded" | "exceeded";

export interface IBudgetItem {
  _id: string;
  title: string;
  description?: string;
  category: string; // مثل: تجهیزات، خدمات، مواد اولیه
  estimatedCost: number;
  actualCost?: number;
  amountRaised: number; // مبلغ جمع‌آوری شده
  currency: string; // پیش‌فرض: "IRR"
  status: BudgetItemStatus;
  priority: number; // 1-5
  notes?: string;
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
  milestones?: IMilestone[];
  overallProgress?: number;  // 0-100, محاسبه شده از milestones
  deadline?: Date;

  // Budget
  budgetItems?: IBudgetItem[];
  totalBudget?: number; // مجموع estimatedCost همه آیتم‌ها (محاسبه شده)
  totalRaised?: number; // مجموع amountRaised همه آیتم‌ها (محاسبه شده)
  budgetProgress?: number; // درصد جمع‌آوری شده (محاسبه شده)

  // System
  priority?: number; // امتیاز محاسبه‌شده برای ranking
  createdAt: Date;
  updatedAt: Date;
}
