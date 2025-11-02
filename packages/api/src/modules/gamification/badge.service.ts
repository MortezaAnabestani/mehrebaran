import { BadgeModel } from "./badge.model";
import { UserBadgeModel } from "./userBadge.model";
import { PointTransactionModel } from "./pointTransaction.model";
import { IBadge, IUserBadge, BadgeCategory, BadgeRarity } from "common-types";
import { Types } from "mongoose";
import ApiError from "../../core/utils/apiError";

class BadgeService {
  // Create a new badge (admin only)
  public async createBadge(badgeData: Partial<IBadge>): Promise<IBadge> {
    const badge = await BadgeModel.create(badgeData);
    return badge;
  }

  // Get all badges
  public async getAllBadges(filters?: {
    category?: BadgeCategory;
    rarity?: BadgeRarity;
    isActive?: boolean;
  }): Promise<IBadge[]> {
    const query: any = {};

    if (filters?.category) query.category = filters.category;
    if (filters?.rarity) query.rarity = filters.rarity;
    if (filters?.isActive !== undefined) query.isActive = filters.isActive;

    const badges = await BadgeModel.find(query).sort({ order: 1, rarity: -1 });
    return badges;
  }

  // Get badge by ID
  public async getBadgeById(badgeId: string): Promise<IBadge | null> {
    return BadgeModel.findById(badgeId);
  }

  // Update badge (admin only)
  public async updateBadge(badgeId: string, updateData: Partial<IBadge>): Promise<IBadge | null> {
    const badge = await BadgeModel.findByIdAndUpdate(badgeId, updateData, { new: true });
    return badge;
  }

  // Delete badge (admin only)
  public async deleteBadge(badgeId: string): Promise<void> {
    await BadgeModel.findByIdAndDelete(badgeId);
  }

  // Award badge to user
  public async awardBadge(userId: string, badgeId: string, metadata?: Record<string, any>): Promise<IUserBadge> {
    // Check if user already has this badge
    const existing = await UserBadgeModel.findOne({
      user: userId,
      badge: badgeId,
    });

    if (existing) {
      throw new ApiError(400, "کاربر قبلاً این نشان را دریافت کرده است.");
    }

    const badge = await this.getBadgeById(badgeId);
    if (!badge) {
      throw new ApiError(404, "نشان یافت نشد.");
    }

    // Award the badge
    const userBadge = await UserBadgeModel.create({
      user: new Types.ObjectId(userId),
      badge: new Types.ObjectId(badgeId),
      earnedAt: new Date(),
      metadata,
    });

    // Award points for earning badge (but don't import pointsService to avoid circular dependency)
    // This will be handled by the caller

    return userBadge.populate("badge");
  }

  // Get user's badges
  public async getUserBadges(userId: string): Promise<IUserBadge[]> {
    const userBadges = await UserBadgeModel.find({ user: userId })
      .populate("badge")
      .sort({ earnedAt: -1 });

    return userBadges;
  }

  // Get user's badge count by rarity
  public async getUserBadgeCountByRarity(userId: string): Promise<Record<BadgeRarity, number>> {
    const userBadges = await UserBadgeModel.find({ user: userId }).populate("badge");

    const counts: Record<BadgeRarity, number> = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };

    userBadges.forEach((ub: any) => {
      if (ub.badge && ub.badge.rarity) {
        counts[ub.badge.rarity as BadgeRarity]++;
      }
    });

