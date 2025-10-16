import { Router } from "express";
import { tagController } from "./tag.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

router.get("/", tagController.getAll);

router.post("/", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), tagController.create);
router.patch("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), tagController.update);
router.delete("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), tagController.delete);

export default router;
