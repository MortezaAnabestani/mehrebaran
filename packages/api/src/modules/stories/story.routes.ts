import { Router } from "express";
import { storyController } from "./story.controller";
import { protect } from "../auth/auth.middleware";

const router = Router();

// All routes require authentication
router.use(protect);

// ==================== STORIES ====================

/**
 * POST /api/v1/stories
 * ایجاد استوری جدید
 */
router.post("/", storyController.createStory);

/**
 * GET /api/v1/stories/feed
 * دریافت فید استوری‌ها
 */
router.get("/feed", storyController.getStoryFeed);

/**
 * GET /api/v1/stories/stats
 * آمار استوری‌های کاربر
 */
router.get("/stats", storyController.getStats);

/**
 * GET /api/v1/stories/user/:userId
 * دریافت استوری‌های کاربر
 */
router.get("/user/:userId", storyController.getUserStories);

/**
 * GET /api/v1/stories/:id
 * دریافت استوری بر اساس ID
 */
router.get("/:id", storyController.getStoryById);

/**
 * POST /api/v1/stories/:id/view
 * مشاهده استوری
 */
router.post("/:id/view", storyController.viewStory);

/**
 * POST /api/v1/stories/:id/react
 * افزودن ری‌اکشن به استوری
 */
router.post("/:id/react", storyController.addReaction);

/**
 * DELETE /api/v1/stories/:id/react
 * حذف ری‌اکشن از استوری
 */
router.delete("/:id/react", storyController.removeReaction);

/**
 * DELETE /api/v1/stories/:id
 * حذف استوری
 */
router.delete("/:id", storyController.deleteStory);

/**
 * GET /api/v1/stories/:id/viewers
 * دریافت لیست بیننده‌های استوری
 */
router.get("/:id/viewers", storyController.getViewers);

// ==================== HIGHLIGHTS ====================

/**
 * POST /api/v1/stories/highlights
 * ایجاد هایلایت
 */
router.post("/highlights", storyController.createHighlight);

/**
 * GET /api/v1/stories/highlights/user/:userId
 * دریافت هایلایت‌های کاربر
 */
router.get("/highlights/user/:userId", storyController.getUserHighlights);

/**
 * POST /api/v1/stories/highlights/:id/add-story
 * افزودن استوری به هایلایت
 */
router.post("/highlights/:id/add-story", storyController.addStoryToHighlight);

/**
 * DELETE /api/v1/stories/highlights/:id/remove-story/:storyId
 * حذف استوری از هایلایت
 */
router.delete("/highlights/:id/remove-story/:storyId", storyController.removeStoryFromHighlight);

/**
 * PUT /api/v1/stories/highlights/:id
 * به‌روزرسانی هایلایت
 */
router.put("/highlights/:id", storyController.updateHighlight);

/**
 * DELETE /api/v1/stories/highlights/:id
 * حذف هایلایت
 */
router.delete("/highlights/:id", storyController.deleteHighlight);

export default router;
