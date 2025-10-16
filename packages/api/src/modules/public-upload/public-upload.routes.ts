import { Router } from "express";
import { publicUploadController } from "./public-upload.controller";
import { publicUploadService } from "./public-upload.service";

const router = Router();

router.post("/", publicUploadService.uploadAttachments(), publicUploadController.uploadAttachments);

export default router;
