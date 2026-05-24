import { StoryModel } from "./story.model";
import { StoryHighlightModel } from "./storyHighlight.model";
import { MediaModel } from "./media.model";
import type {
  IStory,
  StoryType,
  StoryPrivacy,
  IStoryFeed,
  IStoryFeedItem,
  IStoryStats,
} from "common-types";

class StoryService {
  /**
   * ایجاد استوری جدید
   */
  public async createStory(
    userId: string,
    data: {
      type: StoryType;
      mediaId?: string;
      text?: string;
      backgroundColor?: string;
      textColor?: string;
      fontFamily?: string;
      caption?: string;
      privacy?: StoryPrivacy;
      allowedUsers?: string[];
      linkedNeedId?: string;
      linkedUrl?: string;
      allowReplies?: boolean;
      allowSharing?: boolean;
      expiresAt?: Date;
    }
  ): Promise<IStory> {
    const storyData: any = {
      user: userId,
      type: data.type,
      text: data.text,
      backgroundColor: data.backgroundColor,
      textColor: data.textColor,
      fontFamily: data.fontFamily,
      caption: data.caption,
      privacy: data.privacy || "public",
      allowedUsers: data.allowedUsers,
      linkedNeed: data.linkedNeedId,
      linkedUrl: data.linkedUrl,
      allowReplies: data.allowReplies !== false,
      allowSharing: data.allowSharing !== false,
      expiresAt: data.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    // اضافه کردن media اگر وجود داشته باشد
    if (data.mediaId) {
      const media = await MediaModel.findById(data.mediaId);
      if (media) {
        storyData.media = {
          type: media.type,
          url: media.url,
          thumbnail: media.metadata.thumbnail,
          duration: media.metadata.duration,
          metadata: media.metadata,
        };
      }
    }

    const story = await StoryModel.create(storyData);
    await story.populate("user", "name avatar");

    // ارسال نوتیفیکیشن real-time
    await this.notifyFollowers(userId, story);

    return story;
  }

  /**
   * دریافت استوری بر اساس ID
   */
  public async getStoryById(storyId: string): Promise<IStory | null> {
    return StoryModel.findById(storyId).populate("user", "name avatar");
  }

  /**
   * دریافت استوری‌های کاربر
   */
  public async getUserStories(userId: string, viewerId?: string): Promise<IStory[]> {
    const stories = await (StoryModel as any).getActiveByUser(userId);

    // اگر viewerId داده شده، مشخص کنیم کدام‌ها را دیده
    if (viewerId) {
      return stories.map((story: any) => ({
        ...story.toObject(),
        hasViewed: story.hasUserViewed(viewerId),
      }));
    }

    return stories;
  }

  /**
   * دریافت فید استوری‌ها
   */
  public async getStoryFeed(userId: string): Promise<IStoryFeed> {
    // دریافت لیست following
    const FollowModel = await import("../social/follow.model").then((m) => m.FollowModel);
    const following = await FollowModel.find({
      follower: userId,
      followType: "user",
    }).select("following");

    const followingIds = following.map((f: any) => f.following.toString());

    // دریافت استوری‌ها
    const stories = await (StoryModel as any).getFeedStories(userId, followingIds);

    // گروه‌بندی بر اساس کاربر
    const userStoriesMap = new Map<string, IStory[]>();

    stories.forEach((story: IStory) => {
      const userId = (story.user as any)._id.toString();
      if (!userStoriesMap.has(userId)) {
        userStoriesMap.set(userId, []);
      }
      userStoriesMap.get(userId)!.push(story);
    });

    // ساخت feed items
    const items: IStoryFeedItem[] = [];

    userStoriesMap.forEach((userStories, userId) => {
      const unviewedStories = userStories.filter(
        (story) => !(story as any).hasUserViewed(userId)
      );

      items.push({
        user: userStories[0].user as any,
        stories: userStories,
        hasUnviewed: unviewedStories.length > 0,
        unviewedCount: unviewedStories.length,
        latestStoryTime: new Date(
          Math.max(...userStories.map((s) => s.createdAt.getTime()))
        ),
      });
    });

    // مرتب‌سازی: ابتدا unviewed، سپس بر اساس زمان
    items.sort((a, b) => {
      if (a.hasUnviewed && !b.hasUnviewed) return -1;
      if (!a.hasUnviewed && b.hasUnviewed) return 1;
      return b.latestStoryTime.getTime() - a.latestStoryTime.getTime();
    });

    return {
      items,
      totalUsers: items.length,
      hasMore: false,
    };
  }

  /**
   * مشاهده استوری
   */
  public async viewStory(
    storyId: string,
    viewerId: string,
    viewDuration?: number
  ): Promise<IStory> {
    const story = await StoryModel.findById(storyId);

    if (!story) {
      throw new Error("استوری یافت نشد.");
    }

    // اضافه کردن view
    await (story as any).addView(viewerId, viewDuration);

    // اگر story مربوط به need باشد، امتیاز بده
    if (story.linkedNeed) {
      try {
        const { pointsService } = await import("../gamification/points.service");
        await pointsService.awardPoints(story.user.toString(), "need_upvote", {
          points: 1,
          description: "مشاهده استوری مرتبط با نیاز",
          relatedModel: "Story",
          relatedId: storyId,
        });
      } catch (error) {
        console.error("Failed to award points for story view:", error);
      }
    }

    return story;
  }

  /**
   * افزودن reaction به استوری
   */
  public async addReaction(
    storyId: string,
    userId: string,
    emoji: string
  ): Promise<IStory> {
    const story = await StoryModel.findById(storyId);

    if (!story) {
      throw new Error("استوری یافت نشد.");
    }

    await (story as any).addReaction(userId, emoji);

    // ارسال نوتیفیکیشن به صاحب استوری
    if (story.user.toString() !== userId) {
      try {
        const { notificationService } = await import("../notifications/notification.service");
        await notificationService.create({
          recipient: story.user.toString(),
          type: "comment_posted", // TODO: add story_reaction type
          title: "واکنش به استوری",
          message: `کاربری به استوری شما واکنش ${emoji} نشان داد.`,
          actor: userId,
          relatedModel: "Story",
          relatedId: storyId,
          channels: ["in_app", "push"],
          priority: "normal",
        });
      } catch (error) {
        console.error("Failed to send reaction notification:", error);
      }
    }

    return story;
  }

  /**
   * حذف reaction
   */
  public async removeReaction(storyId: string, userId: string): Promise<IStory> {
    const story = await StoryModel.findById(storyId);

    if (!story) {
      throw new Error("استوری یافت نشد.");
    }

    await (story as any).removeReaction(userId);
    return story;
  }

  /**
   * حذف استوری
   */
  public async deleteStory(storyId: string, userId: string, userRole?: string): Promise<boolean> {
    // Admins can delete any story
    const isAdmin = userRole === "admin" || userRole === "super_admin";

    let story;
    if (isAdmin) {
      // Admin can delete any story
      story = await StoryModel.findById(storyId);
    } else {
      // Regular users can only delete their own stories
      story = await StoryModel.findOne({ _id: storyId, user: userId });
    }

    if (!story) {
      return false;
    }

    await story.deleteOne();
    return true;
  }

  /**
   * دریافت viewers استوری
   */
  public async getStoryViewers(storyId: string, userId: string, userRole?: string) {
    // Admins can view any story's viewers
    const isAdmin = userRole === "admin" || userRole === "super_admin";

    let story;
    if (isAdmin) {
      // Admin can access any story
      story = await StoryModel.findById(storyId);
    } else {
      // Regular users can only access their own stories
      story = await StoryModel.findOne({ _id: storyId, user: userId });
    }

    if (!story) {
      throw new Error("استوری یافت نشد یا دسترسی ندارید.");
    }

    // Populate viewers
    await story.populate("views.user", "name avatar");

    return {
      views: story.views,
      viewsCount: story.viewsCount,
      reactions: story.reactions,
      reactionsCount: story.reactionsCount,
    };
  }

  /**
   * دریافت آمار استوری‌های کاربر
   */
  public async getUserStoryStats(userId: string): Promise<IStoryStats> {
    const stats = await (StoryModel as any).getUserStoryStats(userId);

    // تعداد استوری‌های فعال
    const activeStories = await StoryModel.countDocuments({
      user: userId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    // تعداد highlights
    const highlightsCount = await StoryHighlightModel.countDocuments({
      user: userId,
      isActive: true,
    });

    // آخرین استوری
    const lastStory = await StoryModel.findOne({ user: userId }).sort({ createdAt: -1 });

    return {
      userId,
      totalStories: stats.totalStories,
      totalViews: stats.totalViews,
      totalReactions: stats.totalReactions,
      averageViews: stats.averageViews,
      averageReactions: stats.averageReactions,
      activeStories,
      highlightsCount,
      lastStoryDate: lastStory?.createdAt,
    };
  }

  /**
   * ایجاد highlight
   */
  public async createHighlight(
    userId: string,
    title: string,
    coverImage: string,
    storyIds: string[]
  ) {
    // دریافت تعداد highlights فعلی برای تنظیم order
    const count = await StoryHighlightModel.countDocuments({ user: userId });

    const highlight = await StoryHighlightModel.create({
      user: userId,
      title,
      coverImage,
      stories: storyIds,
      order: count,
    });

    // تنظیم highlightedUntil برای استوری‌ها
    await StoryModel.updateMany(
      { _id: { $in: storyIds } },
      { highlightedUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) } // 1 سال
    );

    return highlight;
  }

  /**
   * دریافت highlights کاربر
   */
  public async getUserHighlights(userId: string) {
    return (StoryHighlightModel as any).getByUser(userId);
  }

  /**
   * افزودن استوری به highlight
   */
  public async addStoryToHighlight(highlightId: string, userId: string, storyId: string) {
    const highlight = await StoryHighlightModel.findOne({ _id: highlightId, user: userId });

    if (!highlight) {
      return null;
    }

    await (highlight as any).addStory(storyId);

    // تنظیم highlightedUntil برای استوری
    await StoryModel.updateOne(
      { _id: storyId },
      { highlightedUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }
    );

    return highlight;
  }

  /**
   * حذف استوری از highlight
   */
  public async removeStoryFromHighlight(highlightId: string, userId: string, storyId: string) {
    const highlight = await StoryHighlightModel.findOne({ _id: highlightId, user: userId });

    if (!highlight) {
      return null;
    }

    await (highlight as any).removeStory(storyId);
    return highlight;
  }

  /**
   * به‌روزرسانی highlight
   */
  public async updateHighlight(
    highlightId: string,
    userId: string,
    updates: { title?: string; coverImage?: string; order?: number }
  ) {
    const highlight = await StoryHighlightModel.findOne({ _id: highlightId, user: userId });

    if (!highlight) {
      return null;
    }

    if (updates.title) highlight.title = updates.title;
    if (updates.coverImage) highlight.coverImage = updates.coverImage;
    if (updates.order !== undefined) highlight.order = updates.order;

    await highlight.save();
    return highlight;
  }

  /**
   * حذف highlight
   */
  public async deleteHighlight(highlightId: string, userId: string, userRole?: string): Promise<boolean> {
    // Admins can delete any highlight
    const isAdmin = userRole === "admin" || userRole === "super_admin";

    let highlight;
    if (isAdmin) {
      // Admin can delete any highlight
      highlight = await StoryHighlightModel.findById(highlightId);
    } else {
      // Regular users can only delete their own highlights
      highlight = await StoryHighlightModel.findOne({ _id: highlightId, user: userId });
    }

    if (!highlight) {
      return false;
    }

    await highlight.deleteOne();
    return true;
  }

  /**
   * دریافت تمام استوری‌ها برای ادمین (با فیلتر و صفحه‌بندی)
   */
  public async getAllStoriesForAdmin(filters: {
    type?: string;
    privacy?: string;
    search?: string;
    userId?: string;
    page: number;
    limit: number;
  }): Promise<{ stories: IStory[]; total: number }> {
    const query: any = {};

    // Filter by type
    if (filters.type) {
      query.type = filters.type;
    }

    // Filter by privacy
    if (filters.privacy) {
      query.privacy = filters.privacy;
    }

    // Filter by user
    if (filters.userId) {
      query.user = filters.userId;
    }

    // Search in caption or text
    if (filters.search) {
      query.$or = [
        { caption: { $regex: filters.search, $options: "i" } },
        { text: { $regex: filters.search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit;

    // Get total count
    const total = await StoryModel.countDocuments(query);

    // Get stories with pagination
    const stories = await StoryModel.find(query)
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(filters.limit)
      .lean();

    return { stories: stories as IStory[], total };
  }

  /**
   * دریافت تمام highlights برای ادمین (با فیلتر و صفحه‌بندی)
   */
  public async getAllHighlightsForAdmin(filters: {
    search?: string;
    userId?: string;
    page: number;
    limit: number;
  }): Promise<{ highlights: any[]; total: number }> {
    const query: any = { isActive: true };

    // Filter by user
    if (filters.userId) {
      query.user = filters.userId;
    }

    // Search in title
    if (filters.search) {
      query.title = { $regex: filters.search, $options: "i" };
    }

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit;

    // Get total count
    const total = await StoryHighlightModel.countDocuments(query);

    // Get highlights with pagination
    const highlights = await StoryHighlightModel.find(query)
      .populate("user", "name email avatar")
      .populate("stories", "type media.thumbnail caption")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(filters.limit)
      .lean();

    return { highlights, total };
  }

  /**
   * Cleanup استوری‌های منقضی شده
   */
  public async cleanupExpiredStories(): Promise<number> {
    const result = await (StoryModel as any).deleteExpired();
    return result.deletedCount || 0;
  }

  /**
   * ارسال نوتیفیکیشن به followers
   */
  private async notifyFollowers(userId: string, story: IStory) {
    try {
      const { socketService } = await import("../notifications/socket.service");
      const FollowModel = await import("../social/follow.model").then((m) => m.FollowModel);

      // دریافت followers
      const followers = await FollowModel.find({
        following: userId,
        followType: "user",
      }).select("follower");

      const followerIds = followers.map((f: any) => f.follower.toString());

      // ارسال real-time notification
      await socketService.emitToUsers(followerIds, "story:new", {
        story: story,
        user: (story.user as any),
      });
    } catch (error) {
      console.error("Failed to notify followers:", error);
    }
  }
}

export const storyService = new StoryService();
