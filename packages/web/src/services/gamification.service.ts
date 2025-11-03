import api from "@/lib/api";

/**
 * Level configuration
 */
export const LEVELS = [
  { level: 1, minPoints: 0, maxPoints: 999, title: "تازه‌وارد", titleEn: "Newcomer" },
  { level: 2, minPoints: 1000, maxPoints: 2999, title: "مبتدی", titleEn: "Beginner" },
  { level: 3, minPoints: 3000, maxPoints: 5999, title: "فعال", titleEn: "Active" },
  { level: 4, minPoints: 6000, maxPoints: 9999, title: "متعهد", titleEn: "Committed" },
  { level: 5, minPoints: 10000, maxPoints: 14999, title: "حامی", titleEn: "Supporter" },
  { level: 6, minPoints: 15000, maxPoints: 20999, title: "مشارکت‌کننده", titleEn: "Contributor" },
  { level: 7, minPoints: 21000, maxPoints: 27999, title: "فعال برتر", titleEn: "Top Active" },
  { level: 8, minPoints: 28000, maxPoints: 35999, title: "متخصص", titleEn: "Expert" },
  { level: 9, minPoints: 36000, maxPoints: 44999, title: "استاد", titleEn: "Master" },
  { level: 10, minPoints: 45000, maxPoints: 54999, title: "رهبر", titleEn: "Leader" },
  { level: 11, minPoints: 55000, maxPoints: 65999, title: "الهام‌بخش", titleEn: "Inspirational" },
  { level: 12, minPoints: 66000, maxPoints: 77999, title: "قهرمان", titleEn: "Champion" },
  { level: 13, minPoints: 78000, maxPoints: 90999, title: "افسانه", titleEn: "Legend" },
  { level: 14, minPoints: 91000, maxPoints: 104999, title: "ستاره", titleEn: "Star" },
  { level: 15, minPoints: 105000, maxPoints: 119999, title: "ستاره درخشان", titleEn: "Shining Star" },
  { level: 16, minPoints: 120000, maxPoints: 139999, title: "الماس", titleEn: "Diamond" },
  { level: 17, minPoints: 140000, maxPoints: 164999, title: "الماس سبز", titleEn: "Emerald" },
  { level: 18, minPoints: 165000, maxPoints: 194999, title: "یاقوت", titleEn: "Ruby" },
  { level: 19, minPoints: 195000, maxPoints: 229999, title: "افسانه‌ای", titleEn: "Mythical" },
  { level: 20, minPoints: 230000, maxPoints: Infinity, title: "افسانه جاودان", titleEn: "Eternal Legend" },
];

/**
 * Types
 */
export interface ILevel {
  level: number;
  minPoints: number;
  maxPoints: number;
  title: string;
  titleEn: string;
}

export interface IPointSummary {
  totalPoints: number;
  currentLevel: ILevel;
  nextLevel?: ILevel;
  pointsToNextLevel: number;
  progressPercentage: number;
  rank: number;
  pointsEarnedToday: number;
  pointsEarnedThisWeek: number;
  pointsEarnedThisMonth: number;
}

export interface IPointTransaction {
  _id: string;
  user: string;
  points: number;
  reason: string;
  actionType: string;
  metadata?: any;
  createdAt: Date;
}

export interface IPointsBreakdown {
  totalPoints: number;
  breakdown: {
    category: string;
    points: number;
    percentage: number;
  }[];
}

export interface IBadge {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  category: string;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  criteria: {
    type: string;
    threshold: number;
  };
  pointsReward: number;
  isActive: boolean;
  createdAt: Date;
}

export interface IUserBadge {
  badge: IBadge;
  earnedAt: Date;
  progress?: number;
}

export interface IUserStats {
  userId: string;
  totalPoints: number;
  currentLevel: number;
  needsCreated: number;
  needsSupported: number;
  tasksCompleted: number;
  teamsJoined: number;
  commentsPosted: number;
  badgesEarned: number;
  streak: number;
  lastActiveDate?: Date;
}

export interface ILeaderboardEntry {
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rank: number;
  score: number;
  level: number;
  badge?: IBadge;
  metadata?: any;
}

export interface ILeaderboardResponse {
  entries: ILeaderboardEntry[];
  userEntry?: ILeaderboardEntry;
  totalParticipants: number;
}

/**
 * Helper functions
 */
