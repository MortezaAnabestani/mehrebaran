import { Router } from "express";
import { teamController } from "./team.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { isSupporter } from "../needs/need.middleware";
import { UserRole } from "common-types";

const router = Router({ mergeParams: true });

// All routes require authentication

// Admin routes
router.get(
  "/admin/all",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  teamController.getAllTeamsForAdmin,
);

// Team CRUD
router.post("/", protect, isSupporter, teamController.createTeam);
router.get("/", teamController.getTeams);
router.get("/my-teams", protect, teamController.getUserTeams);
router.get("/:teamId", teamController.getTeamById);
router.patch("/:teamId", protect, teamController.updateTeam);
router.delete("/:teamId", protect, teamController.deleteTeam);

// Team statistics
router.get("/:teamId/stats", teamController.getTeamStats);

// Member management
router.post("/:teamId/members", protect, teamController.addMember);
router.delete("/:teamId/members/:userId", protect, teamController.removeMember);
router.patch("/:teamId/members/:userId/role", protect, teamController.updateMemberRole);

// Invitations
router.post("/:teamId/invite", protect, teamController.inviteUser);

// User invitations (not scoped to need)
// This should be at root level, not nested under needs
// Will be handled separately in main router

export default router;
