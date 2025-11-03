import { Request, Response } from "express";
import { pointsService } from "./points.service";
import { badgeService } from "./badge.service";
import { userStatsService } from "./userStats.service";
import {
  createBadgeSchema,
  updateBadgeSchema,
  awardPointsSchema,
  deductPointsSchema,
} from "./gamification.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";
import { PointAction } from "common-types";

class GamificationController {
  // ==================== POINTS ====================

  // Get user's point summary
  public getPointSummary = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const summary = await pointsService.getUserPointSummary(userId);

    res.status(200).json({
      data: summary,
    });
  });

  // Get user's point transactions
  public getPointTransactions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

    const transactions = await pointsService.getUserTransactions(userId, limit, skip);

    res.status(200).json({
      results: transactions.length,
      data: transactions,
    });
  });

  // Get points breakdown
  public getPointsBreakdown = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const breakdown = await pointsService.getPointsBreakdown(userId);

    res.status(200).json({
      data: breakdown,
    });
  });

  // Award points (admin only)
  public awardPoints = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = awardPointsSchema.parse({ body: req.body });
    const { userId, action, points, description, relatedModel, relatedId } = validatedData.body;

    const transaction = await pointsService.awardPoints(userId, action, {
      points,
      description,
      relatedModel,
      relatedId,
    });

    res.status(201).json({
      message: "امتیاز با موفقیت اعطا شد.",
      data: transaction,
    });
  });

  // Deduct points (admin only)
  public deductPoints = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = deductPointsSchema.parse({ body: req.body });
    const { userId, points, reason, relatedModel, relatedId } = validatedData.body;

    const transaction = await pointsService.deductPoints(userId, points, reason, relatedModel, relatedId);

    res.status(201).json({
      message: "امتیاز با موفقیت کسر شد.",
      data: transaction,
    });
  });

  // Get leaderboard
  public getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const leaderboard = await pointsService.getLeaderboard(limit);

    res.status(200).json({
      results: leaderboard.length,
      data: leaderboard,
    });
  });

  // Daily login bonus
  public claimDailyBonus = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const bonus = await pointsService.awardDailyLoginBonus(userId);

    if (!bonus) {
      throw new ApiError(400, "شما امروز جایزه ورود روزانه را دریافت کرده‌اید.");
    }

    res.status(200).json({
      message: "جایزه ورود روزانه با موفقیت دریافت شد.",
      data: bonus,
    });
  });

  // ==================== BADGES ====================

  // Get all badges
  public getAllBadges = asyncHandler(async (req: Request, res: Response) => {
    const { category, rarity, isActive } = req.query;

    const badges = await badgeService.getAllBadges({
      category: category as any,
      rarity: rarity as any,
      isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
    });

    res.status(200).json({
      results: badges.length,
      data: badges,
    });
  });

  // Get badge by ID
  public getBadgeById = asyncHandler(async (req: Request, res: Response) => {
    const { badgeId } = req.params;
    const badge = await badgeService.getBadgeById(badgeId);

    if (!badge) {
      throw new ApiError(404, "نشان یافت نشد.");
    }

    res.status(200).json({
      data: badge,
    });
  });

  // Create badge (admin only)
  public createBadge = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createBadgeSchema.parse({ body: req.body });
    const badge = await badgeService.createBadge(validatedData.body);

    res.status(201).json({
      message: "نشان با موفقیت ایجاد شد.",
      data: badge,
    });
  });

  // Update badge (admin only)
  public updateBadge = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateBadgeSchema.parse({ body: req.body, params: req.params });
    const { badgeId } = validatedData.params;

    const badge = await badgeService.updateBadge(badgeId, validatedData.body);

    if (!badge) {
      throw new ApiError(404, "نشان یافت نشد.");
    }

    res.status(200).json({
      message: "نشان با موفقیت به‌روزرسانی شد.",
      data: badge,
    });
  });

  // Delete badge (admin only)
  public deleteBadge = asyncHandler(async (req: Request, res: Response) => {
    const { badgeId } = req.params;
    await badgeService.deleteBadge(badgeId);

    res.status(200).json({
      message: "نشان با موفقیت حذف شد.",
    });
  });

  // Get user's badges
  public getUserBadges = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId || req.user!._id.toString();
    const badges = await badgeService.getUserBadges(userId);

    res.status(200).json({
      results: badges.length,
      data: badges,
    });
  });

  // Get badge progress
  public getBadgeProgress = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { badgeId } = req.params;

    const progress = await badgeService.getBadgeProgress(userId, badgeId);

    res.status(200).json({
      data: progress,
    });
  });

  // Check and award badges (manual trigger)
  public checkBadges = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const newBadges = await badgeService.checkAndAwardBadges(userId);

    res.status(200).json({
      message: `${newBadges.length} نشان جدید دریافت کردید.`,
      data: newBadges,
    });
  });

  // ==================== USER STATS & PROFILE ====================

  // Get user's comprehensive stats
  public getUserStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId || req.user!._id.toString();
    const stats = await userStatsService.getUserStats(userId);

    res.status(200).json({
      data: stats,
    });
  });

  // Get user's activity summary
  public getUserActivity = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const days = req.query.days ? parseInt(req.query.days as string) : 30;

    const activity = await userStatsService.getUserActivitySummary(userId, days);

    res.status(200).json({
      data: activity,
    });
  });

  // Get enhanced leaderboard with stats
  public getLeaderboardWithStats = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const leaderboard = await userStatsService.getLeaderboardWithStats(limit);

    res.status(200).json({
      results: leaderboard.length,
      data: leaderboard,
    });
  });
}

export const gamificationController = new GamificationController();
