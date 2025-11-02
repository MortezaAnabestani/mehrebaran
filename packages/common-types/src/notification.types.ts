import { Types } from "mongoose";
import { IUser } from "./user.types";
import { INeed } from "./need.types";
import { ITeam } from "./team.types";

// ============= Notification Types =============

export type NotificationType =
  | "mention" // منشن شدن در کامنت/پیام
  | "follow" // فالو شدن توسط کاربر
  | "follow_need" // فالو شدن نیاز
  | "badge_earned" // دریافت نشان
  | "level_up" // ارتقا سطح
  | "need_update" // به‌روزرسانی نیاز
  | "need_completed" // تکمیل نیاز
  | "need_support" // حمایت از نیاز
  | "task_assigned" // تخصیص تسک
  | "task_completed" // تکمیل تسک
  | "milestone_completed" // تکمیل milestone
  | "team_invitation" // دعوت به تیم
  | "team_joined" // عضویت در تیم
  | "team_left" // خروج از تیم
  | "comment_posted" // کامنت جدید
  | "comment_reply" // پاسخ به کامنت
  | "direct_message" // پیام مستقیم
  | "verification_approved" // تایید احراز هویت
  | "verification_rejected" // رد احراز هویت
  | "admin_announcement" // اعلان ادمین
  | "system_alert"; // هشدار سیستم

