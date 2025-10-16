import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import ApiError from "../../core/utils/apiError";

class PublicUploadService {
  private storage: StorageEngine;

  constructor() {
    const uploadPath = path.join(__dirname, "../../../public/uploads/needs-attachments");
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
        const originalName = path.parse(file.originalname).name.replace(/\s+/g, "-");
        cb(null, `${originalName}-${uniqueSuffix}${extension}`);
      },
    });
  }

  private fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "audio/mpeg",
      "audio/wav",
      "video/mp4",
      "video/quicktime",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "نوع فایل مجاز نیست. فقط عکس، صدا و ویدئو پذیرفته می‌شود."));
    }
  };

  public uploadAttachments() {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 20 * 1024 * 1024,
        files: 5,
      },
    }).array("attachments", 5);
  }
}

export const publicUploadService = new PublicUploadService();
