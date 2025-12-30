import { NeedModel } from "../needs/need.model";
import { UserModel } from "../users/user.model";
import { StoryModel } from "../stories/story.model";
import { DonationModel } from "../donations/donation.model";
import { NeedComment } from "../needs/needComment.model";
import { CommentModel } from "../comment/comment.model";
import { FollowModel } from "../social/follow.model";
import { UserBadgeModel } from "../gamification/userBadge.model";

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

      // Total Comments (no approval system in model)
      Promise.resolve(0),

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

        // Comments Stats (no approval system in model)
        NeedComment.aggregate([
          {
            $facet: {
              total: [{ $count: "count" }],
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
            localField: "submittedBy.user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$submittedBy.user",
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

      // Comments Engagement (no approval system in model)
      NeedComment.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalComments: { $sum: 1 },
          },
        },
        {
          $project: {
            totalComments: 1,
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
      },
    };
  }

  // ==================== MODERATION METHODS ====================

  /**
   * Get needs for moderation with filtering
   * دریافت نیازها برای مدیریت با فیلتر
   */
  async getModerationNeeds(filters: { status?: string; search?: string; page?: number; limit?: number }) {
    const { status, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [needs, total] = await Promise.all([
      NeedModel.find(query)
        .populate("submittedBy.user", "username fullName email")
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NeedModel.countDocuments(query),
    ]);

    return {
      needs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Bulk update needs status
   * به‌روزرسانی گروهی وضعیت نیازها
   */
  async bulkUpdateNeedsStatus(needIds: string[], status: string, reason?: string) {
    const result = await NeedModel.updateMany(
      { _id: { $in: needIds } },
      {
        $set: {
          status,
          ...(reason && { rejectionReason: reason }),
          reviewedAt: new Date(),
        },
      }
    );

    return {
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    };
  }

  /**
   * Get comments for moderation
   * دریافت نظرات برای مدیریت
   */
  async getModerationComments(filters: { search?: string; page?: number; limit?: number }) {
    const { search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.content = { $regex: search, $options: "i" };
    }

    const [comments, total] = await Promise.all([
      CommentModel.find(query)
        .populate("author", "username fullName email avatar")
        .populate("post")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CommentModel.countDocuments(query),
    ]);

    return {
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Bulk update comments approval status
   * به‌روزرسانی گروهی وضعیت تایید نظرات
   *
   * NOTE: Disabled - NeedComment model does not have isApproved field
   */
  // async bulkUpdateCommentsApproval(commentIds: string[], isApproved: boolean) {
  //   const result = await NeedComment.updateMany(
  //     { _id: { $in: commentIds } },
  //     {
  //       $set: {
  //         isApproved,
  //         reviewedAt: new Date(),
  //       },
  //     }
  //   );

  //   return {
  //     modifiedCount: result.modifiedCount,
  //     matchedCount: result.matchedCount,
  //   };
  // }

  /**
   * Get donations for moderation
   * دریافت کمک‌ها برای مدیریت
   */
  async getModerationDonations(filters: { status?: string; search?: string; page?: number; limit?: number }) {
    const { status, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [donations, total] = await Promise.all([
      DonationModel.find(query)
        .populate("donor", "username fullName email")
        .populate("project", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      DonationModel.countDocuments(query),
    ]);

    return {
      donations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update donation status
   * به‌روزرسانی وضعیت کمک
   */
  async updateDonationStatus(donationId: string, status: string, notes?: string) {
    const donation = await DonationModel.findByIdAndUpdate(
      donationId,
      {
        $set: {
          status,
          ...(notes && { adminNotes: notes }),
          reviewedAt: new Date(),
        },
      },
      { new: true }
    );

    return donation;
  }

  // ==================== ACTIVITY FEED METHODS ====================

  /**
   * Get activity feed with all recent activities
   * دریافت فید فعالیت‌ها با تمام فعالیت‌های اخیر
   */
  async getActivityFeed(filters: { activityType?: string; page?: number; limit?: number; days?: number }) {
    const { activityType, page = 1, limit = 20, days = 7 } = filters;
    const skip = (page - 1) * limit;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Aggregate activities from different sources
    const activities: any[] = [];

    // Fetch needs if no specific type or type is 'need'
    if (!activityType || activityType === "need") {
      const needs = await NeedModel.find({ createdAt: { $gte: startDate } })
        .populate("submittedBy.user", "username fullName profilePicture")
        .sort({ createdAt: -1 })
        .limit(limit * 2)
        .lean();

      needs.forEach((need: any) => {
        activities.push({
          activityType: "need",
          timestamp: need.createdAt,
          user: need.submittedBy?.user || null,
          details: {
            id: need._id,
            title: need.title,
            status: need.status,
            urgencyLevel: need.urgencyLevel,
          },
          icon: "/icons/paper.svg",
          description: `نیاز جدید ثبت شد`,
        });
      });
    }

    // Fetch donations if no specific type or type is 'donation'
    if (!activityType || activityType === "donation") {
      const donations = await DonationModel.find({ createdAt: { $gte: startDate } })
        .populate("donor", "username fullName profilePicture")
        .populate("project", "title")
        .sort({ createdAt: -1 })
        .limit(limit * 2)
        .lean();

      donations.forEach((donation: any) => {
        activities.push({
          activityType: "donation",
          timestamp: donation.createdAt,
          user: donation.donor,
          details: {
            id: donation._id,
            amount: donation.amount,
            status: donation.status,
            projectTitle: donation.project?.title,
            projectId: donation.project?._id,
          },
          icon: "/icons/rial.svg",
          description: `کمک مالی جدید دریافت شد`,
        });
      });
    }

    // Fetch comments if no specific type or type is 'comment'
    if (!activityType || activityType === "comment") {
      const comments = await NeedComment.find({ createdAt: { $gte: startDate } })
        .populate("user", "username fullName profilePicture")
        .populate("target", "title")
        .sort({ createdAt: -1 })
        .limit(limit * 2)
        .lean();

      comments.forEach((comment: any) => {
        activities.push({
          activityType: "comment",
          timestamp: comment.createdAt,
          user: comment.user,
          details: {
            id: comment._id,
            content: comment.content ? comment.content.substring(0, 100) : "",
            needTitle: comment.target?.title,
            needId: comment.target?._id,
          },
          icon: "💬",
          description: `نظر جدید ثبت شد`,
        });
      });
    }

    // Fetch stories if no specific type or type is 'story'
    if (!activityType || activityType === "story") {
      const stories = await StoryModel.find({ createdAt: { $gte: startDate } })
        .populate("user", "username fullName profilePicture")
        .sort({ createdAt: -1 })
        .limit(limit * 2)
        .lean();

      stories.forEach((story: any) => {
        activities.push({
          activityType: "story",
          timestamp: story.createdAt,
          user: story.user,
          details: {
            id: story._id,
            mediaType: story.mediaType,
            viewersCount: story.viewers?.length || 0,
            reactionsCount: story.reactions?.length || 0,
          },
          icon: "📸",
          description: `استوری جدید منتشر شد`,
        });
      });
    }

    // Fetch follows if no specific type or type is 'follow'
    if (!activityType || activityType === "follow") {
      const follows = await FollowModel.find({
        createdAt: { $gte: startDate },
        followType: "user", // Only user follows, not need follows
      })
        .populate("follower", "username fullName profilePicture")
        .populate("following", "username fullName")
        .sort({ createdAt: -1 })
        .limit(limit * 2)
        .lean();

      follows.forEach((follow: any) => {
        activities.push({
          activityType: "follow",
          timestamp: follow.createdAt,
          user: follow.follower,
          details: {
            id: follow._id,
            followedUser: {
              id: follow.following?._id,
              username: follow.following?.username,
              fullName: follow.following?.fullName,
            },
          },
          icon: "/icons/user.svg",
          description: `کاربر جدید دنبال شد`,
        });
      });
    }

    // Fetch badge awards if no specific type or type is 'badge'
    if (!activityType || activityType === "badge") {
      const badgeAwards = await UserBadgeModel.find({ earnedAt: { $gte: startDate } })
        .populate("user", "username fullName profilePicture")
        .populate("badge", "name icon description")
        .sort({ earnedAt: -1 })
        .limit(limit * 2)
        .lean();

      badgeAwards.forEach((badgeAward: any) => {
        activities.push({
          activityType: "badge",
          timestamp: badgeAward.earnedAt,
          user: badgeAward.user,
          details: {
            id: badgeAward._id,
            badgeName: badgeAward.badge?.name,
            badgeIcon: badgeAward.badge?.icon,
            badgeDescription: badgeAward.badge?.description,
            progress: badgeAward.progress,
          },
          icon: "/icons/cup.svg",
          description: `نشان جدید دریافت شد`,
        });
      });
    }

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Paginate
    const total = activities.length;
    const paginatedActivities = activities.slice(skip, skip + limit);

    return {
      activities: paginatedActivities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get site views analytics
   * آنالیز بازدیدهای سایت
   */
  async getViewsAnalytics(days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Generate daily stats for the requested period
    const dailyStats = [];
    let totalVisits = 0;

    // Create a date for each day in the range
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const count = Math.floor(Math.random() * 500) + 100; // Mock data for now
      totalVisits += count;

      dailyStats.unshift({
        date: date.toISOString(),
        count,
      });
    }

    return {
      totalVisits,
      dailyStats,
      period: {
        start: startDate,
        end: new Date(),
        days,
      },
    };
  }

  /**
   * Get all admin users (ADMIN and SUPER_ADMIN roles)
   * دریافت لیست کاربران ادمین
   */
  async getAllAdmins() {
    const admins = await UserModel.find({
      role: { $in: ["admin", "super_admin"] },
    })
      .select("name email avatar role createdAt lastLogin loginHistory")
      .sort({ createdAt: -1 })
      .lean();

    return admins;
  }

  /**
   * Get admin by ID
   * دریافت ادمین بر اساس ID
   */
  async getAdminById(id: string) {
    const admin = await UserModel.findOne({
      _id: id,
      role: { $in: ["admin", "super_admin"] },
    })
      .select("name email avatar role createdAt lastLogin loginHistory username")
      .lean();

    return admin;
  }

  /**
   * Create new admin
   * ایجاد ادمین جدید
   */
  async createAdmin(data: any) {
    // Generate unique mobile and nationalId for admin users if not provided
    // برای کاربران ادمین، اگر موبایل و کد ملی ارسال نشده، مقادیر یکتا تولید می‌کنیم
    const adminData = {
      ...data,
      role: data.role || "admin",
      mobile: data.mobile || `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nationalId: data.nationalId || `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const admin = await UserModel.create(adminData);

    return admin;
  }

  /**
   * Update admin
   * ویرایش ادمین
   */
  async updateAdmin(id: string, data: any) {
    const admin = await UserModel.findOneAndUpdate(
      {
        _id: id,
        role: { $in: ["admin", "super_admin"] },
      },
      data,
      { new: true }
    )
      .select("name email avatar role createdAt lastLogin loginHistory username")
      .lean();

    return admin;
  }

  /**
   * Delete admin
   * حذف ادمین
   */
  async deleteAdmin(id: string) {
    const admin = await UserModel.findOneAndDelete({
      _id: id,
      role: { $in: ["admin", "super_admin"] },
    }).lean();

    return admin;
  }
}

export const adminService = new AdminService();
