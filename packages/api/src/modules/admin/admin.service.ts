import { NeedModel } from "../needs/need.model";
import { UserModel } from "../users/user.model";
import { StoryModel } from "../stories/story.model";
import { DonationModel } from "../donations/donation.model";
import { NeedComment } from "../needs/needComment.model";

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
}

export const adminService = new AdminService();
