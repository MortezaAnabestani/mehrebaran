import { Request, Response } from "express";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";
import { leaderboardService } from "./leaderboard.service";
import { trendingService } from "./trending.service";
import { recommendationsService } from "./recommendations.service";
import type {
  LeaderboardCategory,
  LeaderboardPeriod,
  TrendingPeriod,
  RecommendationStrategy,
} from "common-types";

class DiscoveryController {
  // ============= Leaderboard Endpoints =============

  /**
   * GET /api/v1/discovery/leaderboard
   * دریافت لیدربورد بر اساس دسته‌بندی و دوره
   */
  public getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
    const category = (req.query.category as LeaderboardCategory) || "points";
    const period = (req.query.period as LeaderboardPeriod) || "all_time";
    const limit = parseInt(req.query.limit as string) || 100;
    const userId = (req as any).user?.id;

    const leaderboard = await leaderboardService.getLeaderboard(category, period, limit, userId);

    res.status(200).json({
      message: "لیدربورد با موفقیت دریافت شد.",
      data: leaderboard,
    });
  });

  /**
   * GET /api/v1/discovery/leaderboard/me
   * دریافت رتبه کاربر فعلی
   */
  public getMyRank = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const category = (req.query.category as LeaderboardCategory) || "points";
    const period = (req.query.period as LeaderboardPeriod) || "all_time";

    const rank = await leaderboardService.getUserRank(userId, category, period);

    if (!rank) {
      throw new ApiError(404, "رتبه شما یافت نشد.");
    }

    res.status(200).json({ message: "رتبه شما با موفقیت دریافت شد.", data: rank });
  });

  /**
   * GET /api/v1/discovery/leaderboard/user/:userId
   * دریافت رتبه یک کاربر خاص
   */
  public getUserRank = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const category = (req.query.category as LeaderboardCategory) || "points";
    const period = (req.query.period as LeaderboardPeriod) || "all_time";

    const rank = await leaderboardService.getUserRank(userId, category, period);

    if (!rank) {
      throw new ApiError(404, "رتبه کاربر یافت نشد.");
    }

    res.status(200).json({ message: "رتبه کاربر با موفقیت دریافت شد.", data: rank });
  });

  /**
   * GET /api/v1/discovery/leaderboard/nearby
   * دریافت کاربران اطراف در رتبه‌بندی
   */
  public getNearbyUsers = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const category = (req.query.category as LeaderboardCategory) || "points";
    const period = (req.query.period as LeaderboardPeriod) || "all_time";
    const range = parseInt(req.query.range as string) || 5;

    const nearbyUsers = await leaderboardService.getNearbyUsers(userId, category, period, range);

    res.status(200).json({ message: "کاربران اطراف با موفقیت دریافت شدند.", data: nearbyUsers });
  });

  /**
   * GET /api/v1/discovery/leaderboard/top
   * دریافت top کاربران
   */
  public getTopUsers = asyncHandler(async (req: Request, res: Response) => {
    const category = (req.query.category as LeaderboardCategory) || "points";
    const period = (req.query.period as LeaderboardPeriod) || "all_time";
    const limit = parseInt(req.query.limit as string) || 10;

    const topUsers = await leaderboardService.getTopUsers(category, period, limit);

    res.status(200).json({ message: "کاربران برتر با موفقیت دریافت شدند.", data: topUsers });
  });

  /**
   * GET /api/v1/discovery/leaderboard/multiple
   * دریافت لیدربورد چند دسته‌بندی
   */
  public getMultipleCategoryLeaderboards = asyncHandler(async (req: Request, res: Response) => {
    const categoriesParam = req.query.categories as string;
    const categories = categoriesParam
      ? categoriesParam.split(",").map((c) => c.trim() as LeaderboardCategory)
      : (["points", "contributions", "needs_created"] as LeaderboardCategory[]);

    const period = (req.query.period as LeaderboardPeriod) || "all_time";
    const limit = parseInt(req.query.limit as string) || 10;

    const leaderboards = await leaderboardService.getMultipleCategoryLeaderboards(
      categories,
      period,
      limit
    );

    res.status(200).json({ message: "لیدربوردها با موفقیت دریافت شدند.", data: leaderboards });
  });

  // ============= Trending Endpoints =============

  /**
   * GET /api/v1/discovery/trending/needs
   * دریافت نیازهای ترندینگ
   */
  public getTrendingNeeds = asyncHandler(async (req: Request, res: Response) => {
    const period = (req.query.period as TrendingPeriod) || "24h";
    const limit = parseInt(req.query.limit as string) || 20;

    const trendingNeeds = await trendingService.getTrendingNeeds(period, limit);

    res.status(200).json({ message: "نیازهای ترندینگ با موفقیت دریافت شدند.", data: trendingNeeds });
  });

  /**
   * GET /api/v1/discovery/trending/users
   * دریافت کاربران ترندینگ
   */
  public getTrendingUsers = asyncHandler(async (req: Request, res: Response) => {
    const period = (req.query.period as TrendingPeriod) || "24h";
    const limit = parseInt(req.query.limit as string) || 20;

    const trendingUsers = await trendingService.getTrendingUsers(period, limit);

    res.status(200).json({ message: "کاربران ترندینگ با موفقیت دریافت شدند.", data: trendingUsers });
  });

  /**
   * GET /api/v1/discovery/trending/tags
   * دریافت تگ‌های ترندینگ
   */
  public getTrendingTags = asyncHandler(async (req: Request, res: Response) => {
    const period = (req.query.period as TrendingPeriod) || "7d";
    const limit = parseInt(req.query.limit as string) || 20;

    const trendingTags = await trendingService.getTrendingTags(period, limit);

    res.status(200).json({ message: "تگ‌های ترندینگ با موفقیت دریافت شدند.", data: trendingTags });
  });

  /**
   * GET /api/v1/discovery/trending/all
   * دریافت همه موارد ترندینگ
   */
  public getAllTrending = asyncHandler(async (req: Request, res: Response) => {
    const period = (req.query.period as TrendingPeriod) || "24h";

    const allTrending = await trendingService.getAllTrending(period);

    res.status(200).json({ message: "موارد ترندینگ با موفقیت دریافت شدند.", data: allTrending });
  });

  // ============= Recommendations Endpoints =============

  /**
   * GET /api/v1/discovery/recommendations/needs
   * توصیه نیازها به کاربر
   */
  public recommendNeeds = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const strategy = (req.query.strategy as RecommendationStrategy) || "hybrid";
    const limit = parseInt(req.query.limit as string) || 20;

    const recommendations = await recommendationsService.recommendNeeds(userId, strategy, limit);

    // Extract only the items from recommendations
    const needs = recommendations.map((rec) => rec.item);

    res.status(200).json({ message: "نیازهای پیشنهادی با موفقیت دریافت شدند.", data: needs });
  });

  /**
   * GET /api/v1/discovery/recommendations/users
   * توصیه کاربران
   */
  public recommendUsers = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 20;

    const recommendations = await recommendationsService.recommendUsers(userId, limit);

    // Extract only the items from recommendations
    const users = recommendations.map((rec) => rec.item);

    res.status(200).json({ message: "کاربران پیشنهادی با موفقیت دریافت شدند.", data: users });
  });

  /**
   * GET /api/v1/discovery/recommendations/teams
   * توصیه تیم‌ها
   */
  public recommendTeams = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 20;

    const recommendations = await recommendationsService.recommendTeams(userId, limit);

    // Extract only the items from recommendations
    const teams = recommendations.map((rec) => rec.item);

    res.status(200).json({ message: "تیم‌های پیشنهادی با موفقیت دریافت شدند.", data: teams });
  });

  /**
   * GET /api/v1/discovery/recommendations/personalized
   * دریافت توصیه‌های شخصی‌سازی شده (همه موارد)
   */
  public getPersonalizedRecommendations = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const recommendations = await recommendationsService.getPersonalizedRecommendations(userId);

    res.status(200).json({ message: "توصیه‌های شخصی با موفقیت دریافت شدند.", data: recommendations });
  });

  /**
   * GET /api/v1/discovery/recommendations/preferences
   * دریافت ترجیحات کاربر
   */
  public getUserPreferences = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const preferences = await recommendationsService.getUserPreferences(userId);

    res.status(200).json({ message: "ترجیحات شما با موفقیت دریافت شد.", data: preferences });
  });

  // ============= Combined/Discovery Endpoints =============

  /**
   * GET /api/v1/discovery/feed
   * دریافت فید شخصی‌سازی شده (ترکیب trending و recommendations)
   */
  public getPersonalizedFeed = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    if (!userId) {
      // برای کاربران مهمان، فقط trending را نمایش می‌دهیم
      const trending = await trendingService.getAllTrending("24h");
      return res.status(200).json({
        message: "فید با موفقیت دریافت شد.",
        data: { trending, recommendations: null },
      });
    }

    // برای کاربران احراز هویت شده، ترکیب trending و recommendations
    const [trending, recommendations] = await Promise.all([
      trendingService.getAllTrending("24h"),
      recommendationsService.getPersonalizedRecommendations(userId),
    ]);

    res.status(200).json({
      message: "فید شخصی با موفقیت دریافت شد.",
      data: {
        trending,
        recommendations,
      },
    });
  });

  /**
   * GET /api/v1/discovery/stats
   * دریافت آمار کلی discovery
   */
  public getDiscoveryStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    // آمار عمومی
    const stats: any = {
      trending: {
        needsCount: 20,
        usersCount: 20,
        tagsCount: 20,
      },
      leaderboard: {
        totalUsers: 0,
        categories: 8,
      },
    };

    if (userId) {
      // آمار شخصی کاربر
      const [rank, preferences] = await Promise.all([
        leaderboardService.getUserRank(userId, "points", "all_time"),
        recommendationsService.getUserPreferences(userId),
      ]);

      stats.user = {
        rank: rank?.rank,
        score: rank?.score,
        preferences: {
          favoriteCategoriesCount: preferences.favoriteCategories.length,
          favoriteTagsCount: preferences.favoriteTags.length,
          interactedNeedsCount: preferences.interactedNeeds.length,
        },
      };
    }

    res.status(200).json({ message: "آمار با موفقیت دریافت شد.", data: stats });
  });
}

export const discoveryController = new DiscoveryController();