export type NotificationChannel = "in_app" | "email" | "push" | "sms";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface INotification {
  _id: string;
  recipient: IUser | string | Types.ObjectId;
  type: NotificationType;
  title: string;
  titleEn?: string;
  message: string;
  messageEn?: string;
  priority: NotificationPriority;

  // Related entities
  actor?: IUser | string | Types.ObjectId; // کاربری که این اکشن را انجام داده
  relatedModel?: string; // Need, Task, Team, Comment, etc.
  relatedId?: string;
  relatedEntity?: any; // Populated entity

  // Notification state
  isRead: boolean;
  readAt?: Date;

  // Delivery status
  channels: NotificationChannel[];
  deliveryStatus: {
    in_app?: {
      delivered: boolean;
      deliveredAt?: Date;
    };
    email?: {
      sent: boolean;
      sentAt?: Date;
      failureReason?: string;
    };
    push?: {
      sent: boolean;
      sentAt?: Date;
      failureReason?: string;
    };
    sms?: {
      sent: boolean;
      sentAt?: Date;
      failureReason?: string;
    };
  };

  // UI related
  icon?: string;
  color?: string;
  actionUrl?: string; // URL to navigate when clicked
  actionLabel?: string;

  // Grouping (for notification center)
  groupKey?: string; // برای گروه‌بندی نوتیفیکیشن‌های مشابه

  // Metadata
  metadata?: Record<string, any>;

  // Expiry
  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// ============= Notification Preferences Types =============

export interface INotificationChannelPreference {
  enabled: boolean;
  types: NotificationType[]; // انواع نوتیفیکیشنی که برای این کانال فعال است
}

export interface INotificationPreferences {
  _id: string;
  user: IUser | string | Types.ObjectId;

  // Channel preferences
  in_app: INotificationChannelPreference;
  email: INotificationChannelPreference;
  push: INotificationChannelPreference;
  sms: INotificationChannelPreference;

  // Global settings
  globalMute: boolean; // خاموش کردن کل نوتیفیکیشن‌ها
  muteUntil?: Date; // خاموش کردن تا زمان مشخص

  // Type-specific settings
  mutedTypes: NotificationType[]; // انواع خاص که mute شده‌اند

  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // "22:00"
  quietHoursEnd?: string; // "08:00"

  // Digest settings (برای ایمیل)
  emailDigest: {
    enabled: boolean;
    frequency: "daily" | "weekly" | "never";
    time?: string; // "09:00"
    dayOfWeek?: number; // 0-6 for weekly digest
  };

  // Advanced
  groupSimilar: boolean; // گروه‌بندی نوتیفیکیشن‌های مشابه
  maxPerDay?: number; // حداکثر تعداد نوتیفیکیشن در روز

  createdAt: Date;
  updatedAt: Date;
}

// ============= Real-time Event Types =============

export type RealTimeEventType =
  | "notification:new" // نوتیفیکیشن جدید
  | "notification:read" // خواندن نوتیفیکیشن
  | "notification:deleted" // حذف نوتیفیکیشن
  | "need:created" // ایجاد نیاز جدید
  | "need:updated" // به‌روزرسانی نیاز
  | "need:status_changed" // تغییر وضعیت نیاز
  | "comment:new" // کامنت جدید
  | "comment:updated" // به‌روزرسانی کامنت
  | "task:assigned" // تخصیص تسک
  | "task:status_changed" // تغییر وضعیت تسک
  | "team:invitation" // دعوت به تیم
  | "team:member_joined" // عضویت در تیم
  | "message:new" // پیام جدید
  | "message:typing" // در حال تایپ
  | "user:online" // آنلاین شدن کاربر
  | "user:offline" // آفلاین شدن کاربر
  | "badge:earned" // دریافت نشان
  | "level:up"; // ارتقا سطح

export interface IRealTimeEvent {
  type: RealTimeEventType;
  payload: any;
  timestamp: Date;
  userId?: string; // کاربری که رویداد برای او است
  actorId?: string; // کاربری که رویداد را ایجاد کرده
  roomId?: string; // اتاق socket.io (برای team, need, etc.)
}

// ============= Socket Connection Types =============

export interface ISocketUser {
  userId: string;
  socketId: string;
  connectedAt: Date;
  lastActivity: Date;
  rooms: string[]; // اتاق‌هایی که عضو است (needs, teams, etc.)
}

export interface ITypingIndicator {
  userId: string;
  userName: string;
  roomId: string;
  timestamp: Date;
}

// ============= Notification Template Types =============

export interface INotificationTemplate {
  type: NotificationType;
  title: {
    fa: string;
    en: string;
  };
  message: {
    fa: string;
    en: string;
  };
  icon?: string;
  color?: string;
  priority: NotificationPriority;
  defaultChannels: NotificationChannel[];
  variables: string[]; // متغیرهای قابل جایگزینی در template
}

// ============= Notification Stats Types =============

export interface INotificationStats {
  userId: string;
  totalReceived: number;
  totalRead: number;
  totalUnread: number;
  readRate: number; // درصد خوانده شده
  byType: Record<NotificationType, {
    total: number;
    read: number;
    unread: number;
  }>;
  byChannel: Record<NotificationChannel, {
    delivered: number;
    failed: number;
  }>;
  lastReceivedAt?: Date;
  lastReadAt?: Date;
}

// ============= Notification Batch Types =============

export interface INotificationBatch {
  _id: string;
  type: "broadcast" | "targeted"; // همگانی یا هدفمند
  title: string;
  message: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];

  // Targeting
  recipientFilter?: {
    roles?: string[];
    locations?: string[];
    minLevel?: number;
    categories?: string[]; // علاقه‌مند به این دسته‌بندی‌ها
  };
  recipients?: string[]; // لیست مستقیم دریافت‌کنندگان

  // Scheduling
  scheduledFor?: Date;
  expiresAt?: Date;

  // Status
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  sentCount: number;
  failedCount: number;

  // Metadata
  createdBy: IUser | string | Types.ObjectId;
  createdAt: Date;
  sentAt?: Date;
}

// ============= Push Notification Types =============

export interface IPushNotificationToken {
  _id: string;
  user: IUser | string | Types.ObjectId;
  token: string; // FCM/APNS token
  platform: "ios" | "android" | "web";
  deviceId?: string;
  isActive: boolean;
  lastUsedAt: Date;
  createdAt: Date;
}

export interface IPushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: number;
  sound?: string;
  clickAction?: string;
  data?: Record<string, any>;
}

// ============= Email Notification Types =============

export interface IEmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
  template?: string;
  variables?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType: string;
  }>;
}

// ============= Notification Group Types =============

export interface INotificationGroup {
  groupKey: string;
  type: NotificationType;
  count: number;
  latestNotification: INotification;
  notifications: INotification[];
  firstCreatedAt: Date;
  lastCreatedAt: Date;
}
