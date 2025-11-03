import { Types } from "mongoose";
import { IUser } from "./user.types";
import { INeed } from "./need.types";
import { ITeam } from "./team.types";

// ============= Leaderboard Types =============

export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "all_time";

export type LeaderboardCategory =
  | "points" // بر اساس امتیازات
  | "contributions" // بر اساس مشارکت‌ها
  | "needs_created" // بر اساس نیازهای ایجاد شده
  | "needs_supported" // بر اساس نیازهای حمایت شده
  | "badges" // بر اساس تعداد نشان‌ها
  | "level" // بر اساس سطح
  | "tasks_completed" // بر اساس تسک‌های تکمیل شده
  | "teams_created"; // بر اساس تیم‌های ایجاد شده

export interface ILeaderboardEntry {
  user: IUser | string | Types.ObjectId;
  rank: number; // رتبه (1, 2, 3, ...)
  score: number; // امتیاز (بر اساس category)
  previousRank?: number; // رتبه قبلی (برای نمایش تغییرات)
  rankChange?: number; // تغییر رتبه (+5, -2, 0)
  level?: number;
  badge?: string;
  metadata?: Record<string, any>;
}

export interface ILeaderboardResponse {
  category: LeaderboardCategory;
  period: LeaderboardPeriod;
  entries: ILeaderboardEntry[];
  totalUsers: number;
  lastUpdated: Date;
  userEntry?: ILeaderboardEntry; // رتبه کاربر فعلی
}

// ============= Trending Types =============

export type TrendingPeriod = "1h" | "6h" | "24h" | "7d" | "30d";

export type TrendingCategory = "needs" | "users" | "tags";

export interface ITrendingScore {
  views: number;
  interactions: number; // comments + supports + shares
  momentum: number; // سرعت رشد
  recency: number; // تازگی
  totalScore: number; // امتیاز کل
}

export interface ITrendingNeed extends INeed {
  trendingScore: ITrendingScore;
  rank: number;
}

export interface ITrendingUser {
  user: IUser | string | Types.ObjectId;
  trendingScore: ITrendingScore;
  rank: number;
  recentActivity: {
    needsCreated: number;
    contributions: number;
    pointsEarned: number;
  };
}

export interface ITrendingTag {
  tag: string;
  displayTag: string;
  usageCount: number;
  growthRate: number; // نرخ رشد نسبت به دوره قبل
  rank: number;
  relatedNeedsCount: number;
}

// ============= Recommendation Types =============

export type RecommendationType = "needs" | "users" | "teams";

export type RecommendationStrategy =
  | "collaborative" // بر اساس کاربران مشابه
  | "content_based" // بر اساس محتوای مشابه
  | "hybrid" // ترکیبی
  | "popular" // محبوب‌ترین‌ها
  | "trending" // ترندینگ
  | "personalized"; // شخصی‌سازی شده

export interface IRecommendationReason {
  type:
    | "similar_users" // کاربران مشابه
    | "similar_content" // محتوای مشابه
    | "popular" // محبوب
    | "trending" // ترندینگ
    | "category_match" // تطابق دسته‌بندی
    | "tag_match" // تطابق تگ
    | "location_match" // تطابق موقعیت
    | "skill_match" // تطابق مهارت
    | "previous_interaction"; // تعامل قبلی
  description: string;
  weight: number; // وزن این دلیل در امتیاز کل
}

export interface IRecommendation<T = any> {
  item: T; // Need | User | Team
  itemType: RecommendationType;
  score: number; // امتیاز توصیه (0-100)
  confidence: number; // اطمینان از توصیه (0-1)
  reasons: IRecommendationReason[]; // دلایل توصیه
  strategy: RecommendationStrategy;
  metadata?: Record<string, any>;
}

export interface IUserPreferences {
  userId: string;
  favoriteCategories: string[]; // دسته‌بندی‌های محبوب
  favoriteTags: string[]; // تگ‌های محبوب
  preferredLocations: string[]; // موقعیت‌های محبوب
  interactedNeeds: string[]; // نیازهایی که تعامل داشته
  followedUsers: string[]; // کاربران دنبال شده
  supportedCategories: string[]; // دسته‌بندی‌هایی که حمایت کرده
  skillsInterested: string[]; // مهارت‌های مورد علاقه
  lastUpdated: Date;
}

export interface INeedRecommendation extends IRecommendation<INeed> {
  itemType: "needs";
  matchScore: {
    categoryMatch: number;
    tagMatch: number;
    locationMatch: number;
    skillMatch: number;
    popularityScore: number;
  };
}

export interface IUserRecommendation extends IRecommendation<IUser> {
  itemType: "users";
  matchScore: {
    mutualConnections: number;
    similarInterests: number;
    complementarySkills: number;
    activityLevel: number;
  };
}

export interface ITeamRecommendation extends IRecommendation<ITeam> {
  itemType: "teams";
  matchScore: {
    categoryMatch: number;
    skillMatch: number;
    needMatch: number;
    activityLevel: number;
  };
}

// ============= Discovery Stats Types =============

export interface IDiscoveryStats {
  userId: string;
  totalViews: number;
  totalInteractions: number;
  recommendationsAccepted: number; // تعداد توصیه‌های پذیرفته شده
  recommendationsRejected: number; // تعداد توصیه‌های رد شده
  avgRecommendationScore: number;
  lastActive: Date;
  preferences: IUserPreferences;
}
