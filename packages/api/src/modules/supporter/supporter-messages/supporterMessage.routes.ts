import { Router } from "express";
import { supporterMessageController } from "./supporterMessage.controller";
import { protect } from "../../auth/auth.middleware";
import { isSupporter } from "../../needs/need.middleware";

const router = Router({ mergeParams: true });

router.get("/", supporterMessageController.getAllForNeed);

router.post("/", protect, isSupporter, supporterMessageController.create);
router.post("/:messageId/like", protect, isSupporter, supporterMessageController.toggleLike);

export default router;
