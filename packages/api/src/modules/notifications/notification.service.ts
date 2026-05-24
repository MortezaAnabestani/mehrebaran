import { Model, Types } from "mongoose";
import { NotificationModel } from "./notification.model";
import { NotificationPreferencesModel } from "./notificationPreferences.model";
import { PushTokenModel } from "./pushToken.model";
import type {
  INotification,
  NotificationType,
  NotificationChannel,
  NotificationPriority,
  INotificationGroup,
} from "common-types";

// این سرویس‌ها را بعداً import می‌کنیم
// import { emailService } from "./email.service";
// import { pushService } from "./push.service";
// import { smsService } from "./sms.service";

interface CreateNotificationOptions {
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  titleEn?: string;
  messageEn?: string;
  priority?: NotificationPriority;
  actor?: string;
  relatedModel?: string;
  relatedId?: string;
  channels?: NotificationChannel[];
  icon?: string;
  color?: string;
  actionUrl?: string;
  actionLabel?: string;
  groupKey?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

class NotificationService {
  private NotificationModel: typeof NotificationModel;
  private NotificationPreferencesModel: typeof NotificationPreferencesModel;
  private PushTokenModel: typeof PushTokenModel;

  constructor() {
    this.NotificationModel = NotificationModel;
    this.NotificationPreferencesModel = NotificationPreferencesModel;
    this.PushTokenModel = PushTokenModel;
  }

  /**
   * ایجاد و ارسال نوتیفیکیشن
   */
  public async create(options: CreateNotificationOptions): Promise<INotification> {
    const {
      recipient,
      type,
      title,
      message,
      priority = "normal",
      channels = ["in_app"],
      ...rest
    } = options;

    // بررسی preferences کاربر
    const prefs = await (this.NotificationPreferencesModel as any).getOrCreate(recipient);

    // فیلتر کانال‌ها بر اساس preferences
    const enabledChannels = channels.filter((channel) => {
      if (channel === "in_app") return true; // in_app همیشه فعال است
      return prefs.isChannelEnabled(channel as any, type);
    });

    // بررسی quiet hours برای email و push
    const isQuietHours = prefs.isInQuietHours();
    const finalChannels = enabledChannels.filter((channel) => {
      if (isQuietHours && (channel === "email" || channel === "push")) {
        return false;
      }
      return true;
    });

    // ایجاد notification در دیتابیس
    const notification = await this.NotificationModel.create({
      recipient,
      type,
      title,
      message,
      priority,
      channels: finalChannels,
      ...rest,
    });

    // Populate actor
    await notification.populate("actor", "name email avatar");

    // ارسال به کانال‌های مختلف
    await this.deliverToChannels(notification, finalChannels);

    return notification;
  }

  /**
   * ارسال نوتیفیکیشن به کانال‌های مختلف
   */
  private async deliverToChannels(
    notification: INotification,
    channels: NotificationChannel[]
  ): Promise<void> {
    const promises: Promise<any>[] = [];

    for (const channel of channels) {
      switch (channel) {
        case "in_app":
          // in_app notification already created in DB
          // Real-time delivery will be handled by Socket.io
          promises.push(this.deliverRealtime(notification));
          break;

        case "email":
          promises.push(this.deliverEmail(notification));
          break;

        case "push":
          promises.push(this.deliverPush(notification));
          break;

        case "sms":
          promises.push(this.deliverSMS(notification));
          break;
      }
    }

    await Promise.allSettled(promises);
  }

  /**
   * ارسال real-time با Socket.io
   */
  private async deliverRealtime(notification: INotification): Promise<void> {
    try {
      // این بخش در socketService پیاده‌سازی خواهد شد
      const { socketService } = await import("./socket.service");
      await socketService.emitToUser(
        notification.recipient.toString(),
        "notification:new",
        notification
      );
    } catch (error) {
      console.error("Failed to deliver real-time notification:", error);
    }
  }

  /**
   * ارسال ایمیل
   */
  private async deliverEmail(notification: INotification): Promise<void> {
    try {
      // TODO: پیاده‌سازی email service
      // await emailService.sendNotificationEmail(notification);

      notification.deliveryStatus.email = {
        sent: true,
        sentAt: new Date(),
      };
      await (notification as any).save();
    } catch (error: any) {
      console.error("Failed to deliver email notification:", error);
      notification.deliveryStatus.email = {
        sent: false,
        failureReason: error.message,
      };
      await (notification as any).save();
    }
  }

