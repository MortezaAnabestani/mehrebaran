import { Request, Response } from "express";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";
import { storyService } from "./story.service";
import type { StoryType, StoryPrivacy } from "common-types";

class StoryController {
  // ==================== STORIES ====================

  /**
   * POST /api/v1/stories
   * ایجاد استوری جدید
   */
  public createStory = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const {
      type,
      mediaId,
      text,
      backgroundColor,
      textColor,
      fontFamily,
      caption,
      privacy,
      allowedUsers,
      linkedNeedId,
      linkedUrl,
      allowReplies,
      allowSharing,
      expiresAt
    } = req.body;

    // Validation
    if (type === "text" && !text) {
      throw new ApiError(400, "متن استوری الزامی است.");
    }

    if ((type === "image" || type === "video") && !mediaId) {
      throw new ApiError(400, "مدیا برای استوری الزامی است.");
    }

    const story = await storyService.createStory(userId, {
      type: type as StoryType,
      mediaId,
      text,
      backgroundColor,
      textColor,
      fontFamily,
      caption,
      privacy: privacy as StoryPrivacy || "followers",
      allowedUsers,
      linkedNeedId,
      linkedUrl,
      allowReplies,
      allowSharing,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    res.status(201).json({
      message: "استوری با موفقیت ایجاد شد.",
      data: story,
    });
  });

  /**
   * GET /api/v1/stories/feed
   * دریافت فید استوری‌ها
   */
  public getStoryFeed = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const feed = await storyService.getStoryFeed(userId);

