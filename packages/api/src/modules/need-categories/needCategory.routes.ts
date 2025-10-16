import { Router } from "express";
import { needCategoryController } from "./needCategory.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

router.get("/", needCategoryController.getAll);

router.post("/", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), needCategoryController.create);
router.patch(
  "/:id",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  needCategoryController.update
);
router.delete(
  "/:id",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  needCategoryController.delete
);

export default router;