  /**
   * ارسال push notification
   */
  private async deliverPush(notification: INotification): Promise<void> {
    try {
      // دریافت توکن‌های push کاربر
      const tokens = await (this.PushTokenModel as any).getUserTokens(
        notification.recipient.toString()
      );

      if (tokens.length === 0) {
        throw new Error("No push tokens found for user");
      }

      // TODO: پیاده‌سازی push service
      // await pushService.sendToTokens(tokens, notification);

      notification.deliveryStatus.push = {
        sent: true,
        sentAt: new Date(),
      };
      await (notification as any).save();
    } catch (error: any) {
      console.error("Failed to deliver push notification:", error);
      notification.deliveryStatus.push = {
        sent: false,
        failureReason: error.message,
      };
      await (notification as any).save();
    }
  }

  /**
   * ارسال SMS
   */
  private async deliverSMS(notification: INotification): Promise<void> {
    try {
      // TODO: پیاده‌سازی SMS service
      // await smsService.sendNotificationSMS(notification);

      notification.deliveryStatus.sms = {
        sent: true,
        sentAt: new Date(),
      };
      await (notification as any).save();
    } catch (error: any) {
      console.error("Failed to deliver SMS notification:", error);
      notification.deliveryStatus.sms = {
        sent: false,
        failureReason: error.message,
      };
      await (notification as any).save();
    }
  }

  /**
   * دریافت نوتیفیکیشن‌های کاربر
   */
  public async getUserNotifications(
    userId: string,
    options: {
      type?: NotificationType;
      isRead?: boolean;
      limit?: number;
      skip?: number;
    } = {}
  ): Promise<INotification[]> {
    const { type, isRead, limit = 20, skip = 0 } = options;

    const query: any = { recipient: userId };
    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead;

    return this.NotificationModel.find(query)
      .populate("actor", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
  }

  /**
   * دریافت نوتیفیکیشن‌های گروه‌بندی شده
   */
  public async getGroupedNotifications(
    userId: string,
    limit: number = 20
  ): Promise<INotificationGroup[]> {
    const notifications = await this.NotificationModel.find({ recipient: userId })
      .populate("actor", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 5) // دریافت بیشتر برای گروه‌بندی
      .lean();

    // گروه‌بندی بر اساس groupKey
    const groups = new Map<string, INotificationGroup>();

    for (const notification of notifications) {
      const key = notification.groupKey || notification._id.toString();

      if (groups.has(key)) {
        const group = groups.get(key)!;
        group.count++;
        group.notifications.push(notification);
        group.lastCreatedAt = notification.createdAt;
      } else {
        groups.set(key, {
          groupKey: key,
          type: notification.type,
          count: 1,
          latestNotification: notification,
          notifications: [notification],
          firstCreatedAt: notification.createdAt,
          lastCreatedAt: notification.createdAt,
        });
      }
    }

    return Array.from(groups.values()).slice(0, limit);
  }

  /**
   * تعداد نوتیفیکیشن‌های خوانده نشده
   */
  public async getUnreadCount(userId: string): Promise<number> {
    return (this.NotificationModel as any).getUnreadCount(userId);
  }

  /**
   * مارک کردن به عنوان خوانده شده
   */
  public async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    const notification = await this.NotificationModel.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) return null;

    await (notification as any).markAsRead();

    // ارسال رویداد real-time
    try {
      const { socketService } = await import("./socket.service");
      await socketService.emitToUser(userId, "notification:read", {
        notificationId,
      });
    } catch (error) {
      console.error("Failed to emit read event:", error);
    }

    return notification;
  }

  /**
   * مارک کردن همه به عنوان خوانده شده
   */
  public async markAllAsRead(userId: string): Promise<void> {
    await (this.NotificationModel as any).markAllAsRead(userId);

    // ارسال رویداد real-time
    try {
      const { socketService } = await import("./socket.service");
      await socketService.emitToUser(userId, "notification:all_read", {});
    } catch (error) {
      console.error("Failed to emit all read event:", error);
    }
  }

  /**
   * حذف نوتیفیکیشن
   */
  public async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    const result = await this.NotificationModel.deleteOne({
      _id: notificationId,
      recipient: userId,
    });

    if (result.deletedCount > 0) {
      // ارسال رویداد real-time
      try {
        const { socketService } = await import("./socket.service");
        await socketService.emitToUser(userId, "notification:deleted", {
          notificationId,
        });
      } catch (error) {
        console.error("Failed to emit delete event:", error);
      }

      return true;
    }

