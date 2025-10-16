import { Router } from "express";
import { settingController } from "./setting.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

router.get("/:key", settingController.getByKey);

router.patch(
  "/:key",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  settingController.updateByKey
);

export default router;
