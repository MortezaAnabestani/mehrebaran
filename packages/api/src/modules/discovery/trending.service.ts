import { model, Model } from "mongoose";
import type {
  INeed,
  ITrendingNeed,
  ITrendingUser,
  ITrendingTag,
  ITrendingScore,
  TrendingPeriod,
} from "common-types";

class TrendingService {
  private NeedModel: Model<INeed>;

  constructor() {
    this.NeedModel = model("Need") as any;
  }

  /**
   * دریافت نیازهای ترندینگ
   */
  public async getTrendingNeeds(
    period: TrendingPeriod = "24h",
    limit: number = 20
  ): Promise<ITrendingNeed[]> {
    const dateFilter = this.getDateFilter(period);

    // دریافت نیازها با اطلاعات تعاملات
    const needs = await this.NeedModel.aggregate([
      {
        $match: {
          status: { $in: ["active", "in_progress"] },
          createdAt: { $gte: dateFilter },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "need",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "sharelogs",
          localField: "_id",
          foreignField: "sharedItem",
          as: "shares",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followedNeed",
          as: "follows",
        },
      },
      {
        $addFields: {
          viewsCount: { $ifNull: ["$viewsCount", 0] },
          commentsCount: { $size: "$comments" },
          sharesCount: { $size: "$shares" },
          followsCount: { $size: "$follows" },
          supportsCount: { $size: { $ifNull: ["$supporters", []] } },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          tags: 1,
          images: 1,
          status: 1,
          priority: 1,
          location: 1,
          createdBy: 1,
          createdAt: 1,
          viewsCount: 1,
          commentsCount: 1,
          sharesCount: 1,
          followsCount: 1,
          supportsCount: 1,
        },
      },
    ]);

    // محاسبه امتیاز ترندینگ برای هر نیاز
    const needsWithScores = await Promise.all(
      needs.map(async (need) => {
        const trendingScore = await this.calculateTrendingScore(
          need._id.toString(),
          period,
          need.viewsCount || 0,
          need.commentsCount + need.sharesCount + need.supportsCount + need.followsCount
        );

        return {
          ...need,
          trendingScore,
        };
      })
    );

    // مرتب‌سازی بر اساس امتیاز ترندینگ
    needsWithScores.sort((a, b) => b.trendingScore.totalScore - a.trendingScore.totalScore);

    // اضافه کردن رتبه و محدود کردن تعداد
    const trendingNeeds: ITrendingNeed[] = needsWithScores.slice(0, limit).map((need, index) => ({
      ...need,
      rank: index + 1,
    })) as ITrendingNeed[];

    // Populate fields
    await this.NeedModel.populate(trendingNeeds, [
      { path: "createdBy", select: "name email avatar" },
      { path: "category", select: "name slug" },
    ]);

    return trendingNeeds;
  }

