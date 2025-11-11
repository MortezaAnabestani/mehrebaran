import { model, Model } from "mongoose";
import type {
  ILeaderboardEntry,
  ILeaderboardResponse,
  LeaderboardCategory,
  LeaderboardPeriod,
  IUserStats,
} from "common-types";
import { UserStatsModel } from "../gamification/userStats.model";

class LeaderboardService {
  private UserStatsModel: typeof UserStatsModel;

  constructor() {
    this.UserStatsModel = UserStatsModel;
  }

  /**
   * دریافت لیدربورد بر اساس دسته‌بندی و دوره زمانی
   */
  public async getLeaderboard(
    category: LeaderboardCategory,
    period: LeaderboardPeriod = "all_time",
    limit: number = 100,
    userId?: string
  ): Promise<ILeaderboardResponse> {
    console.log(`🔍 LeaderboardService.getLeaderboard - category: ${category}, period: ${period}, limit: ${limit}, userId: ${userId}`);

    // انتخاب فیلد مناسب برای مرتب‌سازی
    const sortField = this.getCategoryField(category);
    console.log(`📊 Sort field: ${sortField}`);

    // فیلتر زمانی (برای دوره‌های غیر از all_time)
    const dateFilter = this.getDateFilter(period);

    let entries: ILeaderboardEntry[];

    if (period === "all_time") {
      // برای all_time از UserStats استفاده می‌کنیم
      const statsCount = await this.UserStatsModel.countDocuments();
      console.log(`📈 Total UserStats in DB: ${statsCount}`);

      const stats = await this.UserStatsModel.find()
        .sort({ [sortField]: -1 })
        .limit(limit)
        .populate("userId", "name email avatar")
        .lean();

      console.log(`✅ Found ${stats.length} stats for leaderboard`);

      entries = stats.map((stat, index) => ({
        user: stat.userId,
        rank: index + 1,
        score: this.getScoreFromStats(stat, category),
        level: stat.currentLevel,
        badge: undefined,
        metadata: {
          totalPoints: stat.totalPoints,
          needsCreated: stat.needsCreated,
          needsSupported: stat.needsSupported,
          badgesCount: stat.badgesCount,
        },
      }));
    } else {
      // برای دوره‌های کوتاه‌تر، از PointTransaction استفاده می‌کنیم
      const PointTransactionModel = model("PointTransaction");
      const UserModel = model("User");

      const transactions = await PointTransactionModel.aggregate([
        {
          $match: {
            createdAt: { $gte: dateFilter },
          },
        },
        {
          $group: {
            _id: "$user",
            totalPoints: { $sum: "$points" },
            transactionCount: { $sum: 1 },
          },
        },
        {
          $sort: { totalPoints: -1 },
        },
        {
          $limit: limit,
        },
      ]);

      // Populate user info
      const userIds = transactions.map((t) => t._id);
      const users = await UserModel.find({ _id: { $in: userIds } })
        .select("name email avatar")
        .lean();

      const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

      entries = transactions.map((t, index) => ({
        user: userMap.get(t._id.toString()) || t._id,
        rank: index + 1,
        score: t.totalPoints,
        metadata: {
          transactionCount: t.transactionCount,
          period,
        },
      }));
    }

    // دریافت تعداد کل کاربران
    const totalUsers = await this.UserStatsModel.countDocuments();

    // دریافت رتبه کاربر فعلی (اگر userId داده شده باشد)
    let userEntry: ILeaderboardEntry | undefined;
    if (userId) {
      userEntry = await this.getUserRank(userId, category, period);
    }

    return {
      category,
      period,
      entries,
      totalUsers,
      totalParticipants: totalUsers, // Alias for frontend compatibility
      lastUpdated: new Date(),
      userEntry,
    };
  }

