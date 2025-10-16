// packages/api/src/modules/upload/upload.service.ts
import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
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
    }
  }
}

class UploadService {
  private storage: StorageEngine;

  constructor() {
    const uploadPath = path.join(__dirname, "../../../public/uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
      },
    });
  }

  private fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("فایل ارسالی تصویر نیست! لطفاً فقط فایل تصویری آپلود کنید."));
    }
  };

  public uploadSingleImage(fieldName: string) {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: { fileSize: 20 * 1024 * 1024 },
    }).single(fieldName);
  }

  public resizeAndProcessImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.file) {
      return next();
    }

    try {
      const fileBuffer = await fs.promises.readFile(req.file.path);

      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const uploadPath = path.join(req.file.destination, year, month, day);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const randomSuffix = Math.round(Math.random() * 1e6);
      const filenameBase = `SDJDM-MehreBaran-${Date.now()}-${randomSuffix}`;

      req.processedFiles = { desktop: "", mobile: "" };

      const desktopFilename = `${filenameBase}-desktop.webp`;
      await sharp(fileBuffer)
        .resize(1200, 1200, { fit: "inside" })
        .toFormat("webp")
        .webp({ quality: 85 })
        .toFile(path.join(uploadPath, desktopFilename));
      req.processedFiles.desktop = `/uploads/${year}/${month}/${day}/${desktopFilename}`;

      const mobileFilename = `${filenameBase}-mobile.webp`;
      await sharp(fileBuffer)
        .resize(480, 480, { fit: "inside" })
        .toFormat("webp")
        .webp({ quality: 80 })
        .toFile(path.join(uploadPath, mobileFilename));
      req.processedFiles.mobile = `/uploads/${year}/${month}/${day}/${mobileFilename}`;

      await fs.promises.unlink(req.file.path);

      next();
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  };

  public uploadMultipleImages(fieldName: string, maxCount: number) {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: { fileSize: 20 * 1024 * 1024 },
    }).array(fieldName, maxCount);
  }

  public resizeAndProcessMultipleImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next();
    }

    try {
      req.processedFiles = [];

      await Promise.all(
        req.files.map(async (file) => {
          const fileBuffer = await fs.promises.readFile(file.path);

          const now = new Date();
          const year = now.getFullYear().toString();
          const month = (now.getMonth() + 1).toString().padStart(2, "0");
          const day = now.getDate().toString().padStart(2, "0");

          const uploadPath = path.join(file.destination, year, month, day);

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          const randomSuffix = Math.round(Math.random() * 1e6);
          const filenameBase = `[SDJDM-MehreBaran]-${Date.now()}-${randomSuffix}`;

          const processedPair: ProcessedFiles = { desktop: "", mobile: "" };

          const desktopFilename = `${filenameBase}-desktop.webp`;
          await sharp(fileBuffer)
            .resize(1000, 1000, { fit: "inside" })
            .toFormat("webp")
            .webp({ quality: 80 })
            .toFile(path.join(uploadPath, desktopFilename));
          processedPair.desktop = `/uploads/${year}/${month}/${day}/${desktopFilename}`;

          const mobileFilename = `${filenameBase}-mobile.webp`;
          await sharp(fileBuffer)
            .resize(480, 480, { fit: "inside" })
            .toFormat("webp")
            .webp({ quality: 80 })
            .toFile(path.join(uploadPath, mobileFilename));
          processedPair.mobile = `/uploads/${year}/${month}/${day}/${mobileFilename}`;

          req.processedFiles.push(processedPair);
          await fs.promises.unlink(file.path);
        })
      );

      next();
    } catch (error) {
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      next(error);
    }
  };
}
export const uploadService = new UploadService();
