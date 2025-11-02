import { Router } from "express";
import { notificationController } from "./notification.controller";
import { protect } from "../auth/auth.middleware";
import { validate } from "../../core/middlewares/validate";
import {
  getNotificationsSchema,
  getGroupedNotificationsSchema,
  notificationIdParamSchema,
  updatePreferencesSchema,
  toggleChannelSchema,
  muteTypeSchema,
  toggleGlobalMuteSchema,
  registerPushTokenSchema,
  pushTokenParamSchema,
} from "./notification.validation";

const router = Router();

// All routes require authentication
router.use(protect);

// ==================== NOTIFICATIONS ====================

/**
 * GET /api/v1/notifications
 * دریافت نوتیفیکیشن‌های کاربر
 */
router.get("/", validate(getNotificationsSchema), notificationController.getNotifications);

/**
 * GET /api/v1/notifications/grouped
 * دریافت نوتیفیکیشن‌های گروه‌بندی شده
 */
router.get("/grouped", validate(getGroupedNotificationsSchema), notificationController.getGroupedNotifications);

/**
 * GET /api/v1/notifications/unread-count
 * تعداد نوتیفیکیشن‌های خوانده نشده
 */
router.get("/unread-count", notificationController.getUnreadCount);

/**
 * GET /api/v1/notifications/stats
 * آمار نوتیفیکیشن‌های کاربر
 */
router.get("/stats", notificationController.getStats);

/**
 * POST /api/v1/notifications/:id/read
 * مارک کردن نوتیفیکیشن به عنوان خوانده شده
 */
router.post("/:id/read", validate(notificationIdParamSchema), notificationController.markAsRead);

/**
 * POST /api/v1/notifications/mark-all-read
 * مارک کردن همه نوتیفیکیشن‌ها به عنوان خوانده شده
 */
router.post("/mark-all-read", notificationController.markAllAsRead);

/**
 * DELETE /api/v1/notifications/:id
 * حذف نوتیفیکیشن
 */
router.delete("/:id", validate(notificationIdParamSchema), notificationController.deleteNotification);

/**
 * DELETE /api/v1/notifications/read
 * حذف همه نوتیفیکیشن‌های خوانده شده
 */
router.delete("/read", notificationController.deleteAllRead);

// ==================== PREFERENCES ====================

/**
 * GET /api/v1/notifications/preferences
 * دریافت تنظیمات نوتیفیکیشن
 */
router.get("/preferences", notificationController.getPreferences);

/**
 * PUT /api/v1/notifications/preferences
 * به‌روزرسانی تنظیمات نوتیفیکیشن
 */
router.put("/preferences", validate(updatePreferencesSchema), notificationController.updatePreferences);

/**
 * POST /api/v1/notifications/preferences/toggle-channel
 * فعال/غیرفعال کردن کانال
 */
router.post("/preferences/toggle-channel", validate(toggleChannelSchema), notificationController.toggleChannel);

/**
 * POST /api/v1/notifications/preferences/mute-type
 * Mute کردن نوع خاص
 */
router.post("/preferences/mute-type", validate(muteTypeSchema), notificationController.muteType);

/**
 * POST /api/v1/notifications/preferences/global-mute
 * فعال/غیرفعال global mute
 */
router.post("/preferences/global-mute", validate(toggleGlobalMuteSchema), notificationController.toggleGlobalMute);

// ==================== PUSH TOKENS ====================

/**
 * POST /api/v1/notifications/push-token
 * ثبت Push notification token
 */
router.post("/push-token", validate(registerPushTokenSchema), notificationController.registerPushToken);

/**
 * DELETE /api/v1/notifications/push-token/:token
 * حذف Push notification token
 */
router.delete("/push-token/:token", validate(pushTokenParamSchema), notificationController.removePushToken);

export default router;
