import { Schema, model, Types } from "mongoose";
import type { IStoryHighlight } from "common-types";

const storyHighlightSchema = new Schema<IStoryHighlight>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 50,
    },
    coverImage: {
      type: String,
      required: true,
    },
    stories: [
      {
        type: Types.ObjectId,
        ref: "Story",
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============= Indexes =============

// Compound index for user's highlights
storyHighlightSchema.index({ user: 1, isActive: 1, order: 1 });

// ============= Instance Methods =============

storyHighlightSchema.methods.addStory = async function (storyId: string) {
  if (!this.stories.includes(storyId as any)) {
    this.stories.push(new Types.ObjectId(storyId));
    return this.save();
  }
  return this;
};

storyHighlightSchema.methods.removeStory = async function (storyId: string) {
  this.stories = this.stories.filter((s: any) => s.toString() !== storyId);
  return this.save();
};

// ============= Static Methods =============

storyHighlightSchema.statics.getByUser = async function (userId: string) {
  return this.find({ user: userId, isActive: true })
    .sort({ order: 1 })
    .populate({
      path: "stories",
      match: { isActive: true },
      populate: { path: "user", select: "name avatar" },
    });
};

export const StoryHighlightModel = model<IStoryHighlight>("StoryHighlight", storyHighlightSchema);
