import { Schema, model, Types } from "mongoose";
import { IShareLog } from "common-types";

const shareLogSchema = new Schema<IShareLog>(
  {
    user: { type: Types.ObjectId, ref: "User" },
    sharedItem: { type: Types.ObjectId, ref: "Need", required: true, index: true },
    sharedItemType: { type: String, default: "need" },
    platform: {
      type: String,
      enum: [
        "telegram",
        "whatsapp",
        "twitter",
        "linkedin",
        "facebook",
        "instagram",
        "email",
        "copy_link",
        "other",
      ],
      required: true,
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    referrer: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes for analytics
shareLogSchema.index({ platform: 1, createdAt: -1 });
shareLogSchema.index({ sharedItem: 1, createdAt: -1 });
shareLogSchema.index({ user: 1, createdAt: -1 });

export const ShareLogModel = model<IShareLog>("ShareLog", shareLogSchema);
