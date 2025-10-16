// packages/api/src/modules/public-upload/public-upload.controller.ts
import { Request, Response } from "express";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class PublicUploadController {
  public uploadAttachments = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new ApiError(400, "هیچ فایلی برای آپلود انتخاب نشده است.");
    }

    const attachments = files.map((file) => {
      let fileType: "image" | "audio" | "video";
      if (file.mimetype.startsWith("image")) fileType = "image";
      else if (file.mimetype.startsWith("audio")) fileType = "audio";
      else if (file.mimetype.startsWith("video")) fileType = "video";
      else fileType = "image";

      return {
        url: `/uploads/needs-attachments/${file.filename}`,
        fileType: fileType,
      };
    });

    res.status(201).json({
      message: `${attachments.length} فایل با موفقیت آپلود شد.`,
      data: {
        attachments,
      },
    });
  });
}

export const publicUploadController = new PublicUploadController();
