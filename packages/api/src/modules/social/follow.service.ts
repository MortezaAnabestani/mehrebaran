import { FollowModel } from "./follow.model";
import { IFollow, IFollowStats, FollowType } from "common-types";
import { Types } from "mongoose";
import ApiError from "../../core/utils/apiError";
import { pointsService } from "../gamification/points.service";

class FollowService {
  // Follow a user
  public async followUser(followerId: string, followingId: string): Promise<IFollow> {
    // Check if already following
    const existing = await FollowModel.findOne({
      follower: followerId,
      following: followingId,
      followType: "user",
    });

    if (existing) {
      throw new ApiError(400, "شما قبلاً این کاربر را دنبال می‌کنید.");
    }

    // Don't allow self-follow
    if (followerId === followingId) {
      throw new ApiError(400, "نمی‌توانید خود را دنبال کنید.");
    }

    const follow = await FollowModel.create({
      follower: new Types.ObjectId(followerId),
      following: new Types.ObjectId(followingId),
      followType: "user",
    });

    await follow.populate("follower", "name email");
    await follow.populate("following", "name email");
    return follow;
  }

  // Unfollow a user
  public async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const result = await FollowModel.findOneAndDelete({
      follower: followerId,
      following: followingId,
      followType: "user",
    });

    if (!result) {
      throw new ApiError(404, "شما این کاربر را دنبال نمی‌کنید.");
    }
  }

  // Follow a need
  public async followNeed(followerId: string, needId: string): Promise<IFollow> {
    // Check if already following
    const existing = await FollowModel.findOne({
      follower: followerId,
      followedNeed: needId,
      followType: "need",
    });

    if (existing) {
      throw new ApiError(400, "شما قبلاً این نیاز را دنبال می‌کنید.");
    }

    const follow = await FollowModel.create({
      follower: new Types.ObjectId(followerId),
      followedNeed: new Types.ObjectId(needId),
      followType: "need",
    });

    // Award points for following a need
    await pointsService.awardPoints(followerId, "need_upvote", {
      points: 2,
      description: "دنبال کردن نیاز",
      relatedModel: "Need",
      relatedId: needId,
    });

    return follow.populate(["follower", "followedNeed"]);
  }

  // Unfollow a need
  public async unfollowNeed(followerId: string, needId: string): Promise<void> {
    const result = await FollowModel.findOneAndDelete({
      follower: followerId,
      followedNeed: needId,
      followType: "need",
    });

    if (!result) {
      throw new ApiError(404, "شما این نیاز را دنبال نمی‌کنید.");
    }
  }

  // Check if user is following another user
  public async isFollowingUser(followerId: string, followingId: string): Promise<boolean> {
    const follow = await FollowModel.findOne({
      follower: followerId,
      following: followingId,
      followType: "user",
    });

    return !!follow;
  }

  // Check if user is following a need
  public async isFollowingNeed(followerId: string, needId: string): Promise<boolean> {
    const follow = await FollowModel.findOne({
      follower: followerId,
      followedNeed: needId,
      followType: "need",
    });

    return !!follow;
  }

  // Get user's followers
  public async getUserFollowers(userId: string, limit: number = 50, skip: number = 0): Promise<any[]> {
    const followers = await FollowModel.find({
      following: userId,
      followType: "user",
    })
      .populate("follower", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return followers;
  }

  // Get user's following (users they follow)
  public async getUserFollowing(userId: string, limit: number = 50, skip: number = 0): Promise<any[]> {
    const following = await FollowModel.find({
      follower: userId,
      followType: "user",
    })
      .populate("following", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return following;
  }

  // Get needs a user follows
  public async getUserFollowedNeeds(userId: string, limit: number = 50, skip: number = 0): Promise<any[]> {
    const needs = await FollowModel.find({
      follower: userId,
      followType: "need",
    })
      .populate("followedNeed")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return needs;
  }

  // Get followers of a need
  public async getNeedFollowers(needId: string, limit: number = 50, skip: number = 0): Promise<any[]> {
    const followers = await FollowModel.find({
      followedNeed: needId,
      followType: "need",
    })
      .populate("follower", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return followers;
  }

  // Get follow statistics for a user
  public async getUserFollowStats(userId: string): Promise<IFollowStats> {
    const followersCount = await FollowModel.countDocuments({
      following: userId,
      followType: "user",
    });

    const followingCount = await FollowModel.countDocuments({
      follower: userId,
      followType: "user",
    });

    return {
      followersCount,
      followingCount,
    };
  }

  // Get follow statistics for a need
  public async getNeedFollowStats(needId: string): Promise<IFollowStats> {
    const needFollowersCount = await FollowModel.countDocuments({
      followedNeed: needId,
      followType: "need",
    });

    return {
      followersCount: 0,
      followingCount: 0,
      needFollowersCount,
    };
  }

  // Get mutual followers (users who follow each other)
  public async getMutualFollowers(userId: string): Promise<any[]> {
    const following = await FollowModel.find({
      follower: userId,
      followType: "user",
    }).select("following");

    const followingIds = following.map((f) => f.following.toString());

    const mutualFollowers = await FollowModel.find({
      follower: { $in: followingIds },
      following: userId,
      followType: "user",
    }).populate("follower", "name email");

    return mutualFollowers;
  }

  // Get suggested users to follow (based on mutual connections)
  public async getSuggestedUsers(userId: string, limit: number = 10): Promise<any[]> {
    // Get users followed by people you follow
    const following = await FollowModel.find({
      follower: userId,
      followType: "user",
    }).select("following");

    const followingIds = following.map((f) => f.following.toString());

    const suggestions = await FollowModel.aggregate([
      {
        $match: {
          follower: { $in: followingIds.map((id) => new Types.ObjectId(id)) },
          following: { $ne: new Types.ObjectId(userId) },
          followType: "user",
        },
      },
      {
        $group: {
          _id: "$following",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$_id",
          mutualFollowers: "$count",
          name: "$user.name",
          email: "$user.email",
        },
      },
    ]);

    return suggestions;
  }
}

export const followService = new FollowService();
