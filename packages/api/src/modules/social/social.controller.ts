import { Request, Response } from "express";
import { followService } from "./follow.service";
import { mentionService } from "./mention.service";
import { tagService } from "./tag.service";
import { shareService } from "./share.service";
import { logShareSchema } from "./social.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class SocialController {
  // ==================== FOLLOW SYSTEM ====================

  // Follow a user
  public followUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const followerId = req.user!._id.toString();

    const follow = await followService.followUser(followerId, userId);

    res.status(201).json({
      message: "کاربر با موفقیت دنبال شد.",
      data: follow,
    });
  });

  // Unfollow a user
  public unfollowUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const followerId = req.user!._id.toString();

    await followService.unfollowUser(followerId, userId);

    res.status(200).json({
      message: "دنبال کردن کاربر لغو شد.",
    });
  });

  // Follow a need
  public followNeed = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const followerId = req.user!._id.toString();

    const follow = await followService.followNeed(followerId, needId);

    res.status(201).json({
      message: "نیاز با موفقیت دنبال شد.",
      data: follow,
    });
  });

  // Unfollow a need
  public unfollowNeed = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const followerId = req.user!._id.toString();

    await followService.unfollowNeed(followerId, needId);

    res.status(200).json({
      message: "دنبال کردن نیاز لغو شد.",
    });
  });

  // Get user's followers
  public getUserFollowers = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

    const followers = await followService.getUserFollowers(userId, limit, skip);

    res.status(200).json({
      results: followers.length,
      data: followers,
    });
  });

  // Get user's following
  public getUserFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

    const following = await followService.getUserFollowing(userId, limit, skip);

    res.status(200).json({
      results: following.length,
      data: following,
    });
  });

  // Get user's followed needs
  public getUserFollowedNeeds = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

    const needs = await followService.getUserFollowedNeeds(userId, limit, skip);

    res.status(200).json({
      results: needs.length,
      data: needs,
    });
  });

  // Get need's followers
  public getNeedFollowers = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

    const followers = await followService.getNeedFollowers(needId, limit, skip);

    res.status(200).json({
      results: followers.length,
      data: followers,
    });
  });

  // Get follow stats
  public getUserFollowStats = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const stats = await followService.getUserFollowStats(userId);

    res.status(200).json({
      data: stats,
    });
  });

  // Get suggested users to follow
  public getSuggestedUsers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const suggestions = await followService.getSuggestedUsers(userId, limit);

    res.status(200).json({
      results: suggestions.length,
      data: suggestions,
    });
  });

  // ==================== MENTIONS SYSTEM ====================

  // Get user's mentions
  public getUserMentions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { isRead, context } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

    const mentions = await mentionService.getUserMentions(
      userId,
      {
        isRead: isRead === "true" ? true : isRead === "false" ? false : undefined,
        context: context as any,
      },
      limit,
      skip
    );

    res.status(200).json({
      results: mentions.length,
      data: mentions,
    });
  });

  // Mark mention as read
  public markMentionAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { mentionId } = req.params;
    const userId = req.user!._id.toString();

    const mention = await mentionService.markAsRead(mentionId, userId);

    if (!mention) {
      throw new ApiError(404, "منشن یافت نشد.");
    }

    res.status(200).json({
      message: "منشن به عنوان خوانده شده علامت‌گذاری شد.",
      data: mention,
    });
  });

  // Mark all mentions as read
  public markAllMentionsAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const count = await mentionService.markAllAsRead(userId);

    res.status(200).json({
      message: `${count} منشن به عنوان خوانده شده علامت‌گذاری شد.`,
      data: { count },
    });
  });

  // Get unread mention count
  public getUnreadMentionCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const count = await mentionService.getUnreadCount(userId);

    res.status(200).json({
      data: { count },
    });
  });

  // ==================== TAGS SYSTEM ====================

  // Get popular tags
  public getPopularTags = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const tags = await tagService.getPopularTags(limit);

    res.status(200).json({
      results: tags.length,
      data: tags,
    });
  });

  // Get trending tags
  public getTrendingTags = asyncHandler(async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const tags = await tagService.getTrendingTags(days, limit);

    res.status(200).json({
      results: tags.length,
      data: tags,
    });
  });

  // Search tags
  public searchTags = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      throw new ApiError(400, "پارامتر جستجو الزامی است.");
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const tags = await tagService.searchTags(q, limit);

    res.status(200).json({
      results: tags.length,
      data: tags,
    });
  });

  // Get needs by tag
  public getNeedsByTag = asyncHandler(async (req: Request, res: Response) => {
    const { tag } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const needs = await tagService.getNeedsByTag(tag, limit);

    res.status(200).json({
      results: needs.length,
      data: needs,
    });
  });

  // ==================== SHARE SYSTEM ====================

  // Log a share
  public logShare = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = logShareSchema.parse({ body: req.body });
    const userId = req.user?._id.toString();

    const shareLog = await shareService.logShare({
      userId,
      sharedItemId: validatedData.body.sharedItemId,
      sharedItemType: "need",
      platform: validatedData.body.platform,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      referrer: req.get("referer"),
      metadata: validatedData.body.metadata,
    });

    res.status(201).json({
      message: "اشتراک‌گذاری با موفقیت ثبت شد.",
      data: shareLog,
    });
  });

  // Get item share stats
  public getItemShareStats = asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const stats = await shareService.getItemShareStats(itemId, "need");

    res.status(200).json({
      data: stats,
    });
  });

  // Get top shared items
  public getTopSharedItems = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const topShared = await shareService.getTopSharedItems("need", limit);

    res.status(200).json({
      results: topShared.length,
      data: topShared,
    });
  });

  // Get OG metadata for sharing
  public getOGMetadata = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const metadata = await shareService.generateOGMetadata(needId);

    if (!metadata) {
      throw new ApiError(404, "نیاز یافت نشد.");
    }

    res.status(200).json({
      data: metadata,
    });
  });

  // Get share URL
  public getShareUrl = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const { platform } = req.query;

    if (!platform || typeof platform !== "string") {
      throw new ApiError(400, "پلتفرم الزامی است.");
    }

    const baseUrl = process.env.FRONTEND_URL || "https://mehrebaran.org";
    const itemUrl = `${baseUrl}/needs/${needId}`;

    const shareUrl = shareService.getShareUrl(platform as any, itemUrl);

    res.status(200).json({
      data: { shareUrl },
    });
  });
}

export const socialController = new SocialController();
