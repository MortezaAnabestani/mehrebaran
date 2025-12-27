import { Router } from "express";
import { imageUploadCenterController } from "./image-upload-center.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";
import { uploadService } from "../upload/upload.service";

const router = Router();

// مسیرهای عمومی (نیاز به احراز هویت دارد)
router.use(protect);

router.post(
  "/",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadService.uploadSingleImage("imageUrl", "general"),
  uploadService.resizeAndProcessImages,
  imageUploadCenterController.createImage
);

router.get("/", imageUploadCenterController.getAllImages);

router.get("/:id", imageUploadCenterController.getImageById);

router.delete(
  "/:id",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  imageUploadCenterController.deleteImage
);

export default router;
