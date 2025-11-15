import { Request, Response } from "express";
import { galleryService } from "./gallery.service";
import { createGallerySchema, updateGallerySchema } from "./gallery.validation";
import asyncHandler from "../../../core/utils/asyncHandler";
import ApiError from "../../../core/utils/apiError";

class GalleryController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createGallerySchema.parse({ body: req.body });
    const galleryData: any = { ...validatedData.body };

    // Add processed images if uploaded
    if (req.processedFiles) {
      if (Array.isArray(req.processedFiles)) {
        galleryData.images = req.processedFiles;
      } else {
        galleryData.images = [req.processedFiles];
      }
    }

    const gallery = await galleryService.create(galleryData);
    res.status(201).json({ message: "گالری با موفقیت ایجاد شد.", data: gallery });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await galleryService.findAll(req.query);
    res.status(200).json(result);
  });

  public getOne = asyncHandler(async (req: Request, res: Response) => {
    const gallery = await galleryService.findOne(req.params.identifier);
    if (!gallery) throw new ApiError(404, "گالری مورد نظر یافت نشد.");
    res.status(200).json({ data: gallery });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateGallerySchema.parse({ body: req.body, params: req.params });
    const { id } = validatedData.params;
    const updateData: any = { ...validatedData.body };

    // Add processed images if uploaded
    if (req.processedFiles) {
      if (Array.isArray(req.processedFiles)) {
        updateData.images = req.processedFiles;
      } else {
        updateData.images = [req.processedFiles];
      }
    }

    const gallery = await galleryService.update(id, updateData);
    if (!gallery) throw new ApiError(404, "گالری مورد نظر یافت نشد.");
    res.status(200).json({ message: "گالری با موفقیت به‌روزرسانی شد.", data: gallery });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const gallery = await galleryService.findOne(id);
    if (!gallery) throw new ApiError(404, "گالری مورد نظر یافت نشد.");
    await galleryService.delete(id);
    res.status(200).json({ message: "گالری با موفقیت حذف شد." });
  });

  public incrementView = asyncHandler(async (req: Request, res: Response) => {
    await galleryService.incrementViews(req.params.id);
    res.status(200).json({ message: "View count incremented." });
  });
}

export const galleryController = new GalleryController();