    res.status(200).json({
      message: "فید استوری‌ها با موفقیت دریافت شد.",
      data: feed,
    });
  });

  /**
   * GET /api/v1/stories/user/:userId
   * دریافت استوری‌های کاربر
   */
  public getUserStories = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const currentUserId = req.user!._id.toString();

    const stories = await storyService.getUserStories(userId);

    // بررسی دسترسی
    if (stories.length > 0) {
      const firstStory = stories[0];
      if (firstStory.privacy === "close_friends" && currentUserId !== userId) {
        // TODO: بررسی لیست close friends
        throw new ApiError(403, "دسترسی به استوری‌های این کاربر ندارید.");
      }
      if (firstStory.privacy === "custom" && !firstStory.allowedUsers?.includes(currentUserId)) {
        throw new ApiError(403, "دسترسی به استوری‌های این کاربر ندارید.");
      }
    }

    res.status(200).json({
      message: "استوری‌های کاربر با موفقیت دریافت شد.",
      data: stories,
    });
  });

  /**
   * GET /api/v1/stories/:id
   * دریافت استوری بر اساس ID
   */
  public getStoryById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.user!._id.toString();

    const story = await storyService.getStoryById(id);

    if (!story) {
      throw new ApiError(404, "استوری یافت نشد.");
    }

    // بررسی دسترسی
    const storyUserId = typeof story.user === "string" ? story.user : story.user._id.toString();

    if (story.privacy === "close_friends" && currentUserId !== storyUserId) {
      throw new ApiError(403, "دسترسی به این استوری ندارید.");
    }
    if (story.privacy === "custom" && !story.allowedUsers?.includes(currentUserId)) {
      throw new ApiError(403, "دسترسی به این استوری ندارید.");
    }

    res.status(200).json({
      message: "استوری با موفقیت دریافت شد.",
      data: story,
    });
  });

  /**
   * POST /api/v1/stories/:id/view
   * مشاهده استوری
   */
  public viewStory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();
    const { viewDuration } = req.body;

    const story = await storyService.viewStory(id, userId, viewDuration);

    if (!story) {
      throw new ApiError(404, "استوری یافت نشد.");
    }

    res.status(200).json({
      message: "استوری مشاهده شد.",
      data: story,
    });
  });

  /**
   * POST /api/v1/stories/:id/react
   * افزودن ری‌اکشن به استوری
   */
  public addReaction = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();
    const { emoji } = req.body;

    if (!emoji) {
      throw new ApiError(400, "ایموجی الزامی است.");
    }

    const story = await storyService.addReaction(id, userId, emoji);

    if (!story) {
      throw new ApiError(404, "استوری یافت نشد.");
    }

    res.status(200).json({
      message: "ری‌اکشن با موفقیت افزوده شد.",
      data: story,
    });
  });

  /**
   * DELETE /api/v1/stories/:id/react
   * حذف ری‌اکشن از استوری
   */
  public removeReaction = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const story = await storyService.removeReaction(id, userId);

    if (!story) {
      throw new ApiError(404, "استوری یافت نشد.");
    }

    res.status(200).json({
      message: "ری‌اکشن حذف شد.",
      data: story,
    });
  });

  /**
   * DELETE /api/v1/stories/:id
   * حذف استوری
   */
  public deleteStory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const success = await storyService.deleteStory(id, userId);

    if (!success) {
      throw new ApiError(404, "استوری یافت نشد یا شما صاحب این استوری نیستید.");
    }

    res.status(200).json({
      message: "استوری حذف شد.",
    });
  });

  /**
   * GET /api/v1/stories/:id/viewers
   * دریافت لیست بیننده‌های استوری
   */
  public getViewers = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const viewers = await storyService.getStoryViewers(id, userId);

    res.status(200).json({
      message: "لیست بیننده‌ها با موفقیت دریافت شد.",
      data: viewers,
    });
  });

  /**
   * GET /api/v1/stories/stats
   * آمار استوری‌های کاربر
   */
  public getStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const stats = await storyService.getUserStoryStats(userId);

    res.status(200).json({
      message: "آمار استوری‌ها دریافت شد.",
      data: stats,
    });
  });

  // ==================== HIGHLIGHTS ====================

  /**
   * POST /api/v1/stories/highlights
   * ایجاد هایلایت
   */
  public createHighlight = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { title, coverImage, storyIds } = req.body;

    if (!title || !coverImage) {
      throw new ApiError(400, "عنوان و تصویر کاور الزامی است.");
    }

    const highlight = await storyService.createHighlight(userId, title, coverImage, storyIds || []);

    res.status(201).json({
      message: "هایلایت با موفقیت ایجاد شد.",
      data: highlight,
    });
  });

  /**
   * GET /api/v1/stories/highlights/user/:userId
   * دریافت هایلایت‌های کاربر
   */
  public getUserHighlights = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const highlights = await storyService.getUserHighlights(userId);

    res.status(200).json({
      message: "هایلایت‌ها با موفقیت دریافت شد.",
      data: highlights,
    });
  });

  /**
   * POST /api/v1/stories/highlights/:id/add-story
   * افزودن استوری به هایلایت
   */
  public addStoryToHighlight = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();
    const { storyId } = req.body;

    if (!storyId) {
      throw new ApiError(400, "شناسه استوری الزامی است.");
    }

    const highlight = await storyService.addStoryToHighlight(id, userId, storyId);

    if (!highlight) {
      throw new ApiError(404, "هایلایت یافت نشد یا شما صاحب آن نیستید.");
    }

    res.status(200).json({
      message: "استوری به هایلایت افزوده شد.",
      data: highlight,
    });
  });

  /**
   * DELETE /api/v1/stories/highlights/:id/remove-story/:storyId
   * حذف استوری از هایلایت
   */
  public removeStoryFromHighlight = asyncHandler(async (req: Request, res: Response) => {
    const { id, storyId } = req.params;
    const userId = req.user!._id.toString();

    const highlight = await storyService.removeStoryFromHighlight(id, userId, storyId);

    if (!highlight) {
      throw new ApiError(404, "هایلایت یافت نشد یا شما صاحب آن نیستید.");
    }

    res.status(200).json({
      message: "استوری از هایلایت حذف شد.",
      data: highlight,
    });
  });

  /**
   * PUT /api/v1/stories/highlights/:id
   * به‌روزرسانی هایلایت
   */
  public updateHighlight = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();
    const { title, coverImage, order } = req.body;

    const highlight = await storyService.updateHighlight(id, userId, { title, coverImage, order });

    if (!highlight) {
      throw new ApiError(404, "هایلایت یافت نشد یا شما صاحب آن نیستید.");
    }

    res.status(200).json({
      message: "هایلایت به‌روزرسانی شد.",
      data: highlight,
    });
  });

  /**
   * DELETE /api/v1/stories/highlights/:id
   * حذف هایلایت
   */
  public deleteHighlight = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const success = await storyService.deleteHighlight(id, userId);

    if (!success) {
      throw new ApiError(404, "هایلایت یافت نشد یا شما صاحب آن نیستید.");
    }

    res.status(200).json({
      message: "هایلایت حذف شد.",
    });
  });
}

export const storyController = new StoryController();
