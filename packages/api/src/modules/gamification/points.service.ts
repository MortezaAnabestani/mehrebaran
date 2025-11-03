import { PointTransactionModel } from "./pointTransaction.model";
import { IPointTransaction, PointAction, IUserPointSummary } from "common-types";
import { Types } from "mongoose";
import { POINT_VALUES, getLevelByPoints, getPointsToNextLevel } from "./levels.config";
import { badgeService } from "./badge.service";

class PointsService {
  // Award points to user
  public async awardPoints(
    userId: string,
    action: PointAction,
    options?: {
      points?: number; // Override default points
      description?: string;
      relatedModel?: string;
      relatedId?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<IPointTransaction> {
    const points = options?.points ?? POINT_VALUES[action] ?? 0;

    const transaction = await PointTransactionModel.create({
      user: new Types.ObjectId(userId),
      action,
      points,
      description: options?.description,
      relatedModel: options?.relatedModel,
      relatedId: options?.relatedId,
      metadata: options?.metadata,
    });

    // Check if user leveled up
    const summary = await this.getUserPointSummary(userId);
    const oldLevel = getLevelByPoints(summary.totalPoints - points);
    const newLevel = getLevelByPoints(summary.totalPoints);

    if (newLevel.level > oldLevel.level) {
      // Award level-up bonus
      await this.awardPoints(userId, "level_up", {
        points: newLevel.level * 50,
        description: `ارتقا به سطح ${newLevel.level}: ${newLevel.title}`,
      });
    }

    // Check badge progress
    await badgeService.checkAndAwardBadges(userId);

    return transaction;
  }

  // Deduct points (penalty)
  public async deductPoints(
    userId: string,
    points: number,
    reason: string,
    relatedModel?: string,
    relatedId?: string
  ): Promise<IPointTransaction> {
    return this.awardPoints(userId, "penalty", {
      points: -Math.abs(points),
      description: reason,
      relatedModel,
      relatedId,
    });
  }

  // Get user's total points
  public async getUserTotalPoints(userId: string): Promise<number> {
    const result = await PointTransactionModel.aggregate([
      { $match: { user: new Types.ObjectId(userId) } },
      { $group: { _id: null, totalPoints: { $sum: "$points" } } },
    ]);

    return result.length > 0 ? result[0].totalPoints : 0;
  }

  // Get user point summary
  public async getUserPointSummary(userId: string): Promise<IUserPointSummary> {
    const totalPoints = await this.getUserTotalPoints(userId);
    const currentLevel = getLevelByPoints(totalPoints);
    const pointsToNextLevel = getPointsToNextLevel(totalPoints);

    return {
      userId,
      totalPoints,
      currentLevel: currentLevel.level,
      pointsToNextLevel,
    };
  }

  // Get user's transaction history
  public async getUserTransactions(
    userId: string,
    limit: number = 50,
    skip: number = 0
  ): Promise<IPointTransaction[]> {
    const transactions = await PointTransactionModel.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return transactions;
  }

  // Get transactions by action type
  public async getTransactionsByAction(
    userId: string,
    action: PointAction
  ): Promise<IPointTransaction[]> {
    return PointTransactionModel.find({
      user: userId,
      action,
    }).sort({ createdAt: -1 });
  }

  // Get user's rank (position in leaderboard)
  public async getUserRank(userId: string): Promise<number> {
    // Get all users' total points
    const rankings = await PointTransactionModel.aggregate([
      { $group: { _id: "$user", totalPoints: { $sum: "$points" } } },
      { $sort: { totalPoints: -1 } },
    ]);

    const userRank = rankings.findIndex((r) => r._id.toString() === userId);
    return userRank >= 0 ? userRank + 1 : 0;
  }

  // Get top users (leaderboard)
  public async getLeaderboard(limit: number = 100): Promise<any[]> {
    const leaderboard = await PointTransactionModel.aggregate([
      { $group: { _id: "$user", totalPoints: { $sum: "$points" } } },
      { $sort: { totalPoints: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$_id",
          totalPoints: 1,
          userName: "$user.name",
          userEmail: "$user.email",
        },
      },
    ]);

    return leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      userName: entry.userName,
      userEmail: entry.userEmail,
      totalPoints: entry.totalPoints,
      level: getLevelByPoints(entry.totalPoints).level,
    }));
  }

  // Get points breakdown by action
  public async getPointsBreakdown(userId: string): Promise<Record<string, number>> {
    const breakdown = await PointTransactionModel.aggregate([
      { $match: { user: new Types.ObjectId(userId) } },
      { $group: { _id: "$action", totalPoints: { $sum: "$points" } } },
    ]);

    const result: Record<string, number> = {};
    breakdown.forEach((item) => {
      result[item._id] = item.totalPoints;
    });

    return result;
  }

  // Daily login bonus (check if already awarded today)
  public async awardDailyLoginBonus(userId: string): Promise<IPointTransaction | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already awarded today
    const existingBonus = await PointTransactionModel.findOne({
      user: userId,
      action: "daily_login",
      createdAt: { $gte: today },
    });

    if (existingBonus) {
      return null; // Already awarded today
    }

    return this.awardPoints(userId, "daily_login", {
      description: "جایزه ورود روزانه",
    });
  }
}

export const pointsService = new PointsService();
