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
      enum: ["image", "audio", "video", "document"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: Number,
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

const budgetItemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true }, // تجهیزات، خدمات، مواد اولیه
    estimatedCost: { type: Number, required: true, min: 0 },
    actualCost: { type: Number, min: 0 },
    amountRaised: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "IRR" },
    status: {
      type: String,
      enum: ["pending", "partial", "fully_funded", "exceeded"],
      default: "pending",
    },
    priority: { type: Number, default: 3, min: 1, max: 5 },
    notes: { type: String },
  },
  { _id: true, timestamps: true }
);

const verificationEvidenceSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["image", "document", "video"],
      required: true,
    },
    url: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const verificationRequestSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["milestone_completion", "budget_expense", "need_completion", "progress_update"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "needs_revision"],
      default: "pending",
    },

    // Reference to what's being verified
    relatedItemId: { type: String }, // milestone _id, budget item _id, etc.
    relatedItemType: { type: String }, // "milestone", "budget_item", etc.

    // Request details
    description: { type: String, required: true },
    evidence: [verificationEvidenceSchema],

    // Metadata
    submittedBy: { type: Types.ObjectId, ref: "User", required: true },
    submittedAt: { type: Date, default: Date.now },

    // Review details
    reviewedBy: { type: Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    adminComments: { type: String },
    rejectionReason: { type: String },

    // Revision tracking
    revisionRequested: { type: Boolean, default: false },
    revisionNotes: { type: String },
  },
  { _id: true, timestamps: true }
);

const taskChecklistSchema = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    // Assignment
    assignedTo: { type: Types.ObjectId, ref: "User" },
    assignedBy: { type: Types.ObjectId, ref: "User" },
    assignedAt: { type: Date },

    // Status & Priority
    status: {
      type: String,
      enum: ["todo", "in_progress", "review", "completed", "blocked"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    // Timeline
    deadline: { type: Date },
    completedAt: { type: Date },
    estimatedHours: { type: Number, min: 0 },
    actualHours: { type: Number, min: 0 },

    // Dependencies
    dependencies: [{ type: String }], // Array of task IDs
    blockedBy: { type: String }, // Task ID
    blockingReason: { type: String },

    // Progress
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },

    // Checklist
    checklist: [taskChecklistSchema],
  },
  { _id: true, timestamps: true }
);

const contributionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["financial", "time", "skill", "material", "other"],
      required: true,
    },
    description: { type: String, required: true },
    amount: { type: Number, min: 0 }, // برای کمک مالی
    hours: { type: Number, min: 0 }, // برای کمک زمانی
    date: { type: Date, default: Date.now },
    verifiedByAdmin: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const supporterDetailSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["supporter", "volunteer", "coordinator", "lead"],
      default: "supporter",
    },

    // Join info
    joinedAt: { type: Date, default: Date.now },
    invitedBy: { type: Types.ObjectId, ref: "User" },

    // Contributions
    contributions: [contributionSchema],

    // Activity
    lastActivityAt: { type: Date },
    tasksCompleted: { type: Number, default: 0 },

    // Badge
    badge: { type: String },

    // Status
    isActive: { type: Boolean, default: true },
    leftAt: { type: Date },
    leaveReason: { type: String },

    // Notes
    notes: { type: String },
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
    supporterDetails: [supporterDetailSchema],
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

    // Budget
    budgetItems: [budgetItemSchema],

    // Verification
    verificationRequests: [verificationRequestSchema],

    // Task Management
    tasks: [taskSchema],

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

// Calculate total budget from budget items
needSchema.virtual("totalBudget").get(function () {
  if (!this.budgetItems || this.budgetItems.length === 0) {
    return 0;
  }
  return this.budgetItems.reduce((sum: number, item: any) => {
    return sum + (item.estimatedCost || 0);
  }, 0);
});

// Calculate total raised amount
needSchema.virtual("totalRaised").get(function () {
  if (!this.budgetItems || this.budgetItems.length === 0) {
    return 0;
  }
  return this.budgetItems.reduce((sum: number, item: any) => {
    return sum + (item.amountRaised || 0);
  }, 0);
});

// Calculate budget progress percentage
needSchema.virtual("budgetProgress").get(function () {
  if (!this.budgetItems || this.budgetItems.length === 0) {
    return 0;
  }
  const total = this.budgetItems.reduce((sum: number, item: any) => {
    return sum + (item.estimatedCost || 0);
  }, 0);

  if (total === 0) return 0;

  const raised = this.budgetItems.reduce((sum: number, item: any) => {
    return sum + (item.amountRaised || 0);
  }, 0);

  return Math.round((raised / total) * 100);
});

// Count pending verification requests
needSchema.virtual("pendingVerificationsCount").get(function () {
  if (!this.verificationRequests || this.verificationRequests.length === 0) {
    return 0;
  }
  return this.verificationRequests.filter((req: any) => req.status === "pending").length;
});

// Count total tasks
needSchema.virtual("totalTasksCount").get(function () {
  if (!this.tasks || this.tasks.length === 0) {
    return 0;
  }
  return this.tasks.length;
});

// Count completed tasks
needSchema.virtual("completedTasksCount").get(function () {
  if (!this.tasks || this.tasks.length === 0) {
    return 0;
  }
  return this.tasks.filter((task: any) => task.status === "completed").length;
});

// Calculate tasks progress percentage
needSchema.virtual("tasksProgress").get(function () {
  if (!this.tasks || this.tasks.length === 0) {
    return 0;
  }
  const completedCount = this.tasks.filter((task: any) => task.status === "completed").length;
  return Math.round((completedCount / this.tasks.length) * 100);
});

// Add virtual fields to supporterDetailSchema for contribution totals
supporterDetailSchema.virtual("totalFinancialContribution").get(function () {
  if (!this.contributions || this.contributions.length === 0) {
    return 0;
  }
  return this.contributions
    .filter((c: any) => c.type === "financial")
    .reduce((sum: number, c: any) => sum + (c.amount || 0), 0);
});

supporterDetailSchema.virtual("totalHoursContribution").get(function () {
  if (!this.contributions || this.contributions.length === 0) {
    return 0;
  }
  return this.contributions
    .filter((c: any) => c.type === "time")
    .reduce((sum: number, c: any) => sum + (c.hours || 0), 0);
});

// Middleware to auto-update budget item status
needSchema.pre("save", function (next) {
  // Update budget item status based on amountRaised
  if (this.budgetItems && this.budgetItems.length > 0) {
    this.budgetItems.forEach((item: any) => {
      const raised = item.amountRaised || 0;
      const estimated = item.estimatedCost || 0;

      if (raised === 0) {
        item.status = "pending";
      } else if (raised >= estimated) {
        item.status = raised > estimated ? "exceeded" : "fully_funded";
      } else {
        item.status = "partial";
      }
    });
  }

  next();
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
