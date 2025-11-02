import { IUser, INeed } from "./";
import { Types } from "mongoose";

// Team member role
export type TeamMemberRole = "leader" | "co_leader" | "member";

// Team member with role and stats
export interface ITeamMember {
  user: IUser | string | Types.ObjectId;
  role: TeamMemberRole;
  joinedAt: Date;
  invitedBy?: IUser | string | Types.ObjectId;
  tasksCompleted?: number;
  contributionScore?: number; // کمیت کمک‌های فرد در این تیم
  isActive: boolean;
  leftAt?: Date;
  leaveReason?: string;
}

// Team focus area/specialization
export type TeamFocusArea =
  | "fundraising"        // جمع‌آوری کمک
  | "logistics"          // تدارکات
  | "communication"      // ارتباطات و تبلیغات
  | "technical"          // فنی و تخصصی
  | "volunteer"          // داوطلبین
  | "coordination"       // هماهنگی
  | "documentation"      // مستندسازی
  | "general";           // عمومی

// Team status
export type TeamStatus = "active" | "paused" | "completed" | "disbanded";

// Team interface
export interface ITeam {
  _id: string;
  need: INeed | string | Types.ObjectId;
  name: string;
  description?: string;
  focusArea: TeamFocusArea;
  members: ITeamMember[];
  status: TeamStatus;
  maxMembers?: number;
  tags?: string[]; // برای جستجو و دسته‌بندی

  // Stats (virtual fields)
  totalMembers?: number;
  activeMembers?: number;
  tasksAssignedToTeam?: number;
  tasksCompletedByTeam?: number;
  teamProgress?: number; // درصد پیشرفت کلی تیم

  createdBy: IUser | string | Types.ObjectId;
  isPrivate?: boolean; // آیا تیم خصوصی است (فقط با دعوت)

  createdAt: Date;
  updatedAt: Date;
}

// Team invitation
export interface ITeamInvitation {
  _id: string;
  team: ITeam | string | Types.ObjectId;
  invitedUser: IUser | string | Types.ObjectId;
  invitedBy: IUser | string | Types.ObjectId;
  status: "pending" | "accepted" | "rejected" | "expired";
  message?: string;
  expiresAt: Date;
  respondedAt?: Date;
  createdAt: Date;
}
