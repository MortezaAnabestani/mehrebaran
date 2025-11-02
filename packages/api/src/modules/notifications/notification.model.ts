import { Schema, model, Types } from "mongoose";
import type {
  INotification,
  NotificationType,
  NotificationChannel,
  NotificationPriority,
} from "common-types";

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
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
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    titleEn: String,
    message: {
      type: String,
      required: true,
    },
    messageEn: String,
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"] as NotificationPriority[],
      default: "normal",
      index: true,
    },

    // Related entities
    actor: {
      type: Types.ObjectId,
      ref: "User",
      index: true,
    },
    relatedModel: String,
    relatedId: String,
    relatedEntity: Schema.Types.Mixed,

    // Notification state
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: Date,

    // Delivery status
    channels: {
      type: [String],
      enum: ["in_app", "email", "push", "sms"] as NotificationChannel[],
      default: ["in_app"],
    },
    deliveryStatus: {
      in_app: {
        delivered: { type: Boolean, default: true },
        deliveredAt: Date,
      },
      email: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        failureReason: String,
      },
      push: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        failureReason: String,
      },
      sms: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        failureReason: String,
      },
    },

    // UI related
    icon: String,
    color: String,
    actionUrl: String,
    actionLabel: String,

    // Grouping
    groupKey: {
      type: String,
      index: true,
    },

    // Metadata
    metadata: Schema.Types.Mixed,

    // Expiry
    expiresAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============= Indexes =============

// Compound index for fetching user's unread notifications
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// Compound index for notification center queries
notificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });

// Index for expiry cleanup
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for grouping
notificationSchema.index({ recipient: 1, groupKey: 1 });

// ============= Instance Methods =============

notificationSchema.methods.markAsRead = async function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// ============= Static Methods =============

notificationSchema.statics.markAllAsRead = async function (userId: string) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

notificationSchema.statics.getUnreadCount = async function (userId: string): Promise<number> {
  return this.countDocuments({ recipient: userId, isRead: false });
};

notificationSchema.statics.deleteExpired = async function () {
  const now = new Date();
  return this.deleteMany({ expiresAt: { $lt: now } });
};

// ============= Virtual Fields =============

notificationSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = now.getTime() - this.createdAt.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "همین الان";
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  return `${days} روز پیش`;
});

// ============= Pre-save Middleware =============

notificationSchema.pre("save", async function (next) {
  // Set default delivery status for in_app
  if (!this.deliveryStatus.in_app) {
    this.deliveryStatus.in_app = {
      delivered: true,
      deliveredAt: new Date(),
    };
  }

  // Auto-populate relatedEntity if relatedModel and relatedId are provided
  if (this.relatedModel && this.relatedId && !this.relatedEntity) {
    try {
      const Model = model(this.relatedModel);
      this.relatedEntity = await Model.findById(this.relatedId).lean();
    } catch (error) {
      // Silently fail if model not found
    }
  }

  next();
});

export const NotificationModel = model<INotification>("Notification", notificationSchema);
