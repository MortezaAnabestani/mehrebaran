import { IUser } from "./user.types";
import { INeed } from "./need.types";
import { ObjectId } from "./object-id.type";

// ============= Media Types =============

export type MediaType = "image" | "video" | "audio" | "document" | "file";

export type MediaCategory =
  | "profile" // تصویر پروفایل
  | "cover" // تصویر کاور
  | "need" // مدیا مربوط به نیاز
  | "story" // مدیا استوری
  | "message" // مدیا پیام
  | "comment" // مدیا کامنت
  | "gallery" // گالری عمومی
  | "document"; // اسناد

export interface IMediaDimensions {
  width: number;
  height: number;
  aspectRatio?: string; // e.g., "16:9", "4:3"
}

export interface IMediaMetadata {
  // File info
  originalName: string;
  mimeType: string;
  size: number; // bytes
  extension: string;

  // Media specific
  dimensions?: IMediaDimensions;
  duration?: number; // seconds (for video/audio)

  // Processing info
  isProcessed: boolean;
  processingStatus?: "pending" | "processing" | "completed" | "failed";
  processingError?: string;

  // Thumbnails
  thumbnail?: string; // URL
  thumbnailSmall?: string; // URL
  thumbnailMedium?: string; // URL
  thumbnailLarge?: string; // URL

  // Additional metadata
  exif?: Record<string, any>; // برای تصاویر
  codec?: string; // برای ویدئو/صدا
  bitrate?: number; // برای ویدئو/صدا
  frameRate?: number; // برای ویدئو
}

export interface IMedia {
  _id: string;

  // Owner
  uploadedBy: IUser | string | ObjectId;

  // File info
  type: MediaType;
  category: MediaCategory;
  url: string;
  cdnUrl?: string;
  path: string; // server path

  // Metadata
  metadata: IMediaMetadata;

  // Related content
  relatedModel?: string; // Need, Story, Message, etc.
  relatedId?: string;

  // Alt text for accessibility
  altText?: string;
  caption?: string;

  // Status
  isPublic: boolean;
  isActive: boolean;

  // Stats
  viewsCount: number;
  downloadsCount: number;

  // Storage
  storageProvider?: "local" | "s3" | "cloudinary" | "cdn";
  storageKey?: string;

  createdAt: Date;
  updatedAt: Date;
}

// ============= Story Types =============

export type StoryPrivacy = "public" | "followers" | "close_friends" | "custom";

export type StoryType = "image" | "video" | "text";

export interface IStoryMedia {
  type: MediaType;
  url: string;
  thumbnail?: string;
  duration?: number; // برای ویدئو
  metadata?: IMediaMetadata;
}

export interface IStoryView {
  user: IUser | string | ObjectId;
  viewedAt: Date;
  viewDuration?: number; // چند ثانیه استوری را دید
}

export interface IStoryReaction {
  user: IUser | string | ObjectId;
  emoji: string; // 😍, 👍, 😂, etc.
  reactedAt: Date;
}

export interface IStory {
  _id: string;

  // Owner
  user: IUser | string | ObjectId;

  // Content
  type: StoryType;
  media?: IStoryMedia;
  text?: string;
  backgroundColor?: string; // برای text stories
  textColor?: string;
  fontFamily?: string;

  // Caption
  caption?: string;

  // Privacy
  privacy: StoryPrivacy;
  allowedUsers?: string[]; // برای custom privacy

  // Linked content
  linkedNeed?: INeed | string | ObjectId;
  linkedUrl?: string;

  // Interactions
  views: IStoryView[];
  viewsCount: number;
  reactions: IStoryReaction[];
  reactionsCount: number;

  // Settings
  allowReplies: boolean;
  allowSharing: boolean;
  highlightedUntil?: Date; // برای story highlights

  // Status
  isActive: boolean;
  expiresAt: Date; // معمولاً 24 ساعت بعد

  // Metadata
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

// ============= Story Highlight Types =============

export interface IStoryHighlight {
  _id: string;
  user: IUser | string | ObjectId;
  title: string;
  coverImage: string;
  stories: (IStory | string | ObjectId)[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============= Media Gallery Types =============

export interface IMediaGallery {
  _id: string;
  owner: IUser | string | ObjectId;
  title: string;
  description?: string;
  media: (IMedia | string | ObjectId)[];
  coverImage?: string;
  isPublic: boolean;
  category?: string;
  tags?: string[];
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============= Media Processing Types =============

export interface IMediaProcessingJob {
  _id: string;
  media: IMedia | string | ObjectId;
  type: "thumbnail" | "compress" | "convert" | "resize";
  status: "pending" | "processing" | "completed" | "failed";
  progress: number; // 0-100
  error?: string;

  // Input params
  inputParams?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  };

  // Output
  outputUrl?: string;
  outputSize?: number;

  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// ============= Story Stats Types =============

export interface IStoryStats {
  userId: string;
  totalStories: number;
  totalViews: number;
  totalReactions: number;
  averageViews: number;
  averageReactions: number;
  activeStories: number;
  highlightsCount: number;
  lastStoryDate?: Date;
}

// ============= Media Upload Types =============

export interface IMediaUploadOptions {
  category: MediaCategory;
  relatedModel?: string;
  relatedId?: string;
  isPublic?: boolean;
  altText?: string;
  caption?: string;
  processImages?: boolean; // آیا تصاویر پردازش شوند
  generateThumbnails?: boolean;
  allowedTypes?: MediaType[];
  maxSize?: number; // bytes
}

export interface IMediaUploadResult {
  media: IMedia;
  processingJob?: IMediaProcessingJob;
  thumbnails?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

// ============= Story Feed Types =============

export interface IStoryFeedItem {
  user: IUser;
  stories: IStory[];
  hasUnviewed: boolean;
  unviewedCount: number;
  latestStoryTime: Date;
}

export interface IStoryFeed {
  items: IStoryFeedItem[];
  totalUsers: number;
  hasMore: boolean;
}

// ============= Media Stream Types =============

export interface IMediaStreamOptions {
  quality?: "low" | "medium" | "high" | "auto";
  startTime?: number; // seconds
  endTime?: number;
  format?: string;
}

// ============= Rich Text Types =============

export interface IRichTextBlock {
  type: "text" | "image" | "video" | "embed" | "quote" | "code";
  content: string;
  metadata?: Record<string, any>;
}

export interface IRichContent {
  blocks: IRichTextBlock[];
  metadata?: {
    readingTime?: number; // minutes
    wordCount?: number;
  };
}
