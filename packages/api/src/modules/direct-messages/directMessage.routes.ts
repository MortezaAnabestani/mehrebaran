import { Router } from "express";
import { directMessageController } from "./directMessage.controller";
import { protect } from "../auth/auth.middleware";
import { isSupporter } from "../needs/need.middleware";

const router = Router({ mergeParams: true });

// All routes require authentication and supporter status

// Conversation routes
router.post("/conversations", protect, isSupporter, directMessageController.createConversation);
router.get("/conversations", protect, isSupporter, directMessageController.getUserConversations);
router.get("/conversations/unread-count", protect, isSupporter, directMessageController.getUnreadCount);
router.post("/conversations/:conversationId/archive", protect, directMessageController.archiveConversation);

// Message routes
router.get("/conversations/:conversationId/messages", protect, directMessageController.getMessages);
router.post("/conversations/:conversationId/messages", protect, directMessageController.sendMessage);
router.post("/conversations/:conversationId/read", protect, directMessageController.markAsRead);
router.patch("/messages/:messageId", protect, directMessageController.editMessage);
router.delete("/messages/:messageId", protect, directMessageController.deleteMessage);

export default router;