  /**
   * دریافت کاربران ترندینگ
   */
  public async getTrendingUsers(
    period: TrendingPeriod = "24h",
    limit: number = 20
  ): Promise<ITrendingUser[]> {
    const dateFilter = this.getDateFilter(period);
    const UserModel = model("User");
    const PointTransactionModel = model("PointTransaction");

    // دریافت کاربران با بیشترین فعالیت در دوره
    const users = await PointTransactionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateFilter },
        },
      },
      {
        $group: {
          _id: "$user",
          pointsEarned: { $sum: "$points" },
          transactionCount: { $sum: 1 },
        },
      },
      {
        $sort: { pointsEarned: -1 },
      },
      {
        $limit: limit * 2, // دریافت بیشتر برای محاسبات بعدی
      },
    ]);

    // دریافت اطلاعات تکمیلی کاربران
    const userIds = users.map((u) => u._id);

    const needsCreated = await this.NeedModel.aggregate([
      {
        $match: {
          createdBy: { $in: userIds },
          createdAt: { $gte: dateFilter },
        },
      },
      {
        $group: {
          _id: "$createdBy",
          count: { $sum: 1 },
        },
      },
    ]);

    const needsCreatedMap = new Map(needsCreated.map((n) => [n._id.toString(), n.count]));

    // محاسبه contributions (تعداد تعاملات)
    const contributions = await PointTransactionModel.aggregate([
      {
        $match: {
          user: { $in: userIds },
          createdAt: { $gte: dateFilter },
          action: {
            $in: [
              "need_support",
              "task_completed",
              "comment_posted",
              "message_sent",
              "team_joined",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
        },
      },
    ]);

    const contributionsMap = new Map(contributions.map((c) => [c._id.toString(), c.count]));

    // ساخت ITrendingUser objects
    const trendingUsers = await Promise.all(
      users.map(async (u) => {
        const userId = u._id.toString();
        const needsCreatedCount = needsCreatedMap.get(userId) || 0;
        const contributionsCount = contributionsMap.get(userId) || 0;

        const trendingScore = await this.calculateUserTrendingScore(
          u.pointsEarned,
          needsCreatedCount,
          contributionsCount,
          period
        );

        return {
          user: u._id,
          trendingScore,
          rank: 0, // خواهد شد پر
          recentActivity: {
            needsCreated: needsCreatedCount,
            contributions: contributionsCount,
            pointsEarned: u.pointsEarned,
          },
        };
      })
    );

    // مرتب‌سازی بر اساس امتیاز
    trendingUsers.sort((a, b) => b.trendingScore.totalScore - a.trendingScore.totalScore);

    // اضافه کردن رتبه و محدود کردن
    const result = trendingUsers.slice(0, limit).map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    // Populate user info
    await UserModel.populate(result, {
      path: "user",
      select: "name email avatar bio",
    });

    return result;
  }

  /**
   * دریافت تگ‌های ترندینگ
   */
  public async getTrendingTags(
    period: TrendingPeriod = "7d",
    limit: number = 20
  ): Promise<ITrendingTag[]> {
    const dateFilter = this.getDateFilter(period);
    const previousDateFilter = this.getPreviousDateFilter(period);
    const TagUsageModel = model("TagUsage");

    // دریافت تگ‌های استفاده شده در دوره فعلی
    const currentUsage = await TagUsageModel.find({
      lastUsedAt: { $gte: dateFilter },
    })
      .select("tag normalizedTag usageCount lastUsedAt relatedNeeds")
      .lean();

    // دریافت تگ‌های استفاده شده در دوره قبلی (برای محاسبه growth rate)
    const previousUsage = await TagUsageModel.find({
      lastUsedAt: { $gte: previousDateFilter, $lt: dateFilter },
    })
      .select("normalizedTag usageCount")
      .lean();

    const previousUsageMap = new Map(
      previousUsage.map((t: any) => [t.normalizedTag, t.usageCount])
    );

    // محاسبه growth rate و ساخت ITrendingTag objects
    const trendingTags: ITrendingTag[] = currentUsage.map((tag: any) => {
      const previousCount = previousUsageMap.get(tag.normalizedTag) || 0;
      const currentCount = tag.usageCount;
      const growthRate =
        previousCount > 0 ? ((currentCount - previousCount) / previousCount) * 100 : 100;

      return {
        tag: tag.normalizedTag,
        displayTag: tag.tag,
        usageCount: currentCount,
        growthRate,
        rank: 0, // خواهد شد پر
        relatedNeedsCount: tag.relatedNeeds.length,
      };
    });

    // مرتب‌سازی بر اساس ترکیب usageCount و growthRate
    trendingTags.sort((a, b) => {
      const scoreA = a.usageCount * (1 + a.growthRate / 100);
      const scoreB = b.usageCount * (1 + b.growthRate / 100);
      return scoreB - scoreA;
    });

    // اضافه کردن رتبه و محدود کردن
    return trendingTags.slice(0, limit).map((tag, index) => ({
      ...tag,
      rank: index + 1,
    }));
  }

  /**
   * محاسبه امتیاز ترندینگ برای نیاز
   */
  private async calculateTrendingScore(
    needId: string,
    period: TrendingPeriod,
    views: number,
    interactions: number
  ): Promise<ITrendingScore> {
    // محاسبه momentum (سرعت رشد)
    const previousPeriodViews = await this.getPreviousPeriodMetric(needId, period, "views");
    const previousPeriodInteractions = await this.getPreviousPeriodMetric(
      needId,
      period,
      "interactions"
    );

    const viewsMomentum =
      previousPeriodViews > 0 ? (views - previousPeriodViews) / previousPeriodViews : 1;
    const interactionsMomentum =
      previousPeriodInteractions > 0
        ? (interactions - previousPeriodInteractions) / previousPeriodInteractions
        : 1;

    const momentum = (viewsMomentum + interactionsMomentum) / 2;

    // محاسبه recency (نرمال‌سازی شده بین 0 و 1)
    const need = await this.NeedModel.findById(needId).select("createdAt").lean();
    const ageInHours = need
      ? (Date.now() - new Date(need.createdAt).getTime()) / (1000 * 60 * 60)
      : 0;
    const maxAgeInHours = this.getPeriodInHours(period);
    const recency = Math.max(0, 1 - ageInHours / maxAgeInHours);

    // محاسبه امتیاز کل (وزن‌دار)
    const totalScore =
      views * 0.2 + interactions * 0.4 + momentum * 100 * 0.3 + recency * 100 * 0.1;

    return {
      views,
      interactions,
      momentum: Math.round(momentum * 100) / 100,
      recency: Math.round(recency * 100) / 100,
      totalScore: Math.round(totalScore * 100) / 100,
    };
  }

  /**
   * محاسبه امتیاز ترندینگ برای کاربر
   */
  private async calculateUserTrendingScore(
    pointsEarned: number,
    needsCreated: number,
    contributions: number,
    period: TrendingPeriod
  ): Promise<ITrendingScore> {
    // برای کاربران، از pointsEarned به عنوان views و contributions به عنوان interactions استفاده می‌کنیم
    const views = pointsEarned;
    const interactions = needsCreated * 10 + contributions * 5; // وزن‌دهی

    // momentum و recency برای کاربران کمتر اهمیت دارند
    const momentum = 0.5; // مقدار میانگین
    const recency = 0.7; // کاربران فعال معمولاً recency بالایی دارند

    const totalScore =
      views * 0.3 + interactions * 0.5 + momentum * 100 * 0.1 + recency * 100 * 0.1;

    return {
      views,
      interactions,
      momentum,
      recency,
      totalScore: Math.round(totalScore * 100) / 100,
    };
  }

  /**
   * دریافت metric دوره قبل (برای محاسبه momentum)
   */
  private async getPreviousPeriodMetric(
    needId: string,
    period: TrendingPeriod,
    metric: "views" | "interactions"
  ): Promise<number> {
    // این متد نیاز به ذخیره‌سازی metrics در دیتابیس دارد
    // برای سادگی، فعلاً 0 برمی‌گردانیم
    // در پیاده‌سازی واقعی، باید metrics را به صورت time-series ذخیره کنیم
    return 0;
  }

  /**
   * دریافت فیلتر تاریخ بر اساس دوره
   */
  private getDateFilter(period: TrendingPeriod): Date {
    const now = new Date();
    const hours = this.getPeriodInHours(period);
    return new Date(now.getTime() - hours * 60 * 60 * 1000);
  }

  /**
   * دریافت فیلتر تاریخ دوره قبل
   */
  private getPreviousDateFilter(period: TrendingPeriod): Date {
    const now = new Date();
    const hours = this.getPeriodInHours(period);
    return new Date(now.getTime() - 2 * hours * 60 * 60 * 1000);
  }

  /**
   * تبدیل دوره به ساعت
   */
  private getPeriodInHours(period: TrendingPeriod): number {
    switch (period) {
      case "1h":
        return 1;
      case "6h":
        return 6;
      case "24h":
        return 24;
      case "7d":
        return 24 * 7;
      case "30d":
        return 24 * 30;
      default:
        return 24;
    }
  }

  /**
   * دریافت همه trending items به صورت همزمان
   */
  public async getAllTrending(period: TrendingPeriod = "24h") {
    const [needs, users, tags] = await Promise.all([
      this.getTrendingNeeds(period, 10),
      this.getTrendingUsers(period, 10),
      this.getTrendingTags(period, 10),
    ]);

    return {
      needs,
      users,
      tags,
      period,
      lastUpdated: new Date(),
    };
  }
}

export const trendingService = new TrendingService();
