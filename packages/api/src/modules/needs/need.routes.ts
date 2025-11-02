import { Router } from "express";
import { needController } from "./need.controller";
import { protect, protectOptional, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";
import supporterMessageRoutes from "../supporter/supporter-messages/supporterMessage.routes";
import pollRoutes from "../polls/poll.routes";
import supporterSubmissionRoutes from "../supporter/supporter-submissions/supporterSubmission.routes";

const router = Router();

// Public routes
router.post("/", protectOptional, needController.create);
router.get("/", needController.getAll);

// Special feeds (must be before /:identifier)
router.get("/trending", needController.getTrending);
router.get("/popular", needController.getPopular);
router.get("/urgent", needController.getUrgent);
router.get("/nearby", needController.getNearby);

router.get("/:identifier", needController.getOne);

// Social interactions
router.post("/:id/upvote", protect, needController.toggleUpvote);
router.post("/:id/support", protect, needController.addSupporter);
router.post("/:id/view", needController.incrementView);

// Updates (Timeline)
router.get("/:id/updates", needController.getUpdates);
router.post("/:id/updates", protect, needController.createUpdate);
router.patch("/:id/updates/:updateId", protect, needController.updateUpdate);
router.delete("/:id/updates/:updateId", protect, needController.deleteUpdate);

// Milestones
router.get("/:id/milestones", needController.getMilestones);
router.post("/:id/milestones", protect, needController.createMilestone);
router.patch("/:id/milestones/:milestoneId", protect, needController.updateMilestone);
router.delete("/:id/milestones/:milestoneId", protect, needController.deleteMilestone);
router.post("/:id/milestones/:milestoneId/complete", protect, needController.completeMilestone);

// Admin routes
router.get(
  "/admin/all",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  needController.getAllForAdmin
);
router.patch("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), needController.update);
router.delete("/:id", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), needController.delete);

// Nested routes for supporters
router.use("/:id/messages", supporterMessageRoutes);
router.use("/:id/polls", pollRoutes);
router.use("/:id/submissions", supporterSubmissionRoutes);

export default router;
