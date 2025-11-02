import { Router } from "express";
import { notificationController } from "./notification.controller";
import { protect } from "../auth/auth.middleware";

const router = Router();

// All routes require authentication
router.use(protect);

// ==================== NOTIFICATIONS ====================

/**
 * GET /api/v1/notifications
 * دریافت نوتیفیکیشن‌های کاربر
 */
router.get("/", notificationController.getNotifications);

/**
 * GET /api/v1/notifications/grouped
 * دریافت نوتیفیکیشن‌های گروه‌بندی شده
 */
router.get("/grouped", notificationController.getGroupedNotifications);

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
router.post("/:id/read", notificationController.markAsRead);

/**
 * POST /api/v1/notifications/mark-all-read
 * مارک کردن همه نوتیفیکیشن‌ها به عنوان خوانده شده
 */
router.post("/mark-all-read", notificationController.markAllAsRead);

/**
 * DELETE /api/v1/notifications/:id
 * حذف نوتیفیکیشن
 */
router.delete("/:id", notificationController.deleteNotification);

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
router.put("/preferences", notificationController.updatePreferences);

/**
 * POST /api/v1/notifications/preferences/toggle-channel
 * فعال/غیرفعال کردن کانال
 */
router.post("/preferences/toggle-channel", notificationController.toggleChannel);

/**
 * POST /api/v1/notifications/preferences/mute-type
 * Mute کردن نوع خاص
 */
router.post("/preferences/mute-type", notificationController.muteType);

/**
 * POST /api/v1/notifications/preferences/global-mute
 * فعال/غیرفعال global mute
 */
router.post("/preferences/global-mute", notificationController.toggleGlobalMute);

// ==================== PUSH TOKENS ====================

/**
 * POST /api/v1/notifications/push-token
 * ثبت Push notification token
 */
router.post("/push-token", notificationController.registerPushToken);

/**
 * DELETE /api/v1/notifications/push-token/:token
 * حذف Push notification token
 */
router.delete("/push-token/:token", notificationController.removePushToken);

export default router;
