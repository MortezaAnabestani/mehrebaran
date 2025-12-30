import { Router } from "express";
import { adminController } from "./admin.controller";
import { protect } from "../auth/auth.middleware";
import { restrictTo } from "../auth/auth.middleware";
import { UserRole } from "../users/user.model";
import { uploadService } from "../upload/upload.service";

const router = Router();

// Protect all admin routes - only ADMIN and SUPER_ADMIN can access
router.use(protect);
router.use(restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

// ==================== ADMIN MANAGEMENT ROUTES ====================

// Get all admin users
router.get("/all", adminController.getAllAdmins);

// Get admin by ID
router.get("/one/:id", adminController.getAdminById);

// Create new admin (Super Admin only)
router.post(
  "/create",
  restrictTo(UserRole.SUPER_ADMIN),
  uploadService.uploadSingleImage("avatar", "users"),
  uploadService.resizeAndProcessImages,
  adminController.createAdmin
);

// Update admin
router.patch(
  "/:id",
  uploadService.uploadSingleImage("avatar", "users"),
  uploadService.resizeAndProcessImages,
  adminController.updateAdmin
);

// Delete admin (Super Admin only)
router.delete("/:id", restrictTo(UserRole.SUPER_ADMIN), adminController.deleteAdmin);

// ==================== DASHBOARD ROUTES ====================

// Get dashboard overview with stats and KPIs
router.get("/dashboard/overview", adminController.getDashboardOverview);

// Get trending needs
router.get("/dashboard/trending-needs", adminController.getTrendingNeeds);

// Get active users statistics
router.get("/dashboard/active-users", adminController.getActiveUsersStats);

// Get donation progress
router.get("/dashboard/donation-progress", adminController.getDonationProgress);

// ==================== ANALYTICS ROUTES ====================

// Get content analytics (needs, stories, comments)
router.get("/analytics/content", adminController.getContentAnalytics);

// Get user analytics (growth, activity, engagement)
router.get("/analytics/users", adminController.getUserAnalytics);

// Get engagement analytics (views, reactions, follows, shares)
router.get("/analytics/engagement", adminController.getEngagementAnalytics);

// Get site views analytics
router.get("/analytics/views", adminController.getViewsAnalytics);

// ==================== MODERATION ROUTES ====================

// Needs moderation
router.get("/moderation/needs", adminController.getModerationNeeds);
router.put("/moderation/needs/bulk-status", adminController.bulkUpdateNeedsStatus);

// Comments moderation
router.get("/moderation/comments", adminController.getModerationComments);
// NOTE: Disabled - NeedComment model does not have isApproved field
// router.put("/moderation/comments/bulk-approval", adminController.bulkUpdateCommentsApproval);

// Donations moderation
router.get("/moderation/donations", adminController.getModerationDonations);
router.put("/moderation/donations/:donationId/status", adminController.updateDonationStatus);

// ==================== ACTIVITY FEED ROUTES ====================

// Get activity feed with all recent activities
router.get("/activity-feed", adminController.getActivityFeed);

export default router;
