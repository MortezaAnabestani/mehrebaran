import { Router } from "express";
import { bugReportController } from "./bug-report.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";
import { uploadService } from "../upload/upload.service";

const router = Router();

// مسیر عمومی برای ثبت گزارش (بدون نیاز به احراز هویت)
router.post(
  "/",
  uploadService.uploadMultipleImages("screenshots", 5, "bug-reports"),
  uploadService.resizeAndProcessMultipleImages,
  bugReportController.createBugReport,
);

// مسیرهای مدیریتی (نیاز به احراز هویت دارد)
router.use(protect);
router.use(restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get("/", bugReportController.getAllBugReports);
router.get("/:id", bugReportController.getBugReportById);
router.patch("/:id/status", bugReportController.updateBugReportStatus);
router.delete("/:id", bugReportController.deleteBugReport);

export default router;
