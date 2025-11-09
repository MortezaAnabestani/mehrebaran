import { Router } from "express";
import { storyController } from "./story.controller";
import { protect } from "../auth/auth.middleware";
import { validate } from "../../core/middlewares/validate";
import {
  createStorySchema,
  viewStorySchema,
  addReactionSchema,
  storyIdParamSchema,
  userIdParamSchema,
  createHighlightSchema,
  addStoryToHighlightSchema,
  removeStoryFromHighlightSchema,
  updateHighlightSchema,
  highlightIdParamSchema,
} from "./story.validation";

const router = Router();

// All routes require authentication
router.use(protect);

// ==================== STORIES ====================

/**
 * POST /api/v1/stories
 * ایجاد استوری جدید
 */
router.post("/", validate(createStorySchema), storyController.createStory);

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
 * GET /api/v1/stories/my
 * دریافت استوری‌های کاربر فعلی
 */
router.get("/my", storyController.getMyStories);

/**
 * GET /api/v1/stories/user/:userId
 * دریافت استوری‌های کاربر
 */
router.get("/user/:userId", validate(userIdParamSchema), storyController.getUserStories);

/**
 * GET /api/v1/stories/:id
 * دریافت استوری بر اساس ID
 */
router.get("/:id", validate(storyIdParamSchema), storyController.getStoryById);

/**
 * POST /api/v1/stories/:id/view
 * مشاهده استوری
 */
router.post("/:id/view", validate(viewStorySchema), storyController.viewStory);

/**
 * POST /api/v1/stories/:id/react
 * افزودن ری‌اکشن به استوری
 */
router.post("/:id/react", validate(addReactionSchema), storyController.addReaction);

/**
 * DELETE /api/v1/stories/:id/react
 * حذف ری‌اکشن از استوری
 */
router.delete("/:id/react", validate(storyIdParamSchema), storyController.removeReaction);

/**
 * DELETE /api/v1/stories/:id
 * حذف استوری
 */
router.delete("/:id", validate(storyIdParamSchema), storyController.deleteStory);

/**
 * GET /api/v1/stories/:id/viewers
 * دریافت لیست بیننده‌های استوری
 */
router.get("/:id/viewers", validate(storyIdParamSchema), storyController.getViewers);

// ==================== HIGHLIGHTS ====================

/**
 * POST /api/v1/stories/highlights
 * ایجاد هایلایت
 */
router.post("/highlights", validate(createHighlightSchema), storyController.createHighlight);

/**
 * GET /api/v1/stories/highlights/user/:userId
 * دریافت هایلایت‌های کاربر
 */
router.get("/highlights/user/:userId", validate(userIdParamSchema), storyController.getUserHighlights);

/**
 * POST /api/v1/stories/highlights/:id/add-story
 * افزودن استوری به هایلایت
 */
router.post("/highlights/:id/add-story", validate(addStoryToHighlightSchema), storyController.addStoryToHighlight);

/**
 * DELETE /api/v1/stories/highlights/:id/remove-story/:storyId
 * حذف استوری از هایلایت
 */
router.delete("/highlights/:id/remove-story/:storyId", validate(removeStoryFromHighlightSchema), storyController.removeStoryFromHighlight);

/**
 * PUT /api/v1/stories/highlights/:id
 * به‌روزرسانی هایلایت
 */
router.put("/highlights/:id", validate(updateHighlightSchema), storyController.updateHighlight);

/**
 * DELETE /api/v1/stories/highlights/:id
 * حذف هایلایت
 */
router.delete("/highlights/:id", validate(highlightIdParamSchema), storyController.deleteHighlight);

export default router;
