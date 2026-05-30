import { Router } from "express";
import { socialController } from "./social.controller";
import { protect, protectOptional, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";

const router = Router();

// ==================== FOLLOW ROUTES ====================

// Follow/unfollow users
router.post("/follow/user/:userId", protect, socialController.followUser);
router.delete("/follow/user/:userId", protect, socialController.unfollowUser);

// Follow/unfollow needs
router.post("/follow/need/:needId", protect, socialController.followNeed);
router.delete("/follow/need/:needId", protect, socialController.unfollowNeed);

// Get followers/following
router.get("/users/:userId/followers", socialController.getUserFollowers);
router.get("/users/:userId/following", socialController.getUserFollowing);
router.get("/users/:userId/follow-stats", socialController.getUserFollowStats);
router.get("/my-followed-needs", protect, socialController.getUserFollowedNeeds);
router.get("/needs/:needId/followers", socialController.getNeedFollowers);

// Suggestions
router.get("/follow/suggestions", protect, socialController.getSuggestedUsers);

// ==================== MENTIONS ROUTES ====================

router.get("/mentions/me", protect, socialController.getUserMentions);
router.get("/mentions/unread-count", protect, socialController.getUnreadMentionCount);
router.post("/mentions/:mentionId/read", protect, socialController.markMentionAsRead);
router.post("/mentions/read-all", protect, socialController.markAllMentionsAsRead);

// ==================== TAGS ROUTES ====================

router.get("/tags/popular", socialController.getPopularTags);
router.get("/tags/trending", socialController.getTrendingTags);
router.get("/tags/search", socialController.searchTags);
router.get("/tags/:tag/needs", socialController.getNeedsByTag);

// ==================== SHARE ROUTES ====================

router.post("/share", protectOptional, socialController.logShare);
router.get("/share/top", socialController.getTopSharedItems);
router.get("/share/:itemId/stats", socialController.getItemShareStats);
router.get("/share/:needId/og-metadata", socialController.getOGMetadata);
router.get("/share/:needId/url", socialController.getShareUrl);

// ==================== ADMIN ROUTES ====================

// Follow statistics and management (admin only)
router.get(
  "/admin/follow/stats",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  socialController.getNetworkFollowStats,
);
router.get(
  "/admin/follows",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  socialController.getAllFollows,
);

// Mention statistics and management (admin only)
router.get(
  "/admin/mention/stats",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  socialController.getNetworkMentionStats,
);
router.get(
  "/admin/mentions",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  socialController.getAllMentions,
);

// Share statistics and management (admin only)
router.get(
  "/admin/share/stats",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  socialController.getNetworkShareStats,
);
router.get(
  "/admin/shares",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  socialController.getAllShares,
);

export default router;
