import { Router } from "express";
import { videoController } from "./video.controller";
import { UserRole } from "common-types";
import { protect, restrictTo } from "../../auth/auth.middleware";
import { uploadService } from "../../upload/upload.service";

const router = Router();

router.get("/", videoController.getAll);
router.get("/:identifier", videoController.getOne);

router.patch("/:id/increment-view", videoController.incrementView);
router.post(
  "/",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadService.uploadSingleImage("coverImage", "articles"),
  uploadService.resizeAndProcessImages,
  videoController.create
);
router.patch(
  "/:id",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadService.uploadSingleImage("coverImage", "articles"),
  uploadService.resizeAndProcessImages,
  videoController.update
);
router.delete("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), videoController.delete);

export default router;
