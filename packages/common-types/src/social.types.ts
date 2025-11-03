import { IUser, INeed } from "./";
import { Types } from "mongoose";

// ==================== FOLLOW SYSTEM ====================

// Follow type
export type FollowType = "user" | "need";

// Follow relationship
export interface IFollow {
  _id: string;
  follower: IUser | string | Types.ObjectId; // کسی که follow می‌کند
  following: IUser | string | Types.ObjectId; // کسی که follow می‌شود
  followType: FollowType;
  followedNeed?: INeed | string | Types.ObjectId; // اگر need follow شده
  createdAt: Date;
}

// Follow statistics
export interface IFollowStats {
  followersCount: number;
  followingCount: number;
  needFollowersCount?: number; // برای needs
}

// ==================== MENTIONS SYSTEM ====================

// Mention context
export type MentionContext =
  | "comment"
  | "message"
  | "need_update"
  | "task_description"
  | "team_invitation"
  | "direct_message";

// Mention
export interface IMention {
  _id: string;
  mentionedUser: IUser | string | Types.ObjectId;
  mentionedBy: IUser | string | Types.ObjectId;
  context: MentionContext;
  contextId: string; // ID of comment, message, etc.
  relatedModel: string; // "Comment", "Message", "Need", etc.
  relatedId: string;
  text?: string; // Snippet of text where mention occurred
  isRead: boolean;
  createdAt: Date;
}

// ==================== TAGS SYSTEM ====================

// Tag usage tracking
export interface ITagUsage {
  _id: string;
  tag: string; // e.g., "education", "health", "emergency"
  normalizedTag: string; // lowercase version for matching
  usageCount: number;
  relatedNeeds: (INeed | string | Types.ObjectId)[];
  lastUsedAt: Date;
  createdAt: Date;
}

// ==================== SHARE SYSTEM ====================

// Share platform
export type SharePlatform =
  | "telegram"
  | "whatsapp"
  | "twitter"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "email"
  | "copy_link"
  | "other";

// Share log (analytics)
export interface IShareLog {
  _id: string;
  user?: IUser | string | Types.ObjectId; // Optional: anonymous shares allowed
  sharedItem: INeed | string | Types.ObjectId;
  sharedItemType: "need"; // Can be extended to other types
  platform: SharePlatform;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Share statistics
export interface IShareStats {
  totalShares: number;
  sharesByPlatform: Record<SharePlatform, number>;
  topSharedItems: Array<{
    itemId: string;
    itemType: string;
    shareCount: number;
  }>;
}

// Open Graph metadata for sharing
export interface IOGMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  type: "website" | "article";
  siteName: string;
  locale: string;
}
