import { Router } from "express";
import { commentController } from "./comment.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

router.post("/", protect, commentController.create);
router.get("/post/:postId", commentController.getByPost);

// Admin routes
router.get("/admin/pending", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), commentController.getPending);
router.patch("/admin/approve/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), commentController.approve);
router.patch("/admin/reject/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), commentController.reject);

router.get("/", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), commentController.getAll);
router.patch("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), commentController.update);
router.delete("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), commentController.delete);

export default router;
