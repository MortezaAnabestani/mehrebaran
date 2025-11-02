import { IUser, INeed } from "./";
import { Types } from "mongoose";

// ==================== POINTS SYSTEM ====================

// Point action types
export type PointAction =
  | "need_created"           // +100: ایجاد نیاز
  | "need_upvote"            // +5: رأی به نیاز
  | "need_support"           // +50: حمایت از نیاز
  | "supporter_contribution" // +variable: کمک مالی/زمانی
  | "task_completed"         // +30: تکمیل تسک
  | "task_assigned"          // +10: واگذاری تسک
  | "milestone_completed"    // +100: تکمیل مایلستون
  | "verification_approved"  // +50: تایید verification
  | "comment_posted"         // +5: کامنت
  | "message_sent"           // +2: پیام
  | "team_created"           // +75: ایجاد تیم
  | "team_joined"            // +25: پیوستن به تیم
  | "need_completed"         // +500: تکمیل نیاز
  | "daily_login"            // +10: ورود روزانه
  | "profile_completed"      // +50: تکمیل پروفایل
  | "first_contribution"     // +100: اولین کمک
  | "invite_accepted"        // +30: دعوت پذیرفته شده
  | "badge_earned"           // +variable: دریافت badge
  | "level_up"               // +variable: ارتقای سطح
  | "admin_bonus"            // +variable: جایزه ادمین
  | "penalty";               // -variable: جریمه

// Point transaction
export interface IPointTransaction {
  _id: string;
  user: IUser | string | Types.ObjectId;
  action: PointAction;
  points: number; // می‌تواند مثبت یا منفی باشد
  description?: string;
  relatedModel?: string; // "Need", "Task", "Team", etc.
  relatedId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// User point summary (virtual/aggregated)
export interface IUserPointSummary {
  userId: string;
  totalPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;
  rank?: number; // رتبه در leaderboard
}

// ==================== BADGE SYSTEM ====================

// Badge category
export type BadgeCategory =
  | "contributor"    // مشارکت‌کننده
  | "supporter"      // حامی
  | "creator"        // سازنده
  | "helper"         // یاور
  | "communicator"   // ارتباط‌گر
  | "leader"         // رهبر
  | "expert"         // متخصص
  | "milestone"      // نقطه عطف
  | "special"        // ویژه
  | "seasonal";      // فصلی

// Badge rarity
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

// Badge unlock condition
export interface IBadgeCondition {
  type: "points" | "count" | "streak" | "milestone" | "custom";
  target?: number; // هدف عددی
  action?: PointAction; // برای type: "count"
  description: string;
}

// Badge definition
export interface IBadge {
  _id: string;
  name: string;
  nameEn: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: string; // URL or emoji
  color?: string;
  conditions: IBadgeCondition[];
  points: number; // امتیاز هنگام دریافت
  isActive: boolean;
  isSecret?: boolean; // badge مخفی (نمایش داده نمی‌شود تا unlock شود)
  order?: number; // برای نمایش
  createdAt: Date;
  updatedAt: Date;
}

// User badge (earned)
export interface IUserBadge {
  _id: string;
  user: IUser | string | Types.ObjectId;
  badge: IBadge | string | Types.ObjectId;
  earnedAt: Date;
  progress?: number; // برای badge های در حال پیشرفت
  metadata?: Record<string, any>;
}

// ==================== USER PROFILE & STATS ====================

// User statistics
export interface IUserStats {
  userId: string;

  // Points & Level
  totalPoints: number;
  currentLevel: number;

  // Needs
  needsCreated: number;
  needsSupported: number;
  needsCompleted: number;
  needsUpvoted: number;

  // Tasks
  tasksCompleted: number;
  tasksAssigned: number;

  // Teams
  teamsCreated: number;
  teamsJoined: number;

  // Contributions
  totalFinancialContributions: number;
  totalHoursContributed: number;
  totalContributions: number;

  // Social
  followersCount: number;
  followingCount: number;
  messagesCount: number;
  commentsCount: number;

  // Badges
  badgesCount: number;
  commonBadges: number;
  rareBadges: number;
  epicBadges: number;
  legendaryBadges: number;

  // Streaks
  currentLoginStreak: number;
  longestLoginStreak: number;
  lastLoginDate?: Date;

  // Milestones
  firstContributionDate?: Date;
  firstNeedCreatedDate?: Date;
  firstTeamCreatedDate?: Date;

  // Rankings
  globalRank?: number;
  categoryRanks?: Record<string, number>;
}

// Level system configuration
export interface ILevel {
  level: number;
  minPoints: number;
  maxPoints: number;
  title: string;
  titleEn: string;
  benefits?: string[];
}

// Achievement progress (for tracking towards badges)
export interface IAchievementProgress {
  userId: string;
  badgeId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
  isCompleted: boolean;
}
