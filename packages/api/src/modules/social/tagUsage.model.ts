import { Schema, model, Types } from "mongoose";
import { ITagUsage } from "common-types";

const tagUsageSchema = new Schema<ITagUsage>(
  {
    tag: { type: String, required: true, trim: true },
    normalizedTag: { type: String, required: true, unique: true, lowercase: true, index: true },
    usageCount: { type: Number, default: 1, min: 0 },
    relatedNeeds: [{ type: Types.ObjectId, ref: "Need" }],
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for searching and sorting
tagUsageSchema.index({ usageCount: -1 });
tagUsageSchema.index({ lastUsedAt: -1 });

export const TagUsageModel = model<ITagUsage>("TagUsage", tagUsageSchema);
