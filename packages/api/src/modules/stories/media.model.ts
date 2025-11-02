import { Schema, model, Types } from "mongoose";
import type { IMedia, MediaType, MediaCategory, IMediaMetadata } from "common-types";

const mediaDimensionsSchema = new Schema(
  {
    width: Number,
    height: Number,
    aspectRatio: String,
  },
  { _id: false }
);

const mediaMetadataSchema = new Schema<IMediaMetadata>(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    extension: { type: String, required: true },
    dimensions: mediaDimensionsSchema,
    duration: Number,
    isProcessed: { type: Boolean, default: false },
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
    },
    processingError: String,
    thumbnail: String,
    thumbnailSmall: String,
    thumbnailMedium: String,
    thumbnailLarge: String,
    exif: Schema.Types.Mixed,
    codec: String,
    bitrate: Number,
    frameRate: Number,
  },
  { _id: false }
);

const mediaSchema = new Schema<IMedia>(
  {
    uploadedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["image", "video", "audio", "document", "file"] as MediaType[],
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        "profile",
        "cover",
        "need",
        "story",
        "message",
        "comment",
        "gallery",
        "document",
      ] as MediaCategory[],
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    cdnUrl: String,
    path: {
      type: String,
      required: true,
    },
    metadata: {
      type: mediaMetadataSchema,
      required: true,
    },
    relatedModel: {
      type: String,
      index: true,
    },
    relatedId: {
      type: String,
      index: true,
    },
    altText: String,
    caption: String,
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    storageProvider: {
      type: String,
      enum: ["local", "s3", "cloudinary", "cdn"],
      default: "local",
    },
    storageKey: String,
  },
  {
    timestamps: true,
  }
);

// ============= Indexes =============

// Compound index for user's media
mediaSchema.index({ uploadedBy: 1, category: 1, createdAt: -1 });

// Compound index for related content
mediaSchema.index({ relatedModel: 1, relatedId: 1 });

// Index for cleanup queries
mediaSchema.index({ isActive: 1, createdAt: 1 });

// ============= Virtual Fields =============

mediaSchema.virtual("sizeInMB").get(function () {
  return (this.metadata.size / (1024 * 1024)).toFixed(2);
});

mediaSchema.virtual("durationFormatted").get(function () {
  if (!this.metadata.duration) return null;

  const minutes = Math.floor(this.metadata.duration / 60);
  const seconds = Math.floor(this.metadata.duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

// ============= Instance Methods =============

mediaSchema.methods.incrementViews = async function () {
  this.viewsCount += 1;
  return this.save();
};

mediaSchema.methods.incrementDownloads = async function () {
  this.downloadsCount += 1;
  return this.save();
};

// ============= Static Methods =============

mediaSchema.statics.getByUser = async function (userId: string, category?: MediaCategory) {
  const query: any = { uploadedBy: userId, isActive: true };
  if (category) query.category = category;

  return this.find(query).sort({ createdAt: -1 });
};

mediaSchema.statics.getByRelated = async function (relatedModel: string, relatedId: string) {
  return this.find({
    relatedModel,
    relatedId,
    isActive: true,
  }).sort({ createdAt: -1 });
};

mediaSchema.statics.getTotalSize = async function (userId: string): Promise<number> {
  const result = await this.aggregate([
    { $match: { uploadedBy: new Types.ObjectId(userId) } },
    { $group: { _id: null, totalSize: { $sum: "$metadata.size" } } },
  ]);

  return result.length > 0 ? result[0].totalSize : 0;
};

export const MediaModel = model<IMedia>("Media", mediaSchema);
