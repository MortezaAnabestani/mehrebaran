import { Router } from "express";
import { focusAreaController } from "./focus-area.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

// Public routes
router.get("/", focusAreaController.getAll);
router.get("/:id", focusAreaController.getOne);

// Protected admin routes
router.post(
  "/",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  focusAreaController.create
);

router.patch(
  "/:id",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  focusAreaController.update
);

router.delete(
  "/:id",
  protect,
  restrictTo(UserRole.SUPER_ADMIN),
  focusAreaController.delete
);

router.patch(
  "/reorder",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  focusAreaController.reorder
);

router.patch(
  "/:id/toggle-active",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  focusAreaController.toggleActive
);

export default router;
