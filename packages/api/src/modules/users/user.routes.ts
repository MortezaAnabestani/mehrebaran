import { Router } from "express";
import { userController } from "./user.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

router.use(protect);

router.get("/me", userController.getMe);

router.get("/", restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.getAllUsers);

router.get("/:id", userController.getUserById);

export default router;
