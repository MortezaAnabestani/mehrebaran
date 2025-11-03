import { Schema, model, Types } from "mongoose";
import { IUserBadge } from "common-types";

const userBadgeSchema = new Schema<IUserBadge>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, index: true },
    badge: { type: Types.ObjectId, ref: "Badge", required: true },
    earnedAt: { type: Date, default: Date.now },
    progress: { type: Number, min: 0, max: 100 },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate badges
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

// Index for querying user's badges
userBadgeSchema.index({ user: 1, earnedAt: -1 });

export const UserBadgeModel = model<IUserBadge>("UserBadge", userBadgeSchema);
