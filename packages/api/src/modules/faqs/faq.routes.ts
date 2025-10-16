import { Router } from "express";
import { faqController } from "./faq.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

router.get("/client", faqController.getAllForClient);

router.use(protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.route("/").post(faqController.create).get(faqController.getAllForAdmin);

router.route("/:id").patch(faqController.update).delete(faqController.delete);

export default router;
