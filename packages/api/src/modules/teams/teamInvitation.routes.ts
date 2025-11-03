import { Router } from "express";
import { teamController } from "./team.controller";
import { protect } from "../auth/auth.middleware";

const router = Router();

// User's team invitations
router.get("/my-invitations", protect, teamController.getUserInvitations);
router.post("/:invitationId/respond", protect, teamController.respondToInvitation);

export default router;
