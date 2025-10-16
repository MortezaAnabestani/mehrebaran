import { Router } from "express";
import { categoryController } from "./category.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

router.use(protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.route("/").post(categoryController.create).get(categoryController.getAll);

router
  .route("/:id")
  .get(categoryController.getById)
  .patch(categoryController.update)
  .delete(categoryController.delete);

export default router;
