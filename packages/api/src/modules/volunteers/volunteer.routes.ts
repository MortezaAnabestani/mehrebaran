import { Router } from "express";
import { volunteerController } from "./volunteer.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

// Admin routes for getting all volunteers (must be before :id route)
router.get("/all", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), volunteerController.getAll);

// Public routes (read-only)
router.get("/project/:projectId", volunteerController.getByProject); // Get volunteers for a project
router.get("/project/:projectId/stats", volunteerController.getProjectStats); // Get stats
router.get("/project/:projectId/active", volunteerController.getActiveVolunteers); // Get active volunteers

// Protected routes (requires login)
router.use(protect); // All routes below require authentication

router.post("/register", volunteerController.register); // Register as volunteer
router.get("/my-registrations", volunteerController.getMyRegistrations); // Get user's registrations
router.post("/:id/withdraw", volunteerController.withdraw); // Withdraw from volunteering

// Admin routes
router.use(restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN)); // Only admins

router.patch("/:id", volunteerController.update); // Update registration
router.patch("/:id/approve", volunteerController.approve); // Approve volunteer
router.patch("/:id/reject", volunteerController.reject); // Reject volunteer
router.delete("/:id", volunteerController.delete); // Delete registration

// This must be last to avoid conflicts with other routes
router.get("/:id", volunteerController.getOne); // Get specific registration

export default router;
