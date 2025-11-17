// packages/api/src/modules/upload/upload.service.ts
import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import moment from "moment-jalaali";
import { AuthenticatedUser } from "../auth/auth.middleware";

interface ProcessedFiles {
  desktop: string;
  mobile: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      processedFiles?: any;
      uploadSection?: string;
    }
  }
}

type SupportedSection = "projects" | "articles" | "news" | "stories" | "needs" | "users" | "categories" | "general";

class UploadService {
  private storage: StorageEngine;
  private readonly baseUploadPath: string;
  private readonly maxFileSize: number = 20 * 1024 * 1024; // 20MB
  private readonly desktopMaxWidth: number = 1920;
  private readonly mobileMaxWidth: number = 768;
  private readonly webpQuality: number = 85;
  private readonly allowedMimeTypes: string[] = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  constructor() {
    this.baseUploadPath = path.join(__dirname, "../../../public/uploads");
    if (!fs.existsSync(this.baseUploadPath)) {
      fs.mkdirSync(this.baseUploadPath, { recursive: true });
    }

    // Temporary storage for initial upload before processing
    this.storage = multer.memoryStorage();
  }

  /**
   * Generate Persian date-based folder path
   * Returns: section/YYYY/MM/DD
   */
  private getPersianDatePath(section: SupportedSection): string {
    moment.loadPersian({ dialect: "persian-modern" });
    const now = moment();
    const year = now.jYear().toString();
    const month = now.jMonth() + 1; // jMonth() is 0-indexed
    const day = now.jDate();

    const monthStr = month.toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");

    return path.join(section, year, monthStr, dayStr);
  }

  /**
   * Generate unique filename with Persian date
   * Format: [section]-[year]-[month]-[day]-[timestamp]-[random].webp
   */
  private generateUniqueFilename(section: SupportedSection, suffix: "desktop" | "mobile"): string {
    moment.loadPersian({ dialect: "persian-modern" });
    const now = moment();
    const year = now.jYear().toString();
    const month = (now.jMonth() + 1).toString().padStart(2, "0");
    const day = now.jDate().toString().padStart(2, "0");
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e6);

