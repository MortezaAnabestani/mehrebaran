import { Request, Response } from "express";
import { followService } from "./follow.service";
import { mentionService } from "./mention.service";
import { tagService } from "./tag.service";
import { shareService } from "./share.service";
import { logShareSchema } from "./social.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";
import ResponseFormatter from "../../utils/ResponseFormatter";

class SocialController {
  // ==================== FOLLOW SYSTEM ====================

  // Follow a user
  public followUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const followerId = req.user!._id.toString();

    const follow = await followService.followUser(followerId, userId);

    return ResponseFormatter.created(res, follow, "کاربر با موفقیت دنبال شد.");
  });

  // Unfollow a user
  public unfollowUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const followerId = req.user!._id.toString();

    await followService.unfollowUser(followerId, userId);

    return ResponseFormatter.success(res, null, "دنبال کردن کاربر لغو شد.");
  });

  // Follow a need
  public followNeed = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const followerId = req.user!._id.toString();

    const follow = await followService.followNeed(followerId, needId);

    return ResponseFormatter.created(res, follow, "نیاز با موفقیت دنبال شد.");
  });

  // Unfollow a need
  public unfollowNeed = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const followerId = req.user!._id.toString();

    await followService.unfollowNeed(followerId, needId);

    return ResponseFormatter.success(res, null, "دنبال کردن نیاز لغو شد.");
  });

  // Get user's followers
  public getUserFollowers = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { page, limit } = ResponseFormatter.extractPaginationParams(req.query);

    const followers = await followService.getUserFollowers(userId, limit, (page - 1) * limit);
    const total = followers.length; // TODO: Get actual count from service

    const pagination = ResponseFormatter.getPaginationInfo(page, limit, total);
    return ResponseFormatter.successWithPagination(res, followers, pagination);
  });

  // Get user's following
  public getUserFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { page, limit } = ResponseFormatter.extractPaginationParams(req.query);

    const following = await followService.getUserFollowing(userId, limit, (page - 1) * limit);
    const total = following.length; // TODO: Get actual count from service

    const pagination = ResponseFormatter.getPaginationInfo(page, limit, total);
    return ResponseFormatter.successWithPagination(res, following, pagination);
  });

  // Get user's followed needs
  public getUserFollowedNeeds = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { page, limit } = ResponseFormatter.extractPaginationParams(req.query);

    const needs = await followService.getUserFollowedNeeds(userId, limit, (page - 1) * limit);
    const total = needs.length; // TODO: Get actual count from service

    const pagination = ResponseFormatter.getPaginationInfo(page, limit, total);
    return ResponseFormatter.successWithPagination(res, needs, pagination);
  });

  // Get need's followers
  public getNeedFollowers = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const { page, limit } = ResponseFormatter.extractPaginationParams(req.query);

    const followers = await followService.getNeedFollowers(needId, limit, (page - 1) * limit);
    const total = followers.length; // TODO: Get actual count from service

    const pagination = ResponseFormatter.getPaginationInfo(page, limit, total);
    return ResponseFormatter.successWithPagination(res, followers, pagination);
  });

  // Get follow stats
  public getUserFollowStats = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const stats = await followService.getUserFollowStats(userId);

    return ResponseFormatter.success(res, stats);
  });

  // Get suggested users to follow
  public getSuggestedUsers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const suggestions = await followService.getSuggestedUsers(userId, limit);

    return ResponseFormatter.success(res, suggestions);
  });

  // ==================== MENTIONS SYSTEM ====================

  // Get user's mentions
  public getUserMentions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { isRead, context } = req.query;
    const { page, limit } = ResponseFormatter.extractPaginationParams(req.query);

    const mentions = await mentionService.getUserMentions(
      userId,
      {
        isRead: isRead === "true" ? true : isRead === "false" ? false : undefined,
        context: context as any,
      },
      limit,
      (page - 1) * limit
    );

    const total = mentions.length; // TODO: Get actual count from service
    const pagination = ResponseFormatter.getPaginationInfo(page, limit, total);
    return ResponseFormatter.successWithPagination(res, mentions, pagination);
  });

  // Mark mention as read
  public markMentionAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { mentionId } = req.params;
    const userId = req.user!._id.toString();

    const mention = await mentionService.markAsRead(mentionId, userId);

    if (!mention) {
      return ResponseFormatter.notFound(res, "منشن یافت نشد.");
    }

    return ResponseFormatter.success(res, mention, "منشن به عنوان خوانده شده علامت‌گذاری شد.");
  });

  // Mark all mentions as read
  public markAllMentionsAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const count = await mentionService.markAllAsRead(userId);

    return ResponseFormatter.success(
      res,
      { count },
      `${count} منشن به عنوان خوانده شده علامت‌گذاری شد.`
    );
  });

  // Get unread mention count
  public getUnreadMentionCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const count = await mentionService.getUnreadCount(userId);

    return ResponseFormatter.success(res, { count });
  });

  // ==================== TAGS SYSTEM ====================

  // Get popular tags
  public getPopularTags = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const tags = await tagService.getPopularTags(limit);

    return ResponseFormatter.success(res, tags);
  });

  // Get trending tags
  public getTrendingTags = asyncHandler(async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const tags = await tagService.getTrendingTags(days, limit);

    return ResponseFormatter.success(res, tags);
  });

  // Search tags
  public searchTags = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return ResponseFormatter.badRequest(res, "پارامتر جستجو الزامی است.");
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const tags = await tagService.searchTags(q, limit);

    return ResponseFormatter.success(res, tags);
  });

  // Get needs by tag
  public getNeedsByTag = asyncHandler(async (req: Request, res: Response) => {
    const { tag } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const needs = await tagService.getNeedsByTag(tag, limit);

    return ResponseFormatter.success(res, needs);
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

    return ResponseFormatter.created(res, shareLog, "اشتراک‌گذاری با موفقیت ثبت شد.");
  });

  // Get item share stats
  public getItemShareStats = asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const stats = await shareService.getItemShareStats(itemId, "need");

    return ResponseFormatter.success(res, stats);
  });

  // Get top shared items
  public getTopSharedItems = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const topShared = await shareService.getTopSharedItems("need", limit);

    return ResponseFormatter.success(res, topShared);
  });

  // Get OG metadata for sharing
  public getOGMetadata = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const metadata = await shareService.generateOGMetadata(needId);

    if (!metadata) {
      return ResponseFormatter.notFound(res, "نیاز یافت نشد.");
    }

    return ResponseFormatter.success(res, metadata);
  });

  // Get share URL
  public getShareUrl = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const { platform } = req.query;

    if (!platform || typeof platform !== "string") {
      return ResponseFormatter.badRequest(res, "پلتفرم الزامی است.");
    }

    const baseUrl = process.env.FRONTEND_URL || "https://mehrebaran.org";
    const itemUrl = `${baseUrl}/needs/${needId}`;

    const shareUrl = shareService.getShareUrl(platform as any, itemUrl);

    return ResponseFormatter.success(res, { shareUrl });
  });
}

export const socialController = new SocialController();
