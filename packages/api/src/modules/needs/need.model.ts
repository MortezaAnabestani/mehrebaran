import { Schema, model, Types } from "mongoose";
import { INeed, NeedStatus, UrgencyLevel } from "common-types";
import { createPersianSlug } from "../../core/utils/slug.utils";

const geoLocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      index: "2dsphere",
    },
    address: { type: String },
    locationName: { type: String },
    city: { type: String, index: true },
    province: { type: String, index: true },
    country: { type: String, default: "ایران" },
    isLocationApproximate: { type: Boolean, default: false },
  },
  { _id: false }
);

const attachmentSchema = new Schema(
  {
    fileType: {
      type: String,
      enum: ["image", "audio", "video"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const needUpdateSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const milestoneSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetDate: { type: Date, required: true },
    completionDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "delayed"],
      default: "pending",
    },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    order: { type: Number, required: true },
    evidence: [{ type: String }],
  },
  { _id: true, timestamps: true }
);

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["draft", "pending", "under_review", "approved", "in_progress", "completed", "rejected", "archived", "cancelled"],
      required: true,
    },
    changedBy: { type: Types.ObjectId, ref: "User" },
    changedAt: { type: Date, default: Date.now },
    reason: { type: String },
  },
  { _id: false }
);

const needSchema = new Schema<INeed>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: Types.ObjectId, ref: "NeedCategory", required: true, index: true },

    // Status
    status: {
      type: String,
      enum: ["draft", "pending", "under_review", "approved", "in_progress", "completed", "rejected", "archived", "cancelled"],
      default: "draft",
      index: true,
    },
    statusHistory: [statusHistorySchema],
    urgencyLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      index: true,
    },

    // Submitter
    submittedBy: {
      user: { type: Types.ObjectId, ref: "User" },
      guestName: { type: String },
      guestEmail: { type: String },
    },

    // Media
    attachments: [attachmentSchema],

    // Social
    upvotes: [{ type: Types.ObjectId, ref: "User" }],
    supporters: [{ type: Types.ObjectId, ref: "User" }],
    viewsCount: { type: Number, default: 0, index: true },

    // Planning
    estimatedDuration: { type: String },
    requiredSkills: [{ type: String }],
    tags: [{ type: String, index: true }],

    // Location
    location: { type: geoLocationSchema },

    // Timeline
    updates: [needUpdateSchema],
    milestones: [milestoneSchema],
    deadline: { type: Date },

    // System
    priority: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

needSchema.virtual("upvotesCount", {
  ref: "User",
  localField: "upvotes",
  foreignField: "_id",
  count: true,
});

needSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  match: { postType: "Need" },
});

// Calculate overall progress from milestones
needSchema.virtual("overallProgress").get(function () {
  if (!this.milestones || this.milestones.length === 0) {
    return 0;
  }
  const totalProgress = this.milestones.reduce((sum: number, milestone: any) => {
    return sum + (milestone.progressPercentage || 0);
  }, 0);
  return Math.round(totalProgress / this.milestones.length);
});

needSchema.pre("save", function (next) {
  // Auto-generate slug from title
  if (this.isNew || this.isModified("title")) {
    this.slug = createPersianSlug(this.title);
  }

  // Track status changes
  if (this.isModified("status")) {
    if (!this.statusHistory) {
      this.statusHistory = [];
    }
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      // changedBy will be set from controller if available
    } as any);
  }

  // Initialize statusHistory for new documents
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [{
      status: this.status,
      changedAt: new Date(),
    } as any];
  }

  next();
});

export const NeedModel = model<INeed>("Need", needSchema);