    return false;
  }

  /**
   * حذف همه نوتیفیکیشن‌های خوانده شده
   */
  public async deleteAllRead(userId: string): Promise<number> {
    const result = await this.NotificationModel.deleteMany({
      recipient: userId,
      isRead: true,
    });

    return result.deletedCount || 0;
  }

  /**
   * Cleanup نوتیفیکیشن‌های منقضی شده
   */
  public async cleanupExpired(): Promise<number> {
    const result = await (this.NotificationModel as any).deleteExpired();
    return result.deletedCount || 0;
  }

  /**
   * ارسال نوتیفیکیشن گروهی (Broadcast)
   */
  public async broadcast(
    options: {
      type: NotificationType;
      title: string;
      message: string;
      titleEn?: string;
      messageEn?: string;
      priority?: NotificationPriority;
      channels?: NotificationChannel[];
      recipientFilter?: {
        roles?: string[];
        locations?: string[];
        minLevel?: number;
      };
      icon?: string;
      color?: string;
      actionUrl?: string;
    }
  ): Promise<number> {
    // دریافت لیست دریافت‌کنندگان بر اساس فیلتر
    // دریافت لیست دریافت‌کنندگان بر اساس فیلتر
    const UserModel = await import("../users/user.model").then((m) => m.UserModel);

    const query: any = {};
    if (options.recipientFilter?.roles) {
      query.role = { $in: options.recipientFilter.roles };
    }

    const users = await UserModel.find(query).select("_id").lean();


    // ارسال نوتیفیکیشن به همه
    const notifications = users.map((user: any) =>
      this.create({
        recipient: user._id.toString(),
        type: options.type,
        title: options.title,
        message: options.message,
        titleEn: options.titleEn,
        messageEn: options.messageEn,
        priority: options.priority,
        channels: options.channels,
        icon: options.icon,
        color: options.color,
        actionUrl: options.actionUrl,
        groupKey: `broadcast_${Date.now()}`,
      })
    );

    await Promise.allSettled(notifications);

    return users.length;
  }

  /**
   * دریافت آمار نوتیفیکیشن‌های کاربر
   */
  public async getUserStats(userId: string) {
    const [total, unread, readToday] = await Promise.all([
      this.NotificationModel.countDocuments({ recipient: userId }),
      this.NotificationModel.countDocuments({ recipient: userId, isRead: false }),
      this.NotificationModel.countDocuments({
        recipient: userId,
        isRead: true,
        readAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    ]);

    // آمار بر اساس نوع
    const byType = await this.NotificationModel.aggregate([
      { $match: { recipient: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$type",
          total: { $sum: 1 },
          unread: { $sum: { $cond: ["$isRead", 0, 1] } },
        },
      },
    ]);

    return {
      total,
      unread,
      read: total - unread,
      readToday,
      readRate: total > 0 ? ((total - unread) / total) * 100 : 0,
      byType: byType.reduce((acc: any, item: any) => {
        acc[item._id] = {
          total: item.total,
          unread: item.unread,
          read: item.total - item.unread,
        };
        return acc;
      }, {}),
    };
  }

  // ==================== ADMIN METHODS ====================

  /**
   * دریافت آمار کل نوتیفیکیشن‌های شبکه (Admin)
   */
  public async getNetworkStats(): Promise<any> {
    const totalNotifications = await this.NotificationModel.countDocuments();
    const unreadNotifications = await this.NotificationModel.countDocuments({ isRead: false });
    const readNotifications = totalNotifications - unreadNotifications;

    // نوتیفیکیشن‌های 30 روز اخیر
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentNotifications = await this.NotificationModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // نوتیفیکیشن‌های امروز
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNotifications = await this.NotificationModel.countDocuments({
      createdAt: { $gte: today },
    });

    // توزیع بر اساس نوع
    const byType = await this.NotificationModel.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          unread: { $sum: { $cond: ["$isRead", 0, 1] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // توزیع بر اساس اولویت
    const byPriority = await this.NotificationModel.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // توزیع بر اساس کانال
    const byChannel = await this.NotificationModel.aggregate([
      { $unwind: "$channels" },
      {
        $group: {
          _id: "$channels",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // کاربران با بیشترین نوتیفیکیشن دریافتی
    const topRecipients = await this.NotificationModel.aggregate([
      {
        $group: {
          _id: "$recipient",
          notificationCount: { $sum: 1 },
          unreadCount: { $sum: { $cond: ["$isRead", 0, 1] } },
        },
      },
      { $sort: { notificationCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$_id",
          notificationCount: 1,
          unreadCount: 1,
          name: "$user.name",
          email: "$user.email",
          avatar: "$user.avatar",
        },
      },
    ]);

    // نرخ تحویل به کانال‌های مختلف
    const deliveryStats = await this.NotificationModel.aggregate([
      {
        $facet: {
          email: [
            { $match: { "deliveryStatus.email": { $exists: true } } },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                successful: {
                  $sum: { $cond: ["$deliveryStatus.email.sent", 1, 0] },
                },
              },
            },
          ],
          push: [
            { $match: { "deliveryStatus.push": { $exists: true } } },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                successful: {
                  $sum: { $cond: ["$deliveryStatus.push.sent", 1, 0] },
                },
              },
            },
          ],
          sms: [
            { $match: { "deliveryStatus.sms": { $exists: true } } },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                successful: {
                  $sum: { $cond: ["$deliveryStatus.sms.sent", 1, 0] },
                },
              },
            },
          ],
        },
      },
    ]);

    return {
      totalNotifications,
      unreadNotifications,
      readNotifications,
      recentNotifications,
      todayNotifications,
      readRate: totalNotifications > 0 ? (readNotifications / totalNotifications) * 100 : 0,
      byType,
      byPriority,
      byChannel,
      topRecipients,
      deliveryStats: {
        email: deliveryStats[0].email[0] || { total: 0, successful: 0 },
        push: deliveryStats[0].push[0] || { total: 0, successful: 0 },
        sms: deliveryStats[0].sms[0] || { total: 0, successful: 0 },
      },
    };
  }

  /**
   * دریافت همه نوتیفیکیشن‌ها با فیلتر و صفحه‌بندی (Admin)
   */
  public async getAllNotifications(filters: {
    type?: NotificationType;
    priority?: NotificationPriority;
    isRead?: boolean;
    recipientId?: string;
    page: number;
    limit: number;
  }): Promise<{ notifications: any[]; total: number }> {
    const query: any = {};

    if (filters.type) query.type = filters.type;
    if (filters.priority) query.priority = filters.priority;
    if (filters.isRead !== undefined) query.isRead = filters.isRead;
    if (filters.recipientId) query.recipient = filters.recipientId;

    const skip = (filters.page - 1) * filters.limit;
    const total = await this.NotificationModel.countDocuments(query);

    const notifications = await this.NotificationModel.find(query)
      .populate("recipient", "name email avatar")
      .populate("actor", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(filters.limit)
      .lean();

    return { notifications, total };
  }

  /**
   * دریافت آمار Push Tokens شبکه (Admin)
   */
  public async getPushTokenStats(): Promise<any> {
    const totalTokens = await this.PushTokenModel.countDocuments();
    const activeTokens = await this.PushTokenModel.countDocuments({ isActive: true });

    // توزیع بر اساس پلتفرم
    const byPlatform = await this.PushTokenModel.aggregate([
      {
        $group: {
          _id: "$platform",
          count: { $sum: 1 },
          active: { $sum: { $cond: ["$isActive", 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // کاربران با بیشترین دستگاه
    const usersWithMostDevices = await this.PushTokenModel.aggregate([
      {
        $group: {
          _id: "$user",
          deviceCount: { $sum: 1 },
          activeDevices: { $sum: { $cond: ["$isActive", 1, 0] } },
        },
      },
      { $sort: { deviceCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$_id",
          deviceCount: 1,
          activeDevices: 1,
          name: "$user.name",
          email: "$user.email",
        },
      },
    ]);

    return {
      totalTokens,
      activeTokens,
      inactiveTokens: totalTokens - activeTokens,
      byPlatform,
      usersWithMostDevices,
    };
  }

  /**
   * دریافت همه Push Tokens با فیلتر (Admin)
   */
  public async getAllPushTokens(filters: {
    platform?: string;
    isActive?: boolean;
    userId?: string;
    page: number;
    limit: number;
  }): Promise<{ tokens: any[]; total: number }> {
    const query: any = {};

    if (filters.platform) query.platform = filters.platform;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.userId) query.user = filters.userId;

    const skip = (filters.page - 1) * filters.limit;
    const total = await this.PushTokenModel.countDocuments(query);

    const tokens = await this.PushTokenModel.find(query)
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(filters.limit)
      .lean();

    return { tokens, total };
  }

  /**
   * حذف نوتیفیکیشن‌های قدیمی (Admin Cleanup)
   */
  public async deleteOldNotifications(daysOld: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.NotificationModel.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true,
    });

    return result.deletedCount || 0;
  }
}

export const notificationService = new NotificationService();
