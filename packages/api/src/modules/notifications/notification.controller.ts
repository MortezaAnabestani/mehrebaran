import { Request, Response } from "express";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";
import { notificationService } from "./notification.service";
import { notificationPreferencesService } from "./notificationPreferences.service";
import { PushTokenModel } from "./pushToken.model";
import { getParam } from "../../core/utils/getParam";

class NotificationController {
  // ==================== NOTIFICATIONS ====================

  /**
   * GET /api/v1/notifications
   * دریافت نوتیفیکیشن‌های کاربر
   */
  public getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { type, isRead, limit, skip } = req.query;

    const notifications = await notificationService.getUserNotifications(userId, {
      type: type as any,
      isRead: isRead === "true" ? true : isRead === "false" ? false : undefined,
      limit: parseInt(limit as string) || 20,
      skip: parseInt(skip as string) || 0,
    });

    res.status(200).json({
      message: "نوتیفیکیشن‌ها با موفقیت دریافت شد.",
      data: notifications,
    });
  });

  /**
   * GET /api/v1/notifications/grouped
   * دریافت نوتیفیکیشن‌های گروه‌بندی شده
   */
  public getGroupedNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { limit } = req.query;

    const groups = await notificationService.getGroupedNotifications(userId, parseInt(limit as string) || 20);

    res.status(200).json({
      message: "نوتیفیکیشن‌های گروه‌بندی شده با موفقیت دریافت شد.",
      data: groups,
    });
  });

  /**
   * GET /api/v1/notifications/unread-count
   * تعداد نوتیفیکیشن‌های خوانده نشده
   */
  public getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const count = await notificationService.getUnreadCount(userId);

    res.status(200).json({
      message: "تعداد نوتیفیکیشن‌های خوانده نشده دریافت شد.",
      data: { count },
    });
  });

  /**
   * POST /api/v1/notifications/:id/read
   * مارک کردن نوتیفیکیشن به عنوان خوانده شده
   */
  public markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const notification = await notificationService.markAsRead(getParam(id), userId);

    if (!notification) {
      throw new ApiError(404, "نوتیفیکیشن یافت نشد.");
    }

    res.status(200).json({
      message: "نوتیفیکیشن به عنوان خوانده شده علامت‌گذاری شد.",
      data: notification,
    });
  });

  /**
   * POST /api/v1/notifications/mark-all-read
   * مارک کردن همه نوتیفیکیشن‌ها به عنوان خوانده شده
   */
  public markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    await notificationService.markAllAsRead(userId);

    res.status(200).json({
      message: "همه نوتیفیکیشن‌ها به عنوان خوانده شده علامت‌گذاری شدند.",
    });
  });

  /**
   * DELETE /api/v1/notifications/:id
   * حذف نوتیفیکیشن
   */
  public deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const success = await notificationService.deleteNotification(getParam(id), userId);

    if (!success) {
      throw new ApiError(404, "نوتیفیکیشن یافت نشد.");
    }

    res.status(200).json({
      message: "نوتیفیکیشن حذف شد.",
    });
  });

  /**
   * DELETE /api/v1/notifications/read
   * حذف همه نوتیفیکیشن‌های خوانده شده
   */
  public deleteAllRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const count = await notificationService.deleteAllRead(userId);

    res.status(200).json({
      message: `${count} نوتیفیکیشن حذف شد.`,
      data: { count },
    });
  });

  /**
   * GET /api/v1/notifications/stats
   * آمار نوتیفیکیشن‌های کاربر
   */
  public getStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const stats = await notificationService.getUserStats(userId);

    res.status(200).json({
      message: "آمار نوتیفیکیشن‌ها دریافت شد.",
      data: stats,
    });
  });

  // ==================== PREFERENCES ====================

  /**
   * GET /api/v1/notifications/preferences
   * دریافت تنظیمات نوتیفیکیشن
   */
  public getPreferences = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const prefs = await notificationPreferencesService.getOrCreate(userId);

    res.status(200).json({
      message: "تنظیمات نوتیفیکیشن دریافت شد.",
      data: prefs,
    });
  });

  /**
   * PUT /api/v1/notifications/preferences
   * به‌روزرسانی تنظیمات نوتیفیکیشن
   */
  public updatePreferences = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const prefs = await notificationPreferencesService.update(userId, req.body);

    res.status(200).json({
      message: "تنظیمات نوتیفیکیشن به‌روزرسانی شد.",
      data: prefs,
    });
  });

  /**
   * POST /api/v1/notifications/preferences/toggle-channel
   * فعال/غیرفعال کردن کانال
   */
  public toggleChannel = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { channel, enabled } = req.body;

    const prefs = await notificationPreferencesService.toggleChannel(userId, channel, enabled);

    res.status(200).json({
      message: `کانال ${channel} ${enabled ? "فعال" : "غیرفعال"} شد.`,
      data: prefs,
    });
  });

  /**
   * POST /api/v1/notifications/preferences/mute-type
   * Mute کردن نوع خاص
   */
  public muteType = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { type } = req.body;

    const prefs = await notificationPreferencesService.muteType(userId, type);

    res.status(200).json({
      message: `نوع ${type} خاموش شد.`,
      data: prefs,
    });
  });

  /**
   * POST /api/v1/notifications/preferences/global-mute
   * فعال/غیرفعال global mute
   */
  public toggleGlobalMute = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { mute, muteUntil } = req.body;

    const prefs = await notificationPreferencesService.toggleGlobalMute(
      userId,
      mute,
      muteUntil ? new Date(muteUntil) : undefined,
    );

    res.status(200).json({
      message: mute ? "نوتیفیکیشن‌ها خاموش شدند." : "نوتیفیکیشن‌ها روشن شدند.",
      data: prefs,
    });
  });

  // ==================== PUSH TOKENS ====================

  /**
   * POST /api/v1/notifications/push-token
   * ثبت Push notification token
   */
  public registerPushToken = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { token, platform, deviceId } = req.body;

    const pushToken = await PushTokenModel.findOneAndUpdate(
      { token },
      {
        user: userId,
        token,
        platform,
        deviceId,
        isActive: true,
        lastUsedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    res.status(200).json({
      message: "توکن push notification ثبت شد.",
      data: pushToken,
    });
  });

  /**
   * DELETE /api/v1/notifications/push-token/:token
   * حذف Push notification token
   */
  public removePushToken = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { token } = req.params;

    await PushTokenModel.updateOne({ user: userId, token }, { isActive: false });

    res.status(200).json({
      message: "توکن push notification حذف شد.",
    });
  });

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * GET /api/v1/notifications/admin/stats
   * دریافت آمار کل نوتیفیکیشن‌های شبکه (Admin)
   */
  public getNetworkStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await notificationService.getNetworkStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  /**
   * GET /api/v1/notifications/admin/all
   * دریافت همه نوتیفیکیشن‌ها (Admin)
   */
  public getAllNotifications = asyncHandler(async (req: Request, res: Response) => {
    const { type, priority, isRead, recipientId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await notificationService.getAllNotifications({
      type: type as any,
      priority: priority as any,
      isRead: isRead === "true" ? true : isRead === "false" ? false : undefined,
      recipientId: recipientId as string,
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    res.status(200).json({
      success: true,
      data: result.notifications,
      page,
      limit,
      total: result.total,
      totalPages,
    });
  });

  /**
   * GET /api/v1/notifications/admin/push-tokens/stats
   * دریافت آمار Push Tokens شبکه (Admin)
   */
  public getPushTokenStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await notificationService.getPushTokenStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  /**
   * GET /api/v1/notifications/admin/push-tokens
   * دریافت همه Push Tokens (Admin)
   */
  public getAllPushTokens = asyncHandler(async (req: Request, res: Response) => {
    const { platform, isActive, userId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await notificationService.getAllPushTokens({
      platform: platform as string,
      isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
      userId: userId as string,
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    res.status(200).json({
      success: true,
      data: result.tokens,
      page,
      limit,
      total: result.total,
      totalPages,
    });
  });

  /**
   * DELETE /api/v1/notifications/admin/cleanup
   * حذف نوتیفیکیشن‌های قدیمی (Admin)
   */
  public cleanupOldNotifications = asyncHandler(async (req: Request, res: Response) => {
    const daysOld = parseInt(req.query.daysOld as string) || 90;
    const deletedCount = await notificationService.deleteOldNotifications(daysOld);

    res.status(200).json({
      success: true,
      message: `${deletedCount} نوتیفیکیشن قدیمی حذف شد.`,
      data: { deletedCount },
    });
  });
}

export const notificationController = new NotificationController();
