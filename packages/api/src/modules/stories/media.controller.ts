import { Request, Response } from "express";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";
import { mediaService } from "./media.service";
import type { MediaCategory } from "common-types";

class MediaController {
  /**
   * POST /api/v1/media/upload
   * آپلود فایل media
   */
  public uploadMedia = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    // بررسی وجود فایل
    if (!req.file) {
      throw new ApiError(400, "فایل الزامی است.");
    }

    const {
      category,
      relatedModel,
      relatedId,
      isPublic,
      altText,
      caption,
      generateThumbnails,
    } = req.body;

    if (!category) {
      throw new ApiError(400, "دسته‌بندی media الزامی است.");
    }

    const result = await mediaService.uploadMedia(userId, req.file, {
      category: category as MediaCategory,
      relatedModel,
      relatedId,
      isPublic: isPublic !== "false",
      altText,
      caption,
      generateThumbnails: generateThumbnails === "true",
    });

    res.status(201).json({
      message: "فایل با موفقیت آپلود شد.",
      data: result.media,
    });
  });

  /**
   * GET /api/v1/media/:id
   * دریافت media بر اساس ID
   */
  public getMediaById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const media = await mediaService.getMediaById(id);

    if (!media) {
      throw new ApiError(404, "فایل یافت نشد.");
    }

    // افزایش شمارنده views
    await mediaService.incrementViews(id);

    res.status(200).json({
      message: "فایل با موفقیت دریافت شد.",
      data: media,
    });
  });

  /**
   * GET /api/v1/media/user/:userId
   * دریافت media های کاربر
   */
  public getUserMedia = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { category, limit, skip } = req.query;

    const media = await mediaService.getUserMedia(
      userId,
      category as MediaCategory,
      parseInt(limit as string) || 50,
      parseInt(skip as string) || 0
    );

    res.status(200).json({
      message: "فایل‌های کاربر با موفقیت دریافت شد.",
      data: media,
    });
  });

  /**
   * GET /api/v1/media/related/:model/:id
   * دریافت media های مرتبط با موجودیت
   */
  public getRelatedMedia = asyncHandler(async (req: Request, res: Response) => {
    const { model, id } = req.params;

    const media = await mediaService.getRelatedMedia(model, id);

    res.status(200).json({
      message: "فایل‌های مرتبط با موفقیت دریافت شد.",
      data: media,
    });
  });

  /**
   * DELETE /api/v1/media/:id
   * حذف media
   */
  public deleteMedia = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const success = await mediaService.deleteMedia(id, userId);

    if (!success) {
      throw new ApiError(404, "فایل یافت نشد یا شما صاحب آن نیستید.");
    }

    res.status(200).json({
      message: "فایل حذف شد.",
    });
  });

  /**
   * GET /api/v1/media/stats
   * آمار media کاربر
   */
  public getStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const stats = await mediaService.getUserMediaStats(userId);

    res.status(200).json({
      message: "آمار فایل‌ها دریافت شد.",
      data: stats,
    });
  });

  /**
   * GET /api/v1/media/storage
   * دریافت کل حجم فایل‌های کاربر
   */
  public getTotalStorage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const totalSize = await mediaService.getTotalUserStorage(userId);

    res.status(200).json({
      message: "حجم کل فایل‌ها دریافت شد.",
      data: {
        totalSize,
        totalSizeInMB: (totalSize / (1024 * 1024)).toFixed(2),
      },
    });
  });

  /**
   * POST /api/v1/media/:id/download
   * افزایش شمارنده downloads
   */
  public incrementDownloads = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await mediaService.incrementDownloads(id);

    res.status(200).json({
      message: "شمارنده دانلود به‌روز شد.",
    });
  });
}

export const mediaController = new MediaController();
