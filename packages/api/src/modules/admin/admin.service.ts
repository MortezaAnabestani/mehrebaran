import Need from "../needs/need.model";
import User from "../users/user.model";
import Story from "../stories/story.model";
import Donation from "../donations/donation.model";
import NeedComment from "../needs/needComment.model";

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
      Need.countDocuments(),

      // Pending Needs (awaiting review)
      Need.countDocuments({ status: "pending" }),

      // Active Needs
      Need.countDocuments({ status: "active" }),

      // Total Users
      User.countDocuments(),

      // Active Users (logged in last 30 days)
      User.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),

      // Total Stories
      Story.countDocuments(),

      // Today's Stories
      Story.countDocuments({ createdAt: { $gte: today } }),

      // Total Donations
      Donation.countDocuments(),

      // Pending Donations
      Donation.countDocuments({ status: "pending" }),

      // Total Donation Amount
      Donation.aggregate([
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
      Need.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("title status createdAt")
        .lean(),
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
    const tags = await Need.aggregate([
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

    const trending = await Need.aggregate([
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
      User.countDocuments({ lastLogin: { $gte: oneDayAgo } }),
      User.countDocuments({ lastLogin: { $gte: oneWeekAgo } }),
      User.countDocuments({ lastLogin: { $gte: oneMonthAgo } }),
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
  async getDonationProgress() {
    const stats = await Donation.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const result = {
      pending: { count: 0, total: 0 },
      completed: { count: 0, total: 0 },
      failed: { count: 0, total: 0 },
    };

    stats.forEach((stat) => {
      if (stat._id in result) {
        result[stat._id] = {
          count: stat.count,
          total: stat.total,
        };
      }
    });

    return result;
  }
}

export const adminService = new AdminService();
