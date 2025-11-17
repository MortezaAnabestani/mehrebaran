import { Router } from "express";
import { projectController } from "./project.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";
import { uploadService } from "../upload/upload.service";

const router = Router();

router.get("/", projectController.getAll);
router.get("/:identifier", projectController.getOne);

router.use(protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.patch("/:id/increment-view", projectController.incrementView);
router.post(
  "/",
  uploadService.uploadSingleImage("featuredImage", "projects"),
  uploadService.resizeAndProcessImages,
  projectController.create
);
router.patch(
  "/:id",
  uploadService.uploadSingleImage("featuredImage", "projects"),
  uploadService.resizeAndProcessImages,
  projectController.update
);
router.delete("/:id", projectController.delete);

export default router;