    return `${section}-${year}-${month}-${day}-${timestamp}-${random}-${suffix}.webp`;
  }

  /**
   * File filter to validate image types
   */
  private fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (this.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("فرمت فایل پشتیبانی نمی‌شود. فرمت‌های مجاز: JPG, PNG, WebP, GIF"));
    }
  };

  /**
   * Multer middleware for single image upload
   * @param fieldName - Name of the form field
   * @param section - Section name for organizing uploads (projects, articles, etc.)
   */
  public uploadSingleImage(fieldName: string, section: SupportedSection = "general") {
    return (req: Request, res: Response, next: NextFunction) => {
      req.uploadSection = section;
      const upload = multer({
        storage: this.storage,
        fileFilter: this.fileFilter,
        limits: { fileSize: this.maxFileSize },
      }).single(fieldName);

      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return next(new Error("حجم فایل نباید بیشتر از 20 مگابایت باشد."));
          }
          return next(new Error(`خطا در آپلود فایل: ${err.message}`));
        } else if (err) {
          return next(err);
        }
        next();
      });
    };
  }

  /**
   * Multer middleware for multiple image upload
   * @param fieldName - Name of the form field
   * @param maxCount - Maximum number of files
   * @param section - Section name for organizing uploads
   */
  public uploadMultipleImages(fieldName: string, maxCount: number, section: SupportedSection = "general") {
    return (req: Request, res: Response, next: NextFunction) => {
      req.uploadSection = section;
      const upload = multer({
        storage: this.storage,
        fileFilter: this.fileFilter,
        limits: { fileSize: this.maxFileSize },
      }).array(fieldName, maxCount);

      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return next(new Error("حجم فایل نباید بیشتر از 20 مگابایت باشد."));
          }
          if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return next(new Error(`تعداد فایل‌ها نباید بیشتر از ${maxCount} باشد.`));
          }
          return next(new Error(`خطا در آپلود فایل: ${err.message}`));
        } else if (err) {
          return next(err);
        }
        next();
      });
    };
  }

  /**
   * Process and resize single uploaded image to desktop and mobile versions
   * Converts to WebP format with specified quality
   */
  public resizeAndProcessImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("🔍 resizeAndProcessImages called");
    console.log("📁 req.file exists:", !!req.file);
    console.log("📁 req.file:", req.file);

    if (!req.file || !req.file.buffer) {
      console.log("⚠️ No file or buffer, skipping image processing");
      return next();
    }

    const section = (req.uploadSection as SupportedSection) || "general";
    console.log("📂 Section:", section);

    try {
      // Create folder structure based on Persian date
      const datePath = this.getPersianDatePath(section);
      const fullUploadPath = path.join(this.baseUploadPath, datePath);
      console.log("📂 Upload path:", fullUploadPath);

      if (!fs.existsSync(fullUploadPath)) {
        fs.mkdirSync(fullUploadPath, { recursive: true });
        console.log("✅ Created directory:", fullUploadPath);
      }

      req.processedFiles = { desktop: "", mobile: "" };

      // Process desktop version (1920px max width)
      const desktopFilename = this.generateUniqueFilename(section, "desktop");
      await sharp(req.file.buffer)
        .resize(this.desktopMaxWidth, null, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: this.webpQuality })
        .toFile(path.join(fullUploadPath, desktopFilename));

      req.processedFiles.desktop = `/uploads/${datePath.replace(/\\/g, "/")}/${desktopFilename}`;
      console.log("✅ Desktop image saved:", req.processedFiles.desktop);

      // Process mobile version (768px max width)
      const mobileFilename = this.generateUniqueFilename(section, "mobile");
      await sharp(req.file.buffer)
        .resize(this.mobileMaxWidth, null, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: this.webpQuality })
        .toFile(path.join(fullUploadPath, mobileFilename));

      req.processedFiles.mobile = `/uploads/${datePath.replace(/\\/g, "/")}/${mobileFilename}`;
      console.log("✅ Mobile image saved:", req.processedFiles.mobile);
      console.log("✅ Processing complete, processedFiles:", req.processedFiles);

      next();
    } catch (error) {
      console.error("❌ Error processing images:", error);
      next(error);
    }
  };

  /**
   * Process and resize multiple uploaded images
   */
  public resizeAndProcessMultipleImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next();
    }

    const section = (req.uploadSection as SupportedSection) || "general";

    try {
      req.processedFiles = [];

      // Create folder structure based on Persian date
      const datePath = this.getPersianDatePath(section);
      const fullUploadPath = path.join(this.baseUploadPath, datePath);

      if (!fs.existsSync(fullUploadPath)) {
        fs.mkdirSync(fullUploadPath, { recursive: true });
      }

      await Promise.all(
        req.files.map(async (file) => {
          if (!file.buffer) return;

          const processedPair: ProcessedFiles = { desktop: "", mobile: "" };

          // Process desktop version
          const desktopFilename = this.generateUniqueFilename(section, "desktop");
          await sharp(file.buffer)
            .resize(this.desktopMaxWidth, null, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .webp({ quality: this.webpQuality })
            .toFile(path.join(fullUploadPath, desktopFilename));

          processedPair.desktop = `/uploads/${datePath.replace(/\\/g, "/")}/${desktopFilename}`;

          // Process mobile version
          const mobileFilename = this.generateUniqueFilename(section, "mobile");
          await sharp(file.buffer)
            .resize(this.mobileMaxWidth, null, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .webp({ quality: this.webpQuality })
            .toFile(path.join(fullUploadPath, mobileFilename));

          processedPair.mobile = `/uploads/${datePath.replace(/\\/g, "/")}/${mobileFilename}`;

          req.processedFiles.push(processedPair);
        })
      );

      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete image files from disk
   * @param imagePaths - Object or array containing image paths to delete
   * @returns Promise<boolean> - Success status
   */
  public async deleteImage(imagePaths: ProcessedFiles | ProcessedFiles[]): Promise<boolean> {
    try {
      const pathsArray = Array.isArray(imagePaths) ? imagePaths : [imagePaths];

      for (const paths of pathsArray) {
        // Delete desktop version
        if (paths.desktop) {
          const desktopPath = path.join(this.baseUploadPath, "..", paths.desktop);
          if (fs.existsSync(desktopPath)) {
            await fs.promises.unlink(desktopPath);
          }
        }

        // Delete mobile version
        if (paths.mobile) {
          const mobilePath = path.join(this.baseUploadPath, "..", paths.mobile);
          if (fs.existsSync(mobilePath)) {
            await fs.promises.unlink(mobilePath);
          }
        }
      }

      return true;
    } catch (error) {
      console.error("خطا در حذف فایل‌های تصویر:", error);
      return false;
    }
  }

  /**
   * Update image - delete old image and return new processed files from request
   * @param oldImagePaths - Old image paths to delete
   * @param req - Express request object containing new processed files
   * @returns Promise<ProcessedFiles | null> - New image paths or null
   */
  public async updateImage(
    oldImagePaths: ProcessedFiles | null,
    req: Request
  ): Promise<ProcessedFiles | null> {
    try {
      // Delete old image if exists
      if (oldImagePaths) {
        await this.deleteImage(oldImagePaths);
      }

      // Return new processed files from request
      if (req.processedFiles && !Array.isArray(req.processedFiles)) {
        return req.processedFiles as ProcessedFiles;
      }

      return null;
    } catch (error) {
      console.error("خطا در به‌روزرسانی تصویر:", error);
      throw error;
    }
  }

  /**
   * Clean up empty date folders to keep uploads directory organized
   * @param section - Section to clean up
   */
  public async cleanupEmptyFolders(section: SupportedSection): Promise<void> {
    try {
      const sectionPath = path.join(this.baseUploadPath, section);
      if (!fs.existsSync(sectionPath)) return;

      const years = fs.readdirSync(sectionPath);
      for (const year of years) {
        const yearPath = path.join(sectionPath, year);
        if (!fs.statSync(yearPath).isDirectory()) continue;

        const months = fs.readdirSync(yearPath);
        for (const month of months) {
          const monthPath = path.join(yearPath, month);
          if (!fs.statSync(monthPath).isDirectory()) continue;

          const days = fs.readdirSync(monthPath);
          for (const day of days) {
            const dayPath = path.join(monthPath, day);
            if (!fs.statSync(dayPath).isDirectory()) continue;

            // Remove day folder if empty
            const dayFiles = fs.readdirSync(dayPath);
            if (dayFiles.length === 0) {
              fs.rmdirSync(dayPath);
            }
          }

          // Remove month folder if empty
          const monthFiles = fs.readdirSync(monthPath);
          if (monthFiles.length === 0) {
            fs.rmdirSync(monthPath);
          }
        }

        // Remove year folder if empty
        const yearFiles = fs.readdirSync(yearPath);
        if (yearFiles.length === 0) {
          fs.rmdirSync(yearPath);
        }
      }
    } catch (error) {
      console.error("خطا در پاکسازی پوشه‌های خالی:", error);
    }
  }
}

export const uploadService = new UploadService();
