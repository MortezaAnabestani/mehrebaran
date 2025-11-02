import { Router } from "express";
import { mediaController } from "./media.controller";
import { protect } from "../auth/auth.middleware";
import { validate } from "../../core/middlewares/validate";
import {
  uploadMediaSchema,
  mediaIdParamSchema,
  getUserMediaSchema,
  getRelatedMediaSchema,
} from "./media.validation";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { category = "general" } = req.body;
    const uploadPath = path.join(process.cwd(), "uploads", category);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Allowed file types
  const allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Videos
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/webm",
    // Audio
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "application/json",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`فرمت فایل ${file.mimetype} پشتیبانی نمی‌شود.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});

// All routes require authentication
router.use(protect);

// ==================== MEDIA UPLOAD ====================

/**
 * POST /api/v1/media/upload
 * آپلود فایل media
 */
router.post("/upload", upload.single("file"), validate(uploadMediaSchema), mediaController.uploadMedia);

// ==================== MEDIA MANAGEMENT ====================

/**
 * GET /api/v1/media/stats
 * آمار media کاربر
 */
router.get("/stats", mediaController.getStats);

/**
 * GET /api/v1/media/storage
 * دریافت کل حجم فایل‌های کاربر
 */
router.get("/storage", mediaController.getTotalStorage);

/**
 * GET /api/v1/media/user/:userId
 * دریافت media های کاربر
 */
router.get("/user/:userId", validate(getUserMediaSchema), mediaController.getUserMedia);

/**
 * GET /api/v1/media/related/:model/:id
 * دریافت media های مرتبط با موجودیت
 */
router.get("/related/:model/:id", validate(getRelatedMediaSchema), mediaController.getRelatedMedia);

/**
 * GET /api/v1/media/:id
 * دریافت media بر اساس ID
 */
router.get("/:id", validate(mediaIdParamSchema), mediaController.getMediaById);

/**
 * POST /api/v1/media/:id/download
 * افزایش شمارنده downloads
 */
router.post("/:id/download", validate(mediaIdParamSchema), mediaController.incrementDownloads);

/**
 * DELETE /api/v1/media/:id
 * حذف media
 */
router.delete("/:id", validate(mediaIdParamSchema), mediaController.deleteMedia);

export default router;
