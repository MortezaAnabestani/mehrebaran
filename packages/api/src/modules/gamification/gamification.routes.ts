import { Router } from "express";
import { gamificationController } from "./gamification.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

// ==================== POINTS ROUTES ====================

// Public leaderboard
router.get("/leaderboard", gamificationController.getLeaderboard);
router.get("/leaderboard/enhanced", gamificationController.getLeaderboardWithStats);

// User points (protected)
router.get("/points/my-summary", protect, gamificationController.getPointSummary);
router.get("/points/my-transactions", protect, gamificationController.getPointTransactions);
router.get("/points/my-breakdown", protect, gamificationController.getPointsBreakdown);
router.post("/points/daily-bonus", protect, gamificationController.claimDailyBonus);

// Admin points operations
router.post(
  "/points/award",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  gamificationController.awardPoints
);
router.post(
  "/points/deduct",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  gamificationController.deductPoints
);

// ==================== BADGES ROUTES ====================

// Public badges
router.get("/badges", gamificationController.getAllBadges);
router.get("/badges/:badgeId", gamificationController.getBadgeById);

// User badges (protected)
router.get("/badges/my-badges", protect, gamificationController.getUserBadges);
router.get("/badges/:badgeId/progress", protect, gamificationController.getBadgeProgress);
router.post("/badges/check", protect, gamificationController.checkBadges);

// Get specific user's badges (public)
router.get("/users/:userId/badges", gamificationController.getUserBadges);

// Admin badge operations
router.post(
  "/badges",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  gamificationController.createBadge
);
router.patch(
  "/badges/:badgeId",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  gamificationController.updateBadge
);
router.delete(
  "/badges/:badgeId",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  gamificationController.deleteBadge
);

// ==================== USER STATS & PROFILE ROUTES ====================

// User stats
router.get("/stats/me", protect, gamificationController.getUserStats);
router.get("/stats/:userId", gamificationController.getUserStats);
router.get("/activity/me", protect, gamificationController.getUserActivity);

export default router;
