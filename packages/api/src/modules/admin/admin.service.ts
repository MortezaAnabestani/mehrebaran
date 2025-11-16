import { NeedModel } from "../needs/need.model";
import { UserModel } from "../users/user.model";
import { StoryModel } from "../stories/story.model";
import { DonationModel } from "../donations/donation.model";
import { NeedComment } from "../needs/needComment.model";
import { FollowModel } from "../social/follow.model";

/**
 * Admin Service - Provides admin dashboard statistics and analytics
 * سرویس مدیریت - آمار و تحلیل‌های داشبورد مدیریت
 */
class AdminService {
  /**
   * Get comprehensive dashboard overview statistics
   * دریافت آمار کلی داشبورد مدیریت
   */
  async getDashboardOverview() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Run all stat queries in parallel for better performance
    const [
      totalNeeds,
      pendingNeeds,
      activeNeeds,
      totalUsers,
      activeUsers,
      totalStories,
      todayStories,
      totalDonations,
      pendingDonations,
      totalDonationAmount,
      pendingComments,
      pendingVerifications,
      topTags,
      recentActivities,
    ] = await Promise.all([
      // Total Needs
      NeedModel.countDocuments(),

      // Pending Needs (awaiting review)
      NeedModel.countDocuments({ status: "pending" }),

      // Active Needs
      NeedModel.countDocuments({ status: "active" }),

      // Total Users
      UserModel.countDocuments(),

      // Active Users (logged in last 30 days)
      UserModel.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),

      // Total Stories
      StoryModel.countDocuments(),

      // Today's Stories
      StoryModel.countDocuments({ createdAt: { $gte: today } }),

      // Total Donations
      DonationModel.countDocuments(),

      // Pending Donations
      DonationModel.countDocuments({ status: "pending" }),

      // Total Donation Amount
      DonationModel.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // Pending Comments
      NeedComment.countDocuments({ isApproved: false }),

      // Pending Verifications (TODO: implement when verification system is ready)
      Promise.resolve(0),

      // Top Tags
      this.getTopTags(10),

      // Recent Activities (last 10 needs)
      NeedModel.find().sort({ createdAt: -1 }).limit(10).select("title status createdAt").lean(),
    ]);

    // Calculate total donation amount
    const totalAmount = totalDonationAmount.length > 0 ? totalDonationAmount[0].total : 0;

    return {
      stats: {
        needs: {
          total: totalNeeds,
          pending: pendingNeeds,
          active: activeNeeds,
        },
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        stories: {
          total: totalStories,
          today: todayStories,
        },
        donations: {
          total: totalDonations,
          pending: pendingDonations,
          totalAmount: totalAmount,
        },
      },
      quickActions: {
        pendingNeeds,
        pendingComments,
        pendingVerifications,
        pendingDonations,
      },
      topTags,
      recentActivities,
    };
  }

  /**
   * Get top tags by usage
   * دریافت تگ‌های پرکاربرد
   */
  private async getTopTags(limit: number = 10) {
    const tags = await NeedModel.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $project: {
          tag: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    return tags;
  }

  /**
   * Get trending needs (most viewed/commented in last 7 days)
   * دریافت نیازهای پرطرفدار (پربازدیدترین/پرنظرترین در 7 روز اخیر)
   */
  async getTrendingNeeds(limit: number = 10) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const trending = await NeedModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: "active",
        },
      },
      {
        $lookup: {
          from: "needcomments",
          localField: "_id",
          foreignField: "need",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
          engagementScore: {
            $add: [{ $ifNull: ["$viewCount", 0] }, { $multiply: [{ $size: "$comments" }, 5] }],
          },
        },
      },
      {
        $sort: { engagementScore: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          title: 1,
          status: 1,
          viewCount: 1,
          commentCount: 1,
          engagementScore: 1,
          createdAt: 1,
        },
      },
    ]);

    return trending;
  }

  /**
   * Get active users statistics (daily/weekly/monthly)
   * دریافت آمار کاربران فعال (روزانه/هفتگی/ماهانه)
   */
  async getActiveUsersStats() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [daily, weekly, monthly] = await Promise.all([
      UserModel.countDocuments({ lastLogin: { $gte: oneDayAgo } }),
      UserModel.countDocuments({ lastLogin: { $gte: oneWeekAgo } }),
      UserModel.countDocuments({ lastLogin: { $gte: oneMonthAgo } }),
    ]);

    return {
      daily,
      weekly,
      monthly,
    };
  }

  /**
   * Get donation progress statistics
   * دریافت آمار پیشرفت کمک‌ها
   */
  // یک اینترفیس برای شکل خروجی aggregation تعریف می‌کنیم

  async getDonationProgress() {
    const stats = await DonationModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const result: {
      pending: { count: number; total: number };
      completed: { count: number; total: number };
      failed: { count: number; total: number };
    } = {
      pending: { count: 0, total: 0 },
      completed: { count: 0, total: 0 },
      failed: { count: 0, total: 0 },
    };

    stats.forEach((stat: { _id: string; count: number; total: number }) => {
      if (stat._id in result) {
        result[stat._id as keyof typeof result] = {
          count: stat.count,
          total: stat.total,
        };
      }
    });

    return result;
  }

  // ==================== ANALYTICS METHODS ====================

  /**
   * Get content analytics (needs, stories, comments)
   * آنالیز محتوا
   */
  async getContentAnalytics(days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [needsByStatus, needsByCategory, needsByUrgency, needsTimeline, storiesTimeline, commentsStats] =
      await Promise.all([
        // Needs by Status
        NeedModel.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $project: { status: "$_id", count: 1, _id: 0 } },
        ]),

        // Needs by Category
        NeedModel.aggregate([
          {
            $lookup: {
              from: "needcategories",
              localField: "category",
              foreignField: "_id",
              as: "categoryInfo",
            },
          },
          { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: "$categoryInfo.name",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
          { $project: { category: "$_id", count: 1, _id: 0 } },
        ]),

        // Needs by Urgency Level
        NeedModel.aggregate([
          { $group: { _id: "$urgencyLevel", count: { $sum: 1 } } },
          { $project: { urgency: "$_id", count: 1, _id: 0 } },
        ]),

        // Needs Timeline (daily creation)
        NeedModel.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { date: "$_id", count: 1, _id: 0 } },
        ]),

        // Stories Timeline
        StoryModel.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { date: "$_id", count: 1, _id: 0 } },
        ]),

        // Comments Stats
        NeedComment.aggregate([
          {
            $facet: {
              total: [{ $count: "count" }],
              approved: [{ $match: { isApproved: true } }, { $count: "count" }],
              pending: [{ $match: { isApproved: false } }, { $count: "count" }],
              timeline: [
                { $match: { createdAt: { $gte: startDate } } },
                {
                  $group: {
                    _id: {
                      $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    count: { $sum: 1 },
                  },
                },
                { $sort: { _id: 1 } },
                { $project: { date: "$_id", count: 1, _id: 0 } },
              ],
            },
          },
        ]),
      ]);

    return {
      needs: {
        byStatus: needsByStatus,
        byCategory: needsByCategory,
        byUrgency: needsByUrgency,
        timeline: needsTimeline,
      },
      stories: {
        timeline: storiesTimeline,
      },
      comments: {
        total: commentsStats[0].total[0]?.count || 0,
        approved: commentsStats[0].approved[0]?.count || 0,
        pending: commentsStats[0].pending[0]?.count || 0,
        timeline: commentsStats[0].timeline,
      },
    };
  }

  /**
   * Get user analytics (growth, activity, engagement)
   * آنالیز کاربران
   */
  async getUserAnalytics(days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [userGrowth, usersByRole, activeUsersTimeline, topContributors] = await Promise.all([
      // User Growth Timeline
      UserModel.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", count: 1, _id: 0 } },
      ]),

      // Users by Role
      UserModel.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $project: { role: "$_id", count: 1, _id: 0 } },
      ]),

      // Active Users Timeline (by last login)
      UserModel.aggregate([
        {
          $match: {
            lastLogin: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$lastLogin" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", count: 1, _id: 0 } },
      ]),

      // Top Contributors (users with most needs)
      NeedModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$createdBy",
            username: { $first: "$user.username" },
            fullName: { $first: "$user.fullName" },
            needsCount: { $sum: 1 },
          },
        },
        { $sort: { needsCount: -1 } },
        { $limit: 10 },
        {
          $project: {
            userId: "$_id",
            username: 1,
            fullName: 1,
            needsCount: 1,
            _id: 0,
          },
        },
      ]),
    ]);

    return {
      growth: userGrowth,
      byRole: usersByRole,
      activeUsers: activeUsersTimeline,
      topContributors,
    };
  }

  /**
   * Get engagement analytics (views, reactions, follows, shares)
   * آنالیز تعامل کاربران
   */
  async getEngagementAnalytics(days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [followStats, storyEngagement, needEngagement, commentsEngagement] = await Promise.all([
      // Follow Statistics
      FollowModel.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            timeline: [
              { $match: { followedAt: { $gte: startDate } } },
              {
                $group: {
                  _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$followedAt" },
                  },
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
              { $project: { date: "$_id", count: 1, _id: 0 } },
            ],
            topFollowed: [
              {
                $group: {
                  _id: "$followedUser",
                  followersCount: { $sum: 1 },
                },
              },
              { $sort: { followersCount: -1 } },
              { $limit: 10 },
              {
                $lookup: {
                  from: "users",
                  localField: "_id",
                  foreignField: "_id",
                  as: "user",
                },
              },
              { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
              {
                $project: {
                  userId: "$_id",
                  username: "$user.username",
                  fullName: "$user.fullName",
                  followersCount: 1,
                  _id: 0,
                },
              },
            ],
          },
        },
      ]),

      // Story Engagement
      StoryModel.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalStories: { $sum: 1 },
            totalViews: { $sum: { $size: { $ifNull: ["$viewers", []] } } },
            totalReactions: { $sum: { $size: { $ifNull: ["$reactions", []] } } },
            avgViews: { $avg: { $size: { $ifNull: ["$viewers", []] } } },
            avgReactions: { $avg: { $size: { $ifNull: ["$reactions", []] } } },
          },
        },
        {
          $project: {
            totalStories: 1,
            totalViews: 1,
            totalReactions: 1,
            avgViews: { $round: ["$avgViews", 2] },
            avgReactions: { $round: ["$avgReactions", 2] },
            engagementRate: {
              $round: [
                {
                  $cond: {
                    if: { $gt: ["$totalViews", 0] },
                    then: { $multiply: [{ $divide: ["$totalReactions", "$totalViews"] }, 100] },
                    else: 0,
                  },
                },
                2,
              ],
            },
            _id: 0,
          },
        },
      ]),

      // Need Engagement (views are tracked if viewCount field exists)
      NeedModel.aggregate([
        {
          $group: {
            _id: null,
            totalNeeds: { $sum: 1 },
            totalViews: { $sum: { $ifNull: ["$viewCount", 0] } },
            avgViews: { $avg: { $ifNull: ["$viewCount", 0] } },
          },
        },
        {
          $project: {
            totalNeeds: 1,
            totalViews: 1,
            avgViews: { $round: ["$avgViews", 2] },
            _id: 0,
          },
        },
      ]),

      // Comments Engagement
      NeedComment.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalComments: { $sum: 1 },
            approvedComments: {
              $sum: { $cond: [{ $eq: ["$isApproved", true] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            totalComments: 1,
            approvedComments: 1,
            approvalRate: {
              $round: [
                {
                  $cond: {
                    if: { $gt: ["$totalComments", 0] },
                    then: { $multiply: [{ $divide: ["$approvedComments", "$totalComments"] }, 100] },
                    else: 0,
                  },
                },
                2,
              ],
            },
            _id: 0,
          },
        },
      ]),
    ]);

    return {
      follows: {
        total: followStats[0].total[0]?.count || 0,
        timeline: followStats[0].timeline,
        topFollowed: followStats[0].topFollowed,
      },
      stories: storyEngagement[0] || {
        totalStories: 0,
        totalViews: 0,
        totalReactions: 0,
        avgViews: 0,
        avgReactions: 0,
        engagementRate: 0,
      },
      needs: needEngagement[0] || {
        totalNeeds: 0,
        totalViews: 0,
        avgViews: 0,
      },
      comments: commentsEngagement[0] || {
        totalComments: 0,
        approvedComments: 0,
        approvalRate: 0,
      },
    };
  }
}

export const adminService = new AdminService();
