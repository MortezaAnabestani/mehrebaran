import { Schema, model, Types } from "mongoose";
import type { IPushNotificationToken } from "common-types";

const pushTokenSchema = new Schema<IPushNotificationToken>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    platform: {
      type: String,
      enum: ["ios", "android", "web"],
      required: true,
    },
    deviceId: String,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ============= Indexes =============

// Compound index for active tokens
pushTokenSchema.index({ user: 1, isActive: 1 });

// Index for cleanup of inactive tokens
pushTokenSchema.index({ isActive: 1, lastUsedAt: 1 });

// ============= Static Methods =============

pushTokenSchema.statics.deactivateOldTokens = async function (days: number = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return this.updateMany(
    { lastUsedAt: { $lt: cutoffDate }, isActive: true },
    { isActive: false }
  );
};

pushTokenSchema.statics.getUserTokens = async function (userId: string, platform?: string) {
  const query: any = { user: userId, isActive: true };
  if (platform) {
    query.platform = platform;
  }

  return this.find(query);
};

// ============= Pre-save Middleware =============

pushTokenSchema.pre("save", function (next) {
  this.lastUsedAt = new Date();
  next();
});

export const PushTokenModel = model<IPushNotificationToken>("PushToken", pushTokenSchema);
