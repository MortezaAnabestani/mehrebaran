import { Router } from "express";
import { needController } from "./need.controller";
import { protect, protectOptional, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";
import supporterMessageRoutes from "../supporter/supporter-messages/supporterMessage.routes";
import pollRoutes from "../polls/poll.routes";
import supporterSubmissionRoutes from "../supporter/supporter-submissions/supporterSubmission.routes";

const router = Router();

router.post("/", protectOptional, needController.create);
router.get("/", needController.getAll);
router.get("/:identifier", needController.getOne);

router.post("/:id/upvote", protect, needController.toggleUpvote);

router.get(
  "/admin/all",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  needController.getAllForAdmin
);
router.patch("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), needController.update);
router.delete("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), needController.delete);
router.post("/:id/support", protect, needController.addSupporter);

router.use("/:id/messages", supporterMessageRoutes);
router.use("/:id/polls", pollRoutes);
router.use("/:id/submissions", supporterSubmissionRoutes);

export default router;
