import { Schema, model, Types } from "mongoose";
import type { IUserStats } from "common-types";

const userStatsSchema = new Schema<IUserStats>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
      index: true,
    },
    currentLevel: {
      type: Number,
      default: 1,
      index: true,
    },
    needsCreated: {
      type: Number,
      default: 0,
    },
    needsSupported: {
      type: Number,
      default: 0,
    },
    needsCompleted: {
      type: Number,
      default: 0,
    },
    needsUpvoted: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    tasksAssigned: {
      type: Number,
      default: 0,
    },
    teamsCreated: {
      type: Number,
      default: 0,
    },
    teamsJoined: {
      type: Number,
      default: 0,
    },
    totalFinancialContributions: {
      type: Number,
      default: 0,
    },
    totalHoursContributed: {
      type: Number,
      default: 0,
    },
    totalContributions: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    messagesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    badgesCount: {
      type: Number,
      default: 0,
    },
    commonBadges: {
      type: Number,
      default: 0,
    },
    rareBadges: {
      type: Number,
      default: 0,
    },
    epicBadges: {
      type: Number,
      default: 0,
    },
    legendaryBadges: {
      type: Number,
      default: 0,
    },
    currentLoginStreak: {
      type: Number,
      default: 0,
    },
    longestLoginStreak: {
      type: Number,
      default: 0,
    },
    lastLoginDate: Date,
    firstContributionDate: Date,
    firstNeedCreatedDate: Date,
    firstTeamCreatedDate: Date,
    globalRank: Number,
    categoryRanks: {
      type: Map,
      of: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for ranking queries
userStatsSchema.index({ totalPoints: -1 });
userStatsSchema.index({ currentLevel: -1 });
userStatsSchema.index({ totalContributions: -1 });
userStatsSchema.index({ needsCreated: -1 });
userStatsSchema.index({ needsSupported: -1 });
userStatsSchema.index({ badgesCount: -1 });

export const UserStatsModel = model<IUserStats>("UserStats", userStatsSchema);
