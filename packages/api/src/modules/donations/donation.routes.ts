import { Router } from "express";
import { donationController } from "./donation.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

// Admin routes for getting all donations (must be before :identifier route)
router.get("/all", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), donationController.getAll);

// Public routes
router.post("/", donationController.create); // Can be used by guests or logged-in users

router.get("/project/:projectId", donationController.getByProject); // Get all donations for a project

router.get("/project/:projectId/stats", donationController.getProjectStats); // Get stats

router.get("/project/:projectId/donors", donationController.getRecentDonors); // Get recent donors

// Payment routes (can be public or protected depending on use case)
router.post("/:donationId/pay", donationController.initiatePayment); // Initiate online payment
router.get("/:donationId/verify", donationController.verifyPayment); // Verify payment callback

// Protected routes (requires login)
router.use(protect); // All routes below require authentication

router.get("/user/my-donations", donationController.getMyDonations); // Get user's donations

router.post("/:donationId/upload-receipt", donationController.uploadReceipt); // Upload receipt

// Admin routes
router.use(restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN)); // Only admins

router.patch("/:donationId/verify", donationController.verifyBankTransfer); // Verify bank transfer

router.delete("/:id", donationController.delete); // Delete donation

// This must be last to avoid conflicts with other routes
router.get("/:identifier", donationController.getOne); // Get by ID or tracking code

export default router;
