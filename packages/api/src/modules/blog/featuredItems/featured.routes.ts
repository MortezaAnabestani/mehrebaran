import { Router } from "express";
import { featuredItemController } from "./featured.controller";
import { UserRole } from "common-types";
import { protect, restrictTo } from "../../auth/auth.middleware";

const router = Router();

router.get("/", featuredItemController.getAll);

router.put("/", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), featuredItemController.updateAll);

export default router;
