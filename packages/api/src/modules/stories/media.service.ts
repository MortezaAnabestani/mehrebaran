import { MediaModel } from "./media.model";
import type {
  IMedia,
  MediaType,
  MediaCategory,
  IMediaUploadOptions,
  IMediaUploadResult,
} from "common-types";
import path from "path";
import fs from "fs/promises";

class MediaService {
  /**
   * آپلود media
   */
  public async uploadMedia(
    userId: string,
    file: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
    },
    options: IMediaUploadOptions
  ): Promise<IMediaUploadResult> {
    // تشخیص نوع media
    const type = this.getMediaType(file.mimetype);

    // ساخت URL
    const url = `/uploads/${options.category}/${file.filename}`;

    // استخراج metadata
    const metadata = {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      extension: path.extname(file.originalname).toLowerCase(),
      isProcessed: false,
    };

    // اضافه کردن dimensions برای تصاویر
    if (type === "image") {
      try {
        // TODO: استفاده از sharp برای دریافت dimensions
        // const sharp = require('sharp');
        // const imageData = await sharp(file.path).metadata();
        // metadata.dimensions = {
        //   width: imageData.width,
        //   height: imageData.height,
        //   aspectRatio: `${imageData.width}:${imageData.height}`,
        // };
      } catch (error) {
        console.error("Failed to extract image metadata:", error);
      }
    }

    // ایجاد media در دیتابیس
    const media = await MediaModel.create({
      uploadedBy: userId,
      type,
      category: options.category,
      url,
      path: file.path,
      metadata: metadata as any,
      relatedModel: options.relatedModel,
      relatedId: options.relatedId,
      isPublic: options.isPublic !== false,
      altText: options.altText,
      caption: options.caption,
      storageProvider: "local",
    });

    // پردازش media (thumbnail generation, etc.) در background
    if (options.generateThumbnails && type === "image") {
      this.generateThumbnails(media._id.toString()).catch((error) => {
        console.error("Failed to generate thumbnails:", error);
      });
    }

    return {
      media,
    };
  }

  /**
   * دریافت media بر اساس ID
   */
  public async getMediaById(mediaId: string): Promise<IMedia | null> {
    return MediaModel.findById(mediaId).populate("uploadedBy", "name avatar");
  }

  /**
   * دریافت media های کاربر
   */
  public async getUserMedia(
    userId: string,
    category?: MediaCategory,
    limit: number = 50,
    skip: number = 0
  ): Promise<IMedia[]> {
    return (MediaModel as any).getByUser(userId, category).limit(limit).skip(skip);
  }

  /**
   * دریافت media های مرتبط با موجودیت
   */
  public async getRelatedMedia(relatedModel: string, relatedId: string): Promise<IMedia[]> {
    return (MediaModel as any).getByRelated(relatedModel, relatedId);
  }

  /**
   * حذف media
   */
  public async deleteMedia(mediaId: string, userId: string): Promise<boolean> {
    const media = await MediaModel.findOne({ _id: mediaId, uploadedBy: userId });

    if (!media) {
      return false;
    }

    // حذف فایل از دیسک
    try {
      await fs.unlink(media.path);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }

    // حذف از دیتابیس
    await media.deleteOne();
    return true;
  }

  /**
   * افزایش شمارنده views
   */
  public async incrementViews(mediaId: string): Promise<void> {
    const media = await MediaModel.findById(mediaId);
    if (media) {
      await (media as any).incrementViews();
    }
  }

  /**
   * افزایش شمارنده downloads
   */
  public async incrementDownloads(mediaId: string): Promise<void> {
    const media = await MediaModel.findById(mediaId);
    if (media) {
      await (media as any).incrementDownloads();
    }
  }

  /**
   * دریافت کل حجم فایل‌های کاربر
   */
  public async getTotalUserStorage(userId: string): Promise<number> {
    return (MediaModel as any).getTotalSize(userId);
  }

  /**
   * دریافت آمار media کاربر
   */
  public async getUserMediaStats(userId: string) {
    const [totalCount, totalSize, byType] = await Promise.all([
      MediaModel.countDocuments({ uploadedBy: userId }),
      (MediaModel as any).getTotalSize(userId),
      MediaModel.aggregate([
        { $match: { uploadedBy: userId as any } },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
            totalSize: { $sum: "$metadata.size" },
          },
        },
      ]),
    ]);

    return {
      totalCount,
      totalSize,
      totalSizeInMB: (totalSize / (1024 * 1024)).toFixed(2),
      byType: byType.reduce((acc: any, item: any) => {
        acc[item._id] = {
          count: item.count,
          totalSize: item.totalSize,
          totalSizeInMB: (item.totalSize / (1024 * 1024)).toFixed(2),
        };
        return acc;
      }, {}),
    };
  }

  /**
   * تولید thumbnails
   */
  private async generateThumbnails(mediaId: string): Promise<void> {
    const media = await MediaModel.findById(mediaId);

    if (!media || media.type !== "image") {
      return;
    }

    try {
      // TODO: استفاده از sharp برای تولید thumbnail
      // const sharp = require('sharp');
      // const thumbnailPath = media.path.replace(/(\.\w+)$/, '_thumb$1');
      // await sharp(media.path)
      //   .resize(200, 200, { fit: 'cover' })
      //   .toFile(thumbnailPath);
      // media.metadata.thumbnail = thumbnailPath.replace(process.cwd(), '');
      // media.metadata.isProcessed = true;
      // media.metadata.processingStatus = 'completed';
      // await media.save();
    } catch (error) {
      console.error("Failed to generate thumbnail:", error);
      media.metadata.isProcessed = false;
      media.metadata.processingStatus = "failed";
      media.metadata.processingError = (error as Error).message;
      await media.save();
    }
  }

  /**
   * تشخیص نوع media از mimetype
   */
  private getMediaType(mimetype: string): MediaType {
    if (mimetype.startsWith("image/")) return "image";
    if (mimetype.startsWith("video/")) return "video";
    if (mimetype.startsWith("audio/")) return "audio";
    if (
      mimetype === "application/pdf" ||
      mimetype.includes("document") ||
      mimetype.includes("msword") ||
      mimetype.includes("spreadsheet")
    ) {
      return "document";
    }
    return "file";
  }

  /**
   * Cleanup media های غیرفعال
   */
  public async cleanupInactiveMedia(days: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const inactiveMedia = await MediaModel.find({
      isActive: false,
      updatedAt: { $lt: cutoffDate },
    });

    let deletedCount = 0;

    for (const media of inactiveMedia) {
      try {
        await fs.unlink(media.path);
        await media.deleteOne();
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete media ${media._id}:`, error);
      }
    }

    return deletedCount;
  }
}

export const mediaService = new MediaService();
