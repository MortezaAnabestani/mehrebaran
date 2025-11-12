import { Router } from "express";
import { donationController } from "./donation.controller";
import { protect, restrictTo } from "../../core/middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/", donationController.create); // Can be used by guests or logged-in users

router.get("/:identifier", donationController.getOne); // Get by ID or tracking code

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
router.use(restrictTo("admin", "manager")); // Only admins and managers

router.patch("/:donationId/verify", donationController.verifyBankTransfer); // Verify bank transfer

router.delete("/:id", donationController.delete); // Delete donation

export default router;
