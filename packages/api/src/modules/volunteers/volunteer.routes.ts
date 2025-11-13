import { Router } from "express";
import { volunteerController } from "./volunteer.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

// Public routes (read-only)
router.get("/project/:projectId", volunteerController.getByProject); // Get volunteers for a project
router.get("/project/:projectId/stats", volunteerController.getProjectStats); // Get stats
router.get("/project/:projectId/active", volunteerController.getActiveVolunteers); // Get active volunteers

// Protected routes (requires login)
router.use(protect); // All routes below require authentication

router.post("/register", volunteerController.register); // Register as volunteer
router.get("/my-registrations", volunteerController.getMyRegistrations); // Get user's registrations
router.get("/:id", volunteerController.getOne); // Get specific registration
router.post("/:id/withdraw", volunteerController.withdraw); // Withdraw from volunteering

// Admin routes
router.use(restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN)); // Only admins

router.patch("/:id", volunteerController.update); // Update registration
router.patch("/:id/approve", volunteerController.approve); // Approve volunteer
router.patch("/:id/reject", volunteerController.reject); // Reject volunteer
router.delete("/:id", volunteerController.delete); // Delete registration

export default router;
