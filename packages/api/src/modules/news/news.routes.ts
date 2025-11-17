import { Router } from "express";
import { newsController } from "./news.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";
import { uploadService } from "../upload/upload.service";

const router = Router();

router.get("/", newsController.getAll);
router.get("/:id", newsController.getOne);

router.patch("/:id/increment-view", newsController.incrementView);
router.post(
  "/",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadService.uploadSingleImage("featuredImage", "news"),
  uploadService.resizeAndProcessImages,
  newsController.create
);
router.patch(
  "/:id",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadService.uploadSingleImage("featuredImage", "news"),
  uploadService.resizeAndProcessImages,
  newsController.update
);
router.delete("/:id", protect, restrictTo(UserRole.SUPER_ADMIN), newsController.delete);

export default router;
