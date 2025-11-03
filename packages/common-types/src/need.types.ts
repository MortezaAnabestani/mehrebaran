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

export type VerificationRequestType =
  | "milestone_completion"
  | "budget_expense"
  | "need_completion"
  | "progress_update";

export type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "needs_revision";

export interface IVerificationEvidence {
  type: "image" | "document" | "video";
  url: string;
  description?: string;
}

export interface IVerificationRequest {
  _id: string;
  type: VerificationRequestType;
  status: VerificationStatus;

  // Reference to what's being verified
  relatedItemId?: string; // milestone ID, budget item ID, etc.
  relatedItemType?: string; // "milestone", "budget_item", etc.

  // Request details
  description: string;
  evidence: IVerificationEvidence[];

  // Metadata
  submittedBy: IUser | string;
  submittedAt: Date;

  // Review details
  reviewedBy?: IUser | string;
  reviewedAt?: Date;
  adminComments?: string;
  rejectionReason?: string;

  // Revision tracking
  revisionRequested?: boolean;
  revisionNotes?: string;
}

export type TaskStatus = "todo" | "in_progress" | "review" | "completed" | "blocked";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface ITask {
  _id: string;
  title: string;
  description?: string;

  // Assignment
  assignedTo?: IUser | string;
  assignedBy?: IUser | string;
  assignedAt?: Date;

  // Status & Priority
  status: TaskStatus;
  priority: TaskPriority;

  // Timeline
  deadline?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;

  // Dependencies
  dependencies?: string[]; // Array of task IDs که باید اول تکمیل بشن
  blockedBy?: string; // Task ID که این task رو block کرده
  blockingReason?: string;

  // Progress
  progressPercentage?: number; // 0-100

  // Checklist
  checklist?: Array<{
    title: string;
    completed: boolean;
  }>;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export type SupporterRole = "supporter" | "volunteer" | "coordinator" | "lead";

export type ContributionType = "financial" | "time" | "skill" | "material" | "other";

export interface IContribution {
  type: ContributionType;
  description: string;
  amount?: number; // برای کمک مالی (ریال)
  hours?: number; // برای کمک زمانی (ساعت)
  date: Date;
  verifiedByAdmin?: boolean;
}

export interface ISupporterDetail {
  _id: string;
  user: IUser | string;
  role: SupporterRole;

  // Join info
  joinedAt: Date;
  invitedBy?: IUser | string;

  // Contributions
  contributions?: IContribution[];
  totalFinancialContribution?: number; // مجموع کمک‌های مالی (محاسبه شده)
  totalHoursContribution?: number; // مجموع ساعات کار (محاسبه شده)

  // Activity
  lastActivityAt?: Date;
  tasksCompleted?: number; // تعداد task های تکمیل شده

  // Badge/Recognition
  badge?: string; // مثل: "Top Contributor", "Early Supporter", "Volunteer of the Month"

  // Status
  isActive: boolean;
  leftAt?: Date;
  leaveReason?: string;

  // Notes
  notes?: string; // یادداشت‌های داخلی
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
  supporterDetails?: ISupporterDetail[]; // اطلاعات تکمیلی حامیان
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

  // Verification
  verificationRequests?: IVerificationRequest[];
  pendingVerificationsCount?: number; // تعداد درخواست‌های در انتظار (محاسبه شده)

  // Task Management
  tasks?: ITask[];
  totalTasksCount?: number; // تعداد کل task ها (محاسبه شده)
  completedTasksCount?: number; // تعداد task های تکمیل شده (محاسبه شده)
  tasksProgress?: number; // درصد پیشرفت task ها (محاسبه شده)

  // System
  priority?: number; // امتیاز محاسبه‌شده برای ranking
  createdAt: Date;
  updatedAt: Date;
}
