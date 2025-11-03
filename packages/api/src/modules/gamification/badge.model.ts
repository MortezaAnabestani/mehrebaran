import { Schema, model } from "mongoose";
import { IBadge } from "common-types";

const badgeConditionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["points", "count", "streak", "milestone", "custom"],
      required: true,
    },
    target: { type: Number },
    action: { type: String },
    description: { type: String, required: true },
  },
  { _id: false }
);

const badgeSchema = new Schema<IBadge>(
  {
    name: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "contributor",
        "supporter",
        "creator",
        "helper",
        "communicator",
        "leader",
        "expert",
        "milestone",
        "special",
        "seasonal",
      ],
      required: true,
    },
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },
    icon: { type: String, required: true },
    color: { type: String },
    conditions: [badgeConditionSchema],
    points: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isSecret: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
badgeSchema.index({ category: 1, rarity: 1 });
badgeSchema.index({ isActive: 1 });

export const BadgeModel = model<IBadge>("Badge", badgeSchema);
