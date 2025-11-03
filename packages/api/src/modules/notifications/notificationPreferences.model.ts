import { Schema, model, Types } from "mongoose";
import type {
  INotificationPreferences,
  INotificationChannelPreference,
  NotificationType,
} from "common-types";

const channelPreferenceSchema = new Schema<INotificationChannelPreference>(
  {
    enabled: {
      type: Boolean,
      default: true,
    },
    types: {
      type: [String],
      enum: [
        "mention",
        "follow",
        "follow_need",
        "badge_earned",
        "level_up",
        "need_update",
        "need_completed",
        "need_support",
        "task_assigned",
        "task_completed",
        "milestone_completed",
        "team_invitation",
        "team_joined",
        "team_left",
        "comment_posted",
        "comment_reply",
        "direct_message",
        "verification_approved",
        "verification_rejected",
        "admin_announcement",
        "system_alert",
      ] as NotificationType[],
      default: function() {
        // همه انواع به صورت پیش‌فرض فعال هستند
        return [
          "mention",
          "follow",
          "follow_need",
          "badge_earned",
          "level_up",
          "need_update",
          "need_completed",
          "need_support",
          "task_assigned",
          "task_completed",
          "milestone_completed",
          "team_invitation",
          "team_joined",
          "team_left",
          "comment_posted",
          "comment_reply",
          "direct_message",
          "verification_approved",
          "verification_rejected",
          "admin_announcement",
          "system_alert",
        ];
      },
    },
  },
  { _id: false }
);

const notificationPreferencesSchema = new Schema<INotificationPreferences>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // Channel preferences
    in_app: {
      type: channelPreferenceSchema,
      default: () => ({
        enabled: true,
        types: [
          "mention",
          "follow",
          "follow_need",
          "badge_earned",
          "level_up",
          "need_update",
          "need_completed",
          "need_support",
          "task_assigned",
          "task_completed",
          "milestone_completed",
          "team_invitation",
          "team_joined",
          "team_left",
          "comment_posted",
          "comment_reply",
          "direct_message",
          "verification_approved",
          "verification_rejected",
          "admin_announcement",
          "system_alert",
        ],
      }),
    },
    email: {
      type: channelPreferenceSchema,
      default: () => ({
        enabled: true,
        types: [
          "mention",
          "follow",
          "badge_earned",
          "level_up",
          "need_completed",
          "task_assigned",
          "team_invitation",
          "verification_approved",
          "verification_rejected",
          "admin_announcement",
        ],
      }),
    },
    push: {
      type: channelPreferenceSchema,
      default: () => ({
        enabled: true,
        types: [
          "mention",
          "direct_message",
          "task_assigned",
          "team_invitation",
          "comment_reply",
          "admin_announcement",
        ],
      }),
    },
    sms: {
      type: channelPreferenceSchema,
      default: () => ({
        enabled: false,
        types: ["team_invitation", "admin_announcement", "system_alert"],
      }),
    },

    // Global settings
    globalMute: {
      type: Boolean,
      default: false,
    },
    muteUntil: Date,

    // Type-specific settings
    mutedTypes: {
      type: [String],
      enum: [
        "mention",
        "follow",
        "follow_need",
        "badge_earned",
        "level_up",
        "need_update",
        "need_completed",
        "need_support",
        "task_assigned",
        "task_completed",
        "milestone_completed",
        "team_invitation",
        "team_joined",
        "team_left",
        "comment_posted",
        "comment_reply",
        "direct_message",
        "verification_approved",
        "verification_rejected",
        "admin_announcement",
        "system_alert",
      ] as NotificationType[],
      default: [],
    },

    // Quiet hours
    quietHoursEnabled: {
      type: Boolean,
      default: false,
    },
    quietHoursStart: String,
    quietHoursEnd: String,

    // Digest settings
    emailDigest: {
      enabled: { type: Boolean, default: false },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "never"],
        default: "never",
      },
      time: String,
      dayOfWeek: Number,
    },

    // Advanced
    groupSimilar: {
      type: Boolean,
      default: true,
    },
    maxPerDay: Number,
  },
  {
    timestamps: true,
  }
);

// ============= Instance Methods =============

notificationPreferencesSchema.methods.isChannelEnabled = function (
  channel: "in_app" | "email" | "push" | "sms",
  type: NotificationType
): boolean {
  // بررسی globalMute
  if (this.globalMute) return false;

  // بررسی muteUntil
  if (this.muteUntil && new Date() < this.muteUntil) return false;

  // بررسی mutedTypes
  if (this.mutedTypes.includes(type)) return false;

  // بررسی کانال خاص
  const channelPref = this[channel];
  if (!channelPref || !channelPref.enabled) return false;

  // بررسی نوع در کانال
  return channelPref.types.includes(type);
};

notificationPreferencesSchema.methods.isInQuietHours = function (): boolean {
  if (!this.quietHoursEnabled || !this.quietHoursStart || !this.quietHoursEnd) {
    return false;
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const start = this.quietHoursStart;
  const end = this.quietHoursEnd;

  // اگر quiet hours از نیمه شب عبور می‌کند
  if (start > end) {
    return currentTime >= start || currentTime <= end;
  }

  return currentTime >= start && currentTime <= end;
};

// ============= Static Methods =============

notificationPreferencesSchema.statics.getOrCreate = async function (userId: string) {
  let prefs = await this.findOne({ user: userId });

  if (!prefs) {
    prefs = await this.create({ user: userId });
  }

  return prefs;
};

export const NotificationPreferencesModel = model<INotificationPreferences>(
  "NotificationPreferences",
  notificationPreferencesSchema
);
