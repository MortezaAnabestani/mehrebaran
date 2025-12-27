import { Request, Response } from "express";
import { imageUploadCenterService } from "./image-upload-center.service";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class ImageUploadCenterController {
  public createImage = asyncHandler(async (req: Request, res: Response) => {
    const imageData = req.body;

    // اگر کاربر لاگین کرده باشد، ID او را ذخیره کن
    if (req.user) {
      imageData.uploadedBy = req.user._id;
    }

    // افزودن URL تصویر از فایل آپلود شده
    if (req.processedFiles && req.processedFiles.desktop) {
      imageData.imageUrl = req.processedFiles.desktop;
    }

    const image = await imageUploadCenterService.createImage(imageData);

    res.status(201).json(image);
  });

  public getAllImages = asyncHandler(async (req: Request, res: Response) => {
    const images = await imageUploadCenterService.findAllImages();
    res.status(200).json(images);
  });

  public getImageById = asyncHandler(async (req: Request, res: Response) => {
    const image = await imageUploadCenterService.findImageById(req.params.id);
    if (!image) {
      throw new ApiError(404, "تصویر یافت نشد.");
    }
    res.status(200).json({
      message: "تصویر با موفقیت دریافت شد.",
      data: image,
    });
  });

  public deleteImage = asyncHandler(async (req: Request, res: Response) => {
    const image = await imageUploadCenterService.deleteImage(req.params.id);
    if (!image) {
      throw new ApiError(404, "تصویر یافت نشد.");
    }
    res.status(200).json({
      message: "تصویر با موفقیت حذف شد.",
    });
  });
}

export const imageUploadCenterController = new ImageUploadCenterController();
