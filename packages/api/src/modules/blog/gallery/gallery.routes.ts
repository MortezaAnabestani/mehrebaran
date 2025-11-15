import { Router } from "express";
import { galleryController } from "./gallery.controller";
import { UserRole } from "common-types";
import { protect, restrictTo } from "../../auth/auth.middleware";
import { uploadService } from "../../upload/upload.service";

const router = Router();

router.get("/", galleryController.getAll);
router.get("/:identifier", galleryController.getOne);

router.patch("/:id/increment-view", galleryController.incrementView);
router.post(
  "/",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadService.uploadMultipleImages("images", 20),
  uploadService.resizeAndProcessImages,
  galleryController.create
);
router.patch(
  "/:id",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadService.uploadMultipleImages("images", 20),
  uploadService.resizeAndProcessImages,
  galleryController.update
);
router.delete("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), galleryController.delete);

export default router;
