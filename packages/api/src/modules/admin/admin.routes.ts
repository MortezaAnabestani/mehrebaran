import { Router } from "express";
import { adminController } from "./admin.controller";
import { protect } from "../auth/auth.middleware";
import { restrictTo } from "../auth/auth.middleware";
import { UserRole } from "../users/user.model";

const router = Router();

// Protect all admin routes - only ADMIN and SUPER_ADMIN can access
router.use(protect);
router.use(restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

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

// ==================== MODERATION ROUTES ====================

// Needs moderation
router.get("/moderation/needs", adminController.getModerationNeeds);
router.put("/moderation/needs/bulk-status", adminController.bulkUpdateNeedsStatus);

// Comments moderation
router.get("/moderation/comments", adminController.getModerationComments);
router.put("/moderation/comments/bulk-approval", adminController.bulkUpdateCommentsApproval);

// Donations moderation
router.get("/moderation/donations", adminController.getModerationDonations);
router.put("/moderation/donations/:donationId/status", adminController.updateDonationStatus);

export default router;
