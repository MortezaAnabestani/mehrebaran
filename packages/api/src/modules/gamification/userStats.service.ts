import { IUserStats } from "common-types";
import { Types } from "mongoose";
import { pointsService } from "./points.service";
import { badgeService } from "./badge.service";
import { getLevelByPoints } from "./levels.config";
import { UserStatsModel } from "./userStats.model";

// Import models from other modules
import { model } from "mongoose";

class UserStatsService {
  // Get comprehensive user statistics
  public async getUserStats(userId: string): Promise<IUserStats> {
    // Get points summary
    const pointsSummary = await pointsService.getUserPointSummary(userId);

    // Get badge counts
    const badgeCounts = await badgeService.getUserBadgeCountByRarity(userId);
    const totalBadges =
      badgeCounts.common + badgeCounts.rare + badgeCounts.epic + badgeCounts.legendary;

    // Get needs statistics
    const NeedModel = model("Need");
    const needsCreated = await NeedModel.countDocuments({ "submittedBy.user": userId });
    const needsSupported = await NeedModel.countDocuments({ supporters: userId });
    const needsCompleted = await NeedModel.countDocuments({
      "submittedBy.user": userId,
      status: "completed",
    });

    // Get upvotes count
    const needsUpvoted = await NeedModel.countDocuments({ upvotes: userId });

    // Get tasks statistics
    const TaskModel = model("Need"); // Tasks are embedded in Need
    const tasksData = await NeedModel.aggregate([
      { $unwind: "$tasks" },
      {
        $match: {
          "tasks.assignedTo": new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$tasks.status", "completed"] }, 1, 0] },
          },
        },
      },
    ]);

    const tasksAssigned = tasksData.length > 0 ? tasksData[0].totalTasks : 0;
    const tasksCompleted = tasksData.length > 0 ? tasksData[0].completedTasks : 0;

    // Get teams statistics
    const TeamModel = model("Team");
    const teamsCreated = await TeamModel.countDocuments({ createdBy: userId });
    const teamsJoined = await TeamModel.countDocuments({
      "members.user": userId,
      "members.isActive": true,
    });

    // Get contributions statistics
    const contributionsData = await NeedModel.aggregate([
      { $unwind: "$supporterDetails" },
      {
        $match: {
          "supporterDetails.user": new Types.ObjectId(userId),
        },
      },
      { $unwind: "$supporterDetails.contributions" },
      {
        $group: {
          _id: null,
          totalContributions: { $sum: 1 },
          totalFinancial: {
            $sum: {
              $cond: [
                { $eq: ["$supporterDetails.contributions.type", "financial"] },
                { $ifNull: ["$supporterDetails.contributions.amount", 0] },
                0,
              ],
            },
          },
          totalHours: {
            $sum: {
              $cond: [
                { $eq: ["$supporterDetails.contributions.type", "time"] },
                { $ifNull: ["$supporterDetails.contributions.hours", 0] },
                0,
              ],
            },
          },
        },
      },
    ]);

    const totalContributions = contributionsData.length > 0 ? contributionsData[0].totalContributions : 0;
    const totalFinancialContributions =
      contributionsData.length > 0 ? contributionsData[0].totalFinancial : 0;
    const totalHoursContributed = contributionsData.length > 0 ? contributionsData[0].totalHours : 0;

    // Get social statistics
    const SupporterMessageModel = model("SupporterMessage");
    const messagesCount = await SupporterMessageModel.countDocuments({ author: userId });

    const CommentModel = model("Comment");
    const commentsCount = await CommentModel.countDocuments({ user: userId });

    // Get user rank
    const globalRank = await pointsService.getUserRank(userId);

    // Get first milestones
    const firstNeed = await NeedModel.findOne({ "submittedBy.user": userId })
      .sort({ createdAt: 1 })
      .select("createdAt");

    const firstTeam = await TeamModel.findOne({ createdBy: userId })
      .sort({ createdAt: 1 })
      .select("createdAt");

    const firstContribution = await NeedModel.findOne({
      "supporterDetails.user": userId,
    })
      .sort({ "supporterDetails.contributions.date": 1 })
      .select("supporterDetails.contributions.date");

    const stats: IUserStats = {
      userId,

      // Points & Level
      totalPoints: pointsSummary.totalPoints,
      currentLevel: pointsSummary.currentLevel,

      // Needs
      needsCreated,
      needsSupported,
      needsCompleted,
      needsUpvoted,

      // Tasks
      tasksCompleted,
      tasksAssigned,

      // Teams
      teamsCreated,
      teamsJoined,

      // Contributions
      totalFinancialContributions,
      totalHoursContributed,
      totalContributions,

      // Social
      followersCount: 0, // Will be implemented in Phase 3.2
      followingCount: 0, // Will be implemented in Phase 3.2
      messagesCount,
      commentsCount,

      // Badges
      badgesCount: totalBadges,
      commonBadges: badgeCounts.common,
      rareBadges: badgeCounts.rare,
      epicBadges: badgeCounts.epic,
      legendaryBadges: badgeCounts.legendary,

      // Streaks
      currentLoginStreak: 0, // Will be calculated from login history
      longestLoginStreak: 0, // Will be calculated from login history

      // Milestones
      firstContributionDate: firstContribution?.supporterDetails?.[0]?.contributions?.[0]?.date,
      firstNeedCreatedDate: firstNeed?.createdAt,
      firstTeamCreatedDate: firstTeam?.createdAt,

      // Rankings
      globalRank,
    };

    return stats;
  }

  // Get leaderboard with detailed stats
  public async getLeaderboardWithStats(limit: number = 100): Promise<any[]> {
    const leaderboard = await pointsService.getLeaderboard(limit);

    // Enhance with badge counts
    const enhanced = await Promise.all(
      leaderboard.map(async (entry) => {
        const badgeCounts = await badgeService.getUserBadgeCountByRarity(entry.userId.toString());
        const totalBadges =
          badgeCounts.common + badgeCounts.rare + badgeCounts.epic + badgeCounts.legendary;

        return {
          ...entry,
          badges: totalBadges,
          level: getLevelByPoints(entry.totalPoints),
        };
      })
    );

    return enhanced;
  }

  // Get user's activity summary (recent actions)
  public async getUserActivitySummary(userId: string, days: number = 30): Promise<any> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const transactions = await pointsService.getUserTransactions(userId, 100, 0);
    const recentTransactions = transactions.filter((t) => t.createdAt >= since);

    // Group by action
    const actionCounts: Record<string, number> = {};
    const actionPoints: Record<string, number> = {};

    recentTransactions.forEach((t) => {
      actionCounts[t.action] = (actionCounts[t.action] || 0) + 1;
      actionPoints[t.action] = (actionPoints[t.action] || 0) + t.points;
    });

    const totalPointsEarned = recentTransactions.reduce((sum, t) => sum + t.points, 0);

    return {
      period: `Last ${days} days`,
      totalActions: recentTransactions.length,
      totalPointsEarned,
      actionCounts,
      actionPoints,
      mostActiveAction: Object.keys(actionCounts).reduce((a, b) =>
        actionCounts[a] > actionCounts[b] ? a : b
      ),
    };
  }
}

export const userStatsService = new UserStatsService();
