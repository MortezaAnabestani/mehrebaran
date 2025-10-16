import { Router } from "express";
import { supporterSubmissionController } from "./supporterSubmission.controller";
import { protect, restrictTo } from "../../auth/auth.middleware";
import { isSupporter } from "../../needs/need.middleware";
import { UserRole } from "common-types";

const router = Router({ mergeParams: true });

router.get("/", supporterSubmissionController.getByNeed);

router.post("/", protect, isSupporter, supporterSubmissionController.create);

router.get(
  "/admin",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  supporterSubmissionController.getAllForAdmin
);

router.patch(
  "/:submissionId/status",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  supporterSubmissionController.updateStatus
);

export default router;
