import { ShareLogModel } from "./shareLog.model";
import { IShareLog, IShareStats, SharePlatform, IOGMetadata } from "common-types";
import { Types } from "mongoose";
import { pointsService } from "../gamification/points.service";

class ShareService {
  // Log a share
  public async logShare(data: {
    userId?: string;
    sharedItemId: string;
    sharedItemType: "need";
    platform: SharePlatform;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    metadata?: Record<string, any>;
  }): Promise<IShareLog> {
    const shareLog = await ShareLogModel.create({
      user: data.userId ? new Types.ObjectId(data.userId) : undefined,
      sharedItem: new Types.ObjectId(data.sharedItemId),
      sharedItemType: data.sharedItemType,
      platform: data.platform,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      referrer: data.referrer,
      metadata: data.metadata,
    });

    // Award points for sharing (if user is logged in)
    if (data.userId) {
      await pointsService.awardPoints(data.userId, "need_upvote", {
        points: 3,
        description: `اشتراک‌گذاری در ${data.platform}`,
        relatedModel: "Need",
        relatedId: data.sharedItemId,
      });
    }

    return shareLog;
  }

  // Get share statistics for an item
  public async getItemShareStats(itemId: string, itemType: "need" = "need"): Promise<IShareStats> {
    const shares = await ShareLogModel.find({
      sharedItem: itemId,
      sharedItemType: itemType,
    });

    const totalShares = shares.length;

    const sharesByPlatform: Record<SharePlatform, number> = {
      telegram: 0,
      whatsapp: 0,
      twitter: 0,
      linkedin: 0,
      facebook: 0,
      instagram: 0,
      email: 0,
      copy_link: 0,
      other: 0,
    };

    shares.forEach((share) => {
      sharesByPlatform[share.platform]++;
    });

    return {
      totalShares,
      sharesByPlatform,
      topSharedItems: [], // Will be populated by getTopSharedItems
    };
  }

  // Get top shared items
  public async getTopSharedItems(itemType: "need" = "need", limit: number = 10): Promise<any[]> {
    const topShared = await ShareLogModel.aggregate([
      { $match: { sharedItemType: itemType } },
      {
        $group: {
          _id: "$sharedItem",
          shareCount: { $sum: 1 },
        },
      },
      { $sort: { shareCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: itemType === "need" ? "needs" : "needs",
          localField: "_id",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: "$item" },
      {
        $project: {
          itemId: "$_id",
          itemType,
          shareCount: 1,
          itemTitle: "$item.title",
        },
      },
    ]);

    return topShared;
  }

  // Get user's share history
  public async getUserShareHistory(userId: string, limit: number = 50, skip: number = 0): Promise<IShareLog[]> {
    return ShareLogModel.find({ user: userId })
      .populate("sharedItem")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  // Get share analytics by platform
  public async getShareAnalyticsByPlatform(
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<SharePlatform, number>> {
    const query: any = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    const shares = await ShareLogModel.find(query);

    const analytics: Record<SharePlatform, number> = {
      telegram: 0,
      whatsapp: 0,
      twitter: 0,
      linkedin: 0,
      facebook: 0,
      instagram: 0,
      email: 0,
      copy_link: 0,
      other: 0,
    };

    shares.forEach((share) => {
      analytics[share.platform]++;
    });

    return analytics;
  }

  // Generate Open Graph metadata for a need
  public async generateOGMetadata(needId: string): Promise<IOGMetadata | null> {
    const { model } = await import("mongoose");
    const NeedModel = model("Need");

    const need = await NeedModel.findById(needId).select("title description images slug");

    if (!need) {
      return null;
    }

    const baseUrl = process.env.FRONTEND_URL || "https://mehrebaran.org";

    return {
      title: need.title,
      description: need.description?.substring(0, 200) || need.title,
      image: need.images && need.images.length > 0 ? need.images[0] : `${baseUrl}/default-og-image.jpg`,
      url: `${baseUrl}/needs/${need.slug || need._id}`,
      type: "article",
      siteName: "مهربارون",
      locale: "fa_IR",
    };
  }

  // Get share URL for different platforms
  public getShareUrl(platform: SharePlatform, itemUrl: string, title?: string): string {
    const encodedUrl = encodeURIComponent(itemUrl);
    const encodedTitle = title ? encodeURIComponent(title) : "";

    switch (platform) {
      case "telegram":
        return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;

      case "whatsapp":
        return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

      case "twitter":
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

      case "email":
        return `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;

      default:
        return itemUrl;
    }
  }
}

export const shareService = new ShareService();
