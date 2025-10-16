import { Router } from "express";
import { galleryController } from "./gallery.controller";
import { UserRole } from "common-types";
import { protect, restrictTo } from "../../auth/auth.middleware";

const router = Router();

router.get("/", galleryController.getAll);
router.get("/:identifier", galleryController.getOne);

router.patch("/:id/increment-view", galleryController.incrementView);
router.post("/", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), galleryController.create);
router.patch("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), galleryController.update);
router.delete("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), galleryController.delete);

export default router;