    return counts;
  }

  // Check if user qualifies for any badges and award them
  public async checkAndAwardBadges(userId: string): Promise<IUserBadge[]> {
    const allBadges = await this.getAllBadges({ isActive: true });
    const userBadges = await this.getUserBadges(userId);
    const userBadgeIds = userBadges.map((ub: any) => ub.badge._id?.toString() || ub.badge.toString());

    const newBadges: IUserBadge[] = [];

    for (const badge of allBadges) {
      // Skip if user already has this badge
      if (userBadgeIds.includes(badge._id.toString())) continue;

      // Check if user meets all conditions
      const meetsConditions = await this.checkBadgeConditions(userId, badge);

      if (meetsConditions) {
        try {
          const userBadge = await this.awardBadge(userId, badge._id.toString());
          newBadges.push(userBadge);

          // Award points for badge (import inline to avoid circular dependency)
          const { pointsService } = await import("./points.service");
          await pointsService.awardPoints(userId, "badge_earned", {
            points: badge.points,
            description: `دریافت نشان: ${badge.name}`,
            relatedModel: "Badge",
            relatedId: badge._id.toString(),
          });
        } catch (err) {
          // Badge already awarded or error, skip
        }
      }
    }

    return newBadges;
  }

  // Check if user meets badge conditions
  private async checkBadgeConditions(userId: string, badge: IBadge): Promise<boolean> {
    for (const condition of badge.conditions) {
      const met = await this.checkSingleCondition(userId, condition);
      if (!met) return false;
    }
    return true;
  }

  // Check single condition
  private async checkSingleCondition(
    userId: string,
    condition: { type: string; target?: number; action?: string; description: string }
  ): Promise<boolean> {
    switch (condition.type) {
      case "points": {
        // Check total points
        const result = await PointTransactionModel.aggregate([
          { $match: { user: new Types.ObjectId(userId) } },
          { $group: { _id: null, totalPoints: { $sum: "$points" } } },
        ]);
        const totalPoints = result.length > 0 ? result[0].totalPoints : 0;
        return totalPoints >= (condition.target || 0);
      }

      case "count": {
        // Check count of specific action
        if (!condition.action) return false;
        const count = await PointTransactionModel.countDocuments({
          user: userId,
          action: condition.action,
        });
        return count >= (condition.target || 0);
      }

      case "streak": {
        // Check login streak (would need additional logic)
        // For now, return false (implement in future if needed)
        return false;
      }

      case "milestone": {
        // Custom milestone check (implement based on specific requirements)
        return false;
      }

      case "custom": {
        // Custom logic (implement based on specific requirements)
        return false;
      }

      default:
        return false;
    }
  }

  // Get badge progress for user
  public async getBadgeProgress(userId: string, badgeId: string): Promise<any> {
    const badge = await this.getBadgeById(badgeId);
    if (!badge) {
      throw new ApiError(404, "نشان یافت نشد.");
    }

    // Check if user already has badge
    const userBadge = await UserBadgeModel.findOne({
      user: userId,
      badge: badgeId,
    });

    if (userBadge) {
      return {
        badgeId,
        badge: badge.name,
        completed: true,
        earnedAt: userBadge.earnedAt,
        progress: 100,
      };
    }

    // Calculate progress
    const progress: any = {
      badgeId,
      badge: badge.name,
      completed: false,
      conditions: [],
    };

    for (const condition of badge.conditions) {
      const conditionProgress = await this.getConditionProgress(userId, condition);
      progress.conditions.push(conditionProgress);
    }

    // Overall progress
    const totalProgress =
      progress.conditions.reduce((sum: number, c: any) => sum + c.percentage, 0) / progress.conditions.length;
    progress.progress = Math.round(totalProgress);

    return progress;
  }

  // Get condition progress
  private async getConditionProgress(
    userId: string,
    condition: { type: string; target?: number; action?: string; description: string }
  ): Promise<any> {
    const result: any = {
      type: condition.type,
      description: condition.description,
      target: condition.target || 0,
      current: 0,
      percentage: 0,
    };

    switch (condition.type) {
      case "points": {
        const pointsResult = await PointTransactionModel.aggregate([
          { $match: { user: new Types.ObjectId(userId) } },
          { $group: { _id: null, totalPoints: { $sum: "$points" } } },
        ]);
        result.current = pointsResult.length > 0 ? pointsResult[0].totalPoints : 0;
        break;
      }

      case "count": {
        if (condition.action) {
          result.current = await PointTransactionModel.countDocuments({
            user: userId,
            action: condition.action,
          });
        }
        break;
      }

      default:
        break;
    }

    if (result.target > 0) {
      result.percentage = Math.min(100, Math.round((result.current / result.target) * 100));
    }

    return result;
  }
}

export const badgeService = new BadgeService();
