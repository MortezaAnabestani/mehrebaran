import { NotificationPreferencesModel } from "./notificationPreferences.model";
import type { INotificationPreferences, NotificationType, NotificationChannel } from "common-types";

class NotificationPreferencesService {
  private NotificationPreferencesModel: typeof NotificationPreferencesModel;

  constructor() {
    this.NotificationPreferencesModel = NotificationPreferencesModel;
  }

  /**
   * دریافت یا ایجاد preferences کاربر
   */
  public async getOrCreate(userId: string): Promise<INotificationPreferences> {
    return (this.NotificationPreferencesModel as any).getOrCreate(userId);
  }

  /**
   * به‌روزرسانی preferences
   */
  public async update(
    userId: string,
    updates: Partial<INotificationPreferences>
  ): Promise<INotificationPreferences | null> {
    return this.NotificationPreferencesModel.findOneAndUpdate(
      { user: userId },
      { $set: updates },
      { new: true, upsert: true }
    );
  }

  /**
   * فعال/غیرفعال کردن کانال خاص
   */
  public async toggleChannel(
    userId: string,
    channel: "in_app" | "email" | "push" | "sms",
    enabled: boolean
  ): Promise<INotificationPreferences | null> {
    const prefs = await this.getOrCreate(userId);
    prefs[channel].enabled = enabled;
    return (prefs as any).save();
  }

  /**
   * افزودن/حذف نوع نوتیفیکیشن از کانال
   */
  public async toggleTypeInChannel(
    userId: string,
    channel: "in_app" | "email" | "push" | "sms",
    type: NotificationType,
    enabled: boolean
  ): Promise<INotificationPreferences | null> {
    const prefs = await this.getOrCreate(userId);

    if (enabled) {
      // اضافه کردن اگر وجود ندارد
      if (!prefs[channel].types.includes(type)) {
        prefs[channel].types.push(type);
      }
    } else {
      // حذف کردن
      prefs[channel].types = prefs[channel].types.filter((t) => t !== type);
    }

    return (prefs as any).save();
  }

  /**
   * Mute کردن نوع خاص
   */
  public async muteType(userId: string, type: NotificationType): Promise<INotificationPreferences | null> {
    const prefs = await this.getOrCreate(userId);

    if (!prefs.mutedTypes.includes(type)) {
      prefs.mutedTypes.push(type);
      return (prefs as any).save();
    }

    return prefs;
  }

  /**
   * Unmute کردن نوع خاص
   */
  public async unmuteType(userId: string, type: NotificationType): Promise<INotificationPreferences | null> {
    const prefs = await this.getOrCreate(userId);
    prefs.mutedTypes = prefs.mutedTypes.filter((t) => t !== type);
    return (prefs as any).save();
  }

  /**
   * فعال/غیرفعال global mute
   */
  public async toggleGlobalMute(userId: string, mute: boolean, muteUntil?: Date): Promise<INotificationPreferences | null> {
    const prefs = await this.getOrCreate(userId);
    prefs.globalMute = mute;
    prefs.muteUntil = muteUntil;
    return (prefs as any).save();
  }

  /**
   * تنظیم quiet hours
   */
  public async setQuietHours(
    userId: string,
    enabled: boolean,
    start?: string,
    end?: string
  ): Promise<INotificationPreferences | null> {
    const prefs = await this.getOrCreate(userId);
    prefs.quietHoursEnabled = enabled;
    prefs.quietHoursStart = start;
    prefs.quietHoursEnd = end;
    return (prefs as any).save();
  }

  /**
   * تنظیم email digest
   */
  public async setEmailDigest(
    userId: string,
    enabled: boolean,
    frequency: "daily" | "weekly" | "never",
    time?: string,
    dayOfWeek?: number
  ): Promise<INotificationPreferences | null> {
    const prefs = await this.getOrCreate(userId);
    prefs.emailDigest = {
      enabled,
      frequency,
      time,
      dayOfWeek,
    };
    return (prefs as any).save();
  }

  /**
   * بررسی فعال بودن کانال برای نوع خاص
   */
  public async isChannelEnabledForType(
    userId: string,
    channel: "in_app" | "email" | "push" | "sms",
    type: NotificationType
  ): Promise<boolean> {
    const prefs = await this.getOrCreate(userId);
    return (prefs as any).isChannelEnabled(channel, type);
  }
}

export const notificationPreferencesService = new NotificationPreferencesService();
