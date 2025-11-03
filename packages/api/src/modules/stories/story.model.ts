import { Schema, model, Types } from "mongoose";
import type { IStory, StoryPrivacy, StoryType, IStoryMedia, IStoryView, IStoryReaction } from "common-types";

const storyMediaSchema = new Schema<IStoryMedia>(
  {
    type: {
      type: String,
      enum: ["image", "video", "audio", "document", "file"],
      required: true,
    },
    url: { type: String, required: true },
    thumbnail: String,
    duration: Number,
    metadata: Schema.Types.Mixed,
  },
  { _id: false }
);

const storyViewSchema = new Schema<IStoryView>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
    viewDuration: Number,
  },
  { _id: false }
);

const storyReactionSchema = new Schema<IStoryReaction>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    reactedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const storySchema = new Schema<IStory>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["image", "video", "text"] as StoryType[],
      required: true,
    },
    media: storyMediaSchema,
    text: String,
    backgroundColor: String,
    textColor: String,
    fontFamily: String,
    caption: String,
    privacy: {
      type: String,
      enum: ["public", "followers", "close_friends", "custom"] as StoryPrivacy[],
      default: "public",
      index: true,
    },
    allowedUsers: [
      {
        type: String,
      },
    ],
    linkedNeed: {
      type: Types.ObjectId,
      ref: "Need",
    },
    linkedUrl: String,
    views: {
      type: [storyViewSchema],
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
      index: true,
    },
    reactions: {
      type: [storyReactionSchema],
      default: [],
    },
    reactionsCount: {
      type: Number,
      default: 0,
    },
    allowReplies: {
      type: Boolean,
      default: true,
    },
    allowSharing: {
      type: Boolean,
      default: true,
    },
    highlightedUntil: Date,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// ============= Indexes =============

// Compound index for active stories feed
storySchema.index({ user: 1, isActive: 1, expiresAt: -1 });

// Index for privacy queries
storySchema.index({ privacy: 1, expiresAt: 1 });

// TTL index for automatic cleanup
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ============= Virtual Fields =============

storySchema.virtual("isExpired").get(function () {
  return this.expiresAt < new Date();
});

storySchema.virtual("timeRemaining").get(function () {
  const now = new Date();
  const remaining = this.expiresAt.getTime() - now.getTime();
  return Math.max(0, Math.floor(remaining / 1000)); // seconds
});

storySchema.virtual("viewsList", {
  ref: "User",
  localField: "views.user",
  foreignField: "_id",
});

// ============= Instance Methods =============

storySchema.methods.addView = async function (userId: string, viewDuration?: number) {
  // بررسی اینکه قبلاً view نکرده باشد
  const existingView = this.views.find((v: IStoryView) => v.user.toString() === userId);

  if (!existingView) {
    this.views.push({
      user: new Types.ObjectId(userId),
      viewedAt: new Date(),
      viewDuration,
    });
    this.viewsCount += 1;
    return this.save();
  }

  return this;
};

storySchema.methods.addReaction = async function (userId: string, emoji: string) {
  // حذف reaction قبلی اگر وجود داشته باشد
  this.reactions = this.reactions.filter(
    (r: IStoryReaction) => r.user.toString() !== userId
  );

  this.reactions.push({
    user: new Types.ObjectId(userId),
    emoji,
    reactedAt: new Date(),
  });

  this.reactionsCount = this.reactions.length;
  return this.save();
};

storySchema.methods.removeReaction = async function (userId: string) {
  this.reactions = this.reactions.filter(
    (r: IStoryReaction) => r.user.toString() !== userId
  );

  this.reactionsCount = this.reactions.length;
  return this.save();
};

storySchema.methods.hasUserViewed = function (userId: string): boolean {
  return this.views.some((v: IStoryView) => v.user.toString() === userId);
};

// ============= Static Methods =============

storySchema.statics.getActiveByUser = async function (userId: string) {
  const now = new Date();
  return this.find({
    user: userId,
    isActive: true,
    expiresAt: { $gt: now },
  })
    .sort({ createdAt: -1 })
    .populate("user", "name avatar");
};

storySchema.statics.getFeedStories = async function (currentUserId: string, followingIds: string[]) {
  const now = new Date();

  // دریافت استوری‌های کاربرانی که فالو می‌کند + خودش
  const userIds = [currentUserId, ...followingIds];

  return this.find({
    user: { $in: userIds },
    isActive: true,
    expiresAt: { $gt: now },
    $or: [
      { privacy: "public" },
      { privacy: "followers", user: { $in: followingIds } },
      { privacy: "custom", allowedUsers: currentUserId },
    ],
  })
    .sort({ createdAt: -1 })
    .populate("user", "name avatar");
};

storySchema.statics.deleteExpired = async function () {
  const now = new Date();
  return this.deleteMany({
    expiresAt: { $lt: now },
    highlightedUntil: { $exists: false }, // حذف نشوند اگر highlight شده‌اند
  });
};

storySchema.statics.getUserStoryStats = async function (userId: string) {
  const stories = await this.find({ user: userId });

  const totalViews = stories.reduce((sum: number, story: any) => sum + story.viewsCount, 0);
  const totalReactions = stories.reduce((sum: number, story: any) => sum + story.reactionsCount, 0);

  return {
    totalStories: stories.length,
    totalViews,
    totalReactions,
    averageViews: stories.length > 0 ? totalViews / stories.length : 0,
    averageReactions: stories.length > 0 ? totalReactions / stories.length : 0,
  };
};

// ============= Pre-save Middleware =============

storySchema.pre("save", function (next) {
  // اگر expiresAt تنظیم نشده، 24 ساعت بعد تنظیم می‌شود
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  next();
});

export const StoryModel = model<IStory>("Story", storySchema);
