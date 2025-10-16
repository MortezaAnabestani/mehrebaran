import { Router } from "express";
import { projectController } from "./project.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

router.get("/", projectController.getAll);
router.get("/:identifier", projectController.getOne);

router.use(protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.patch("/:id/increment-view", projectController.incrementView);
router.post("/", projectController.create);
router.patch("/:id", projectController.update);
router.delete("/:id", projectController.delete);

export default router;
