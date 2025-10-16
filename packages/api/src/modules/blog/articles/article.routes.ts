import { Router } from "express";
import { articleController } from "./article.controller";
import { UserRole } from "common-types";
import { protect, restrictTo } from "../../auth/auth.middleware";

const router = Router();

router.get("/", articleController.getAll);
router.get("/:identifier", articleController.getOne);

router.patch("/:id/increment-view", articleController.incrementView);
router.post("/", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), articleController.create);
router.patch("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), articleController.update);
router.delete("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), articleController.delete);

export default router;
