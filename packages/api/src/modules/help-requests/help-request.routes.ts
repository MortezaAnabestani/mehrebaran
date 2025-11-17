import { Router } from "express";
import { helpRequestController } from "./help-request.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";
import { uploadService } from "../upload/upload.service";

const router = Router();

// Public route - create help request (no auth required)
router.post(
  "/",
  uploadService.uploadMultipleImages("media", 5, "needs"),
  uploadService.resizeAndProcessMultipleImages,
  helpRequestController.create
);

// Protected routes - admin only
router.use(protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get("/", helpRequestController.getAll);
router.get("/stats", helpRequestController.getStats);
router.get("/:id", helpRequestController.getOne);
router.patch("/:id/status", helpRequestController.updateStatus);
router.delete("/:id", helpRequestController.delete);

export default router;
