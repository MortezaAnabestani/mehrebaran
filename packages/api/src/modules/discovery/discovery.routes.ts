import { Router } from "express";
import { discoveryController } from "./discovery.controller";
import { protect, protectOptional } from "../auth/auth.middleware";

const router = Router();

// ============= Leaderboard Routes =============

/**
 * GET /api/v1/discovery/leaderboard
 * دریافت لیدربورد (عمومی)
 */
router.get(
  "/leaderboard",
  
  discoveryController.getLeaderboard
);

/**
 * GET /api/v1/discovery/leaderboard/me
 * دریافت رتبه کاربر فعلی (نیاز به احراز هویت)
 */
router.get(
  "/leaderboard/me",
  protect,
  
  discoveryController.getMyRank
);

/**
 * GET /api/v1/discovery/leaderboard/user/:userId
 * دریافت رتبه یک کاربر خاص (عمومی)
 */
router.get(
  "/leaderboard/user/:userId",
  
  discoveryController.getUserRank
);

/**
 * GET /api/v1/discovery/leaderboard/nearby
 * دریافت کاربران اطراف در رتبه‌بندی (نیاز به احراز هویت)
 */
router.get(
  "/leaderboard/nearby",
  protect,
  
  discoveryController.getNearbyUsers
);

/**
 * GET /api/v1/discovery/leaderboard/top
 * دریافت top کاربران (عمومی)
 */
router.get(
  "/leaderboard/top",
  
  discoveryController.getTopUsers
);

/**
 * GET /api/v1/discovery/leaderboard/multiple
 * دریافت لیدربورد چند دسته‌بندی (عمومی)
 */
router.get(
  "/leaderboard/multiple",
  
  discoveryController.getMultipleCategoryLeaderboards
);

// ============= Trending Routes =============

/**
 * GET /api/v1/discovery/trending/needs
 * دریافت نیازهای ترندینگ (عمومی)
 */
router.get(
  "/trending/needs",
  
  discoveryController.getTrendingNeeds
);

/**
 * GET /api/v1/discovery/trending/users
 * دریافت کاربران ترندینگ (عمومی)
 */
router.get(
  "/trending/users",
  
  discoveryController.getTrendingUsers
);

/**
 * GET /api/v1/discovery/trending/tags
 * دریافت تگ‌های ترندینگ (عمومی)
 */
router.get(
  "/trending/tags",
  
  discoveryController.getTrendingTags
);

/**
 * GET /api/v1/discovery/trending/all
 * دریافت همه موارد ترندینگ (عمومی)
 */
router.get(
  "/trending/all",
  
  discoveryController.getAllTrending
);

// ============= Recommendations Routes =============

/**
 * GET /api/v1/discovery/recommendations/needs
 * توصیه نیازها (نیاز به احراز هویت)
 */
router.get(
  "/recommendations/needs",
  protect,
  
  discoveryController.recommendNeeds
);

/**
 * GET /api/v1/discovery/recommendations/users
 * توصیه کاربران (نیاز به احراز هویت)
 */
router.get(
  "/recommendations/users",
  protect,
  
  discoveryController.recommendUsers
);

/**
 * GET /api/v1/discovery/recommendations/teams
 * توصیه تیم‌ها (نیاز به احراز هویت)
 */
router.get(
  "/recommendations/teams",
  protect,
  
  discoveryController.recommendTeams
);

/**
 * GET /api/v1/discovery/recommendations/personalized
 * دریافت توصیه‌های شخصی‌سازی شده (نیاز به احراز هویت)
 */
router.get(
  "/recommendations/personalized",
  protect,
  discoveryController.getPersonalizedRecommendations
);

/**
 * GET /api/v1/discovery/recommendations/preferences
 * دریافت ترجیحات کاربر (نیاز به احراز هویت)
 */
router.get(
  "/recommendations/preferences",
  protect,
  discoveryController.getUserPreferences
);

// ============= Combined/Discovery Routes =============

/**
 * GET /api/v1/discovery/feed
 * دریافت فید شخصی‌سازی شده (اختیاری احراز هویت)
 */
router.get(
  "/feed",
  protectOptional,
  discoveryController.getPersonalizedFeed
);

/**
 * GET /api/v1/discovery/stats
 * دریافت آمار کلی discovery (اختیاری احراز هویت)
 */
router.get(
  "/stats",
  protectOptional,
  discoveryController.getDiscoveryStats
);

export default router;