export function getLevelByPoints(points: number): ILevel {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getPointsToNextLevel(currentPoints: number): number {
  const currentLevel = getLevelByPoints(currentPoints);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 0; // Max level reached
  return nextLevel.minPoints - currentPoints;
}

export function getLevelProgressPercentage(currentPoints: number): number {
  const currentLevel = getLevelByPoints(currentPoints);
  const pointsInLevel = currentPoints - currentLevel.minPoints;
  const levelRange = currentLevel.maxPoints - currentLevel.minPoints + 1;
  return Math.min(Math.round((pointsInLevel / levelRange) * 100), 100);
}

/**
 * Gamification Service
 */
class GamificationService {
  // ==================== POINTS ====================

  /**
   * دریافت خلاصه امتیازات کاربر
   */
  public async getPointSummary(): Promise<{ data: IPointSummary }> {
    try {
      const response = await api.get("/gamification/points/my-summary");
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch point summary:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت امتیازات");
    }
  }

  /**
   * دریافت تراکنش‌های امتیازی
   */
  public async getPointTransactions(limit: number = 20): Promise<{ data: IPointTransaction[] }> {
    try {
      const response = await api.get("/gamification/points/my-transactions", {
        params: { limit },
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch point transactions:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت تراکنش‌ها");
    }
  }

  /**
   * دریافت توزیع امتیازات
   */
  public async getPointsBreakdown(): Promise<{ data: IPointsBreakdown }> {
    try {
      const response = await api.get("/gamification/points/my-breakdown");
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch points breakdown:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت توزیع امتیازات");
    }
  }

  /**
   * دریافت پاداش روزانه
   */
  public async claimDailyBonus(): Promise<{ data: { pointsEarned: number; message: string } }> {
    try {
      const response = await api.post("/gamification/points/daily-bonus");
      return response.data;
    } catch (error: any) {
      console.error("Failed to claim daily bonus:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت پاداش روزانه");
    }
  }

  // ==================== BADGES ====================

  /**
   * دریافت همه نشان‌ها
   */
  public async getAllBadges(): Promise<{ data: IBadge[] }> {
    try {
      const response = await api.get("/gamification/badges");
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch badges:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت نشان‌ها");
    }
  }

  /**
   * دریافت نشان‌های کاربر
   */
  public async getUserBadges(userId?: string): Promise<{ data: IUserBadge[] }> {
    try {
      const url = userId ? `/gamification/users/${userId}/badges` : "/gamification/badges/my-badges";
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch user badges:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت نشان‌های کاربر");
    }
  }

  /**
   * دریافت پیشرفت نشان
   */
  public async getBadgeProgress(badgeId: string): Promise<{ data: { progress: number; threshold: number } }> {
    try {
      const response = await api.get(`/gamification/badges/${badgeId}/progress`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch badge progress:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت پیشرفت نشان");
    }
  }

  /**
   * بررسی نشان‌ها (چک کردن اینکه آیا نشان جدیدی به دست آمده)
   */
  public async checkBadges(): Promise<{ data: { newBadges: IBadge[] } }> {
    try {
      const response = await api.post("/gamification/badges/check");
      return response.data;
    } catch (error: any) {
      console.error("Failed to check badges:", error);
      throw new Error(error.response?.data?.message || "خطا در بررسی نشان‌ها");
    }
  }

  // ==================== LEADERBOARD ====================

  /**
   * دریافت لیدربورد
   */
  public async getLeaderboard(
    category: "points" | "needs_created" | "needs_supported" | "tasks_completed" = "points",
    period: "all_time" | "monthly" | "weekly" | "daily" = "all_time",
    limit: number = 100
  ): Promise<{ data: ILeaderboardResponse }> {
    try {
      const response = await api.get("/gamification/leaderboard", {
        params: { category, period, limit },
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch leaderboard:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت لیدربورد");
    }
  }

  /**
   * دریافت لیدربورد با آمار کامل
   */
  public async getLeaderboardWithStats(
    category: "points" | "needs_created" | "needs_supported" | "tasks_completed" = "points",
    period: "all_time" | "monthly" | "weekly" | "daily" = "all_time",
    limit: number = 100
  ): Promise<{ data: ILeaderboardResponse }> {
    try {
      const response = await api.get("/gamification/leaderboard/enhanced", {
        params: { category, period, limit },
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch enhanced leaderboard:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت لیدربورد");
    }
  }

  // ==================== USER STATS ====================

  /**
   * دریافت آمار کاربر
   */
  public async getUserStats(userId?: string): Promise<{ data: IUserStats }> {
    try {
      const url = userId ? `/gamification/stats/${userId}` : "/gamification/stats/me";
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch user stats:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت آمار کاربر");
    }
  }

  /**
   * دریافت فعالیت‌های اخیر کاربر
   */
  public async getUserActivity(): Promise<{ data: any[] }> {
    try {
      const response = await api.get("/gamification/activity/me");
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch user activity:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت فعالیت‌های کاربر");
    }
  }
}

export const gamificationService = new GamificationService();
