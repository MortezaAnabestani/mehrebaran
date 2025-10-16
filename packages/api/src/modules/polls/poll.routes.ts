import { Router } from "express";
import { pollController } from "./poll.controller";
import { protect, restrictTo } from "../auth/auth.middleware";
import { UserRole } from "common-types";
import { isSupporter } from "../needs/need.middleware";

const router = Router({ mergeParams: true });

router.get("/", pollController.getAllForNeed);

router.post("/", protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN), pollController.create);

router.post("/:pollId/options/:optionId/vote", protect, isSupporter, pollController.vote);

export default router;
