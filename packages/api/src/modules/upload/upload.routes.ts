import { Router } from "express";
import { uploadController } from "./upload.controller";
import { uploadService } from "./upload.service";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

router.use(protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.post(
  "/single",
  uploadService.uploadSingleImage("image"),
  uploadService.resizeAndProcessImages,
  uploadController.uploadSingle
);

router.post(
  "/multiple",
  uploadService.uploadMultipleImages("gallery", 10),
  uploadService.resizeAndProcessMultipleImages,
  uploadController.uploadMultiple
);

export default router;