  /**
   * دریافت رتبه یک کاربر خاص
   */
  public async getUserRank(
    userId: string,
    category: LeaderboardCategory,
    period: LeaderboardPeriod = "all_time"
  ): Promise<ILeaderboardEntry | undefined> {
    const sortField = this.getCategoryField(category);
    const UserModel = model("User");

    if (period === "all_time") {
      // دریافت stats کاربر
      const userStats = await this.UserStatsModel.findOne({ userId })
        .populate("userId", "name email avatar")
        .lean();

      if (!userStats) return undefined;

      const userScore = this.getScoreFromStats(userStats, category);

      // محاسبه رتبه (تعداد کاربرانی که امتیاز بیشتری دارند + 1)
      const rank =
        (await this.UserStatsModel.countDocuments({
          [sortField]: { $gt: userScore },
        })) + 1;

      return {
        user: userStats.userId,
        rank,
        score: userScore,
        level: userStats.currentLevel,
        metadata: {
          totalPoints: userStats.totalPoints,
          needsCreated: userStats.needsCreated,
          needsSupported: userStats.needsSupported,
          badgesCount: userStats.badgesCount,
        },
      };
    } else {
      // برای دوره‌های کوتاه‌تر
      const dateFilter = this.getDateFilter(period);
      const PointTransactionModel = model("PointTransaction");

      const userPoints = await PointTransactionModel.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: dateFilter },
          },
        },
        {
          $group: {
            _id: null,
            totalPoints: { $sum: "$points" },
          },
        },
      ]);

      if (!userPoints.length) return undefined;

      const userScore = userPoints[0].totalPoints;

      // محاسبه رتبه
      const higherScores = await PointTransactionModel.aggregate([
        {
          $match: {
            createdAt: { $gte: dateFilter },
          },
        },
        {
          $group: {
            _id: "$user",
            totalPoints: { $sum: "$points" },
          },
        },
        {
          $match: {
            totalPoints: { $gt: userScore },
          },
        },
        {
          $count: "count",
        },
      ]);

      const rank = higherScores.length ? higherScores[0].count + 1 : 1;

      const user = await UserModel.findById(userId).select("name email avatar").lean();

      return {
        user: (user as any) || userId,
        rank,
        score: userScore,
        metadata: {
          period,
        },
      };
    }
  }

  /**
   * دریافت کاربران اطراف یک کاربر در رتبه‌بندی
   */
  public async getNearbyUsers(
    userId: string,
    category: LeaderboardCategory,
    period: LeaderboardPeriod = "all_time",
    range: number = 5
  ): Promise<ILeaderboardEntry[]> {
    const userEntry = await this.getUserRank(userId, category, period);
    if (!userEntry) return [];

    const userRank = userEntry.rank;
    const startRank = Math.max(1, userRank - range);
    const endRank = userRank + range;

    const leaderboard = await this.getLeaderboard(category, period, endRank);

    return leaderboard.entries.filter(
      (entry: ILeaderboardEntry) => entry.rank >= startRank && entry.rank <= endRank
    );
  }

  /**
   * دریافت top N کاربر
   */
  public async getTopUsers(
    category: LeaderboardCategory,
    period: LeaderboardPeriod = "all_time",
    limit: number = 10
  ): Promise<ILeaderboardEntry[]> {
    const leaderboard = await this.getLeaderboard(category, period, limit);
    return leaderboard.entries;
  }

  /**
   * محاسبه تغییرات رتبه (مقایسه با دوره قبل)
   */
  public async calculateRankChanges(
    category: LeaderboardCategory,
    currentPeriod: LeaderboardPeriod = "weekly"
  ): Promise<ILeaderboardEntry[]> {
    // این متد نیاز به ذخیره‌سازی snapshot‌های قبلی دارد
    // برای سادگی، فعلاً فقط رتبه فعلی را برمی‌گردانیم
    // در پیاده‌سازی واقعی، باید snapshot‌ها را در دیتابیس ذخیره کنیم
    const currentLeaderboard = await this.getLeaderboard(category, currentPeriod, 100);

    return currentLeaderboard.entries.map((entry: ILeaderboardEntry) => ({
      ...entry,
      previousRank: entry.rank, // TODO: دریافت از snapshot قبلی
      rankChange: 0, // TODO: محاسبه از تفاوت رتبه‌ها
    }));
  }

  /**
   * دریافت فیلد مناسب برای هر دسته‌بندی
   */
  private getCategoryField(category: LeaderboardCategory): string {
    const fieldMap: Record<LeaderboardCategory, string> = {
      points: "totalPoints",
      contributions: "totalContributions",
      needs_created: "needsCreated",
      needs_supported: "needsSupported",
      badges: "badgesCount",
      level: "currentLevel",
      tasks_completed: "tasksCompleted",
      teams_created: "teamsCreated",
    };

    return fieldMap[category] || "totalPoints";
  }

  /**
   * دریافت امتیاز از stats بر اساس دسته‌بندی
   */
  private getScoreFromStats(stats: any, category: LeaderboardCategory): number {
    const field = this.getCategoryField(category);
    return stats[field] || 0;
  }

  /**
   * دریافت فیلتر تاریخ بر اساس دوره
   */
  private getDateFilter(period: LeaderboardPeriod): Date {
    const now = new Date();

    switch (period) {
      case "daily":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "weekly":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "monthly":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "all_time":
      default:
        return new Date(0); // از ابتدای زمان
    }
  }

  /**
   * دریافت لیدربورد چند دسته‌بندی به صورت همزمان
   */
  public async getMultipleCategoryLeaderboards(
    categories: LeaderboardCategory[],
    period: LeaderboardPeriod = "all_time",
    limit: number = 10
  ): Promise<Record<LeaderboardCategory, ILeaderboardResponse>> {
    const results: Record<string, ILeaderboardResponse> = {};

    await Promise.all(
      categories.map(async (category) => {
        results[category] = await this.getLeaderboard(category, period, limit);
      })
    );

    return results;
  }
}

export const leaderboardService = new LeaderboardService();
