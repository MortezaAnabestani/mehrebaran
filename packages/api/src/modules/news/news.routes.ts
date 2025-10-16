import { Router } from "express";
import { newsController } from "./news.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

router.get("/", newsController.getAll);
router.get("/:id", newsController.getOne);

router.patch("/:id/increment-view", newsController.incrementView);
router.post("/", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), newsController.create);
router.patch("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), newsController.update);
router.delete("/:id", protect, restrictTo(UserRole.SUPER_ADMIN), newsController.delete);

export default router;
