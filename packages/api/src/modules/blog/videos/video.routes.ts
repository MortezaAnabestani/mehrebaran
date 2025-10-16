import { Router } from "express";
import { videoController } from "./video.controller";
import { UserRole } from "common-types";
import { protect, restrictTo } from "../../auth/auth.middleware";

const router = Router();

router.get("/", videoController.getAll);
router.get("/:identifier", videoController.getOne);

router.patch("/:id/increment-view", videoController.incrementView);
router.post("/", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), videoController.create);
router.patch("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), videoController.update);
router.delete("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), videoController.delete);

export default router;
