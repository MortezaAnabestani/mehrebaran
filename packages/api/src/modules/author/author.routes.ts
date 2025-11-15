import { Router } from "express";
import { authorController } from "./author.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

router.use(protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.route("/").post(authorController.create).get(authorController.getAll);

router
  .route("/:identifier")
  .get(authorController.getById)
  .patch(authorController.update)
  .delete(authorController.delete);

export default router;
