import { Request, Response } from "express";
import { videoService } from "./video.service";
import { createVideoSchema, updateVideoSchema } from "./video.validation";
import asyncHandler from "../../../core/utils/asyncHandler";
import ApiError from "../../../core/utils/apiError";

class VideoController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createVideoSchema.parse({ body: req.body });
    const videoData: any = { ...validatedData.body };

    // Add processed coverImage if uploaded
    if (req.processedFiles) {
      videoData.coverImage = req.processedFiles;
    }

    const video = await videoService.create(videoData);
    res.status(201).json({ message: "ویدئو با موفقیت ایجاد شد.", data: video });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await videoService.findAll(req.query);
    res.status(200).json(result);
  });

  public getOne = asyncHandler(async (req: Request, res: Response) => {
    const video = await videoService.findOne(req.params.identifier);
    if (!video) throw new ApiError(404, "ویدئو مورد نظر یافت نشد.");
    res.status(200).json({ data: video });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateVideoSchema.parse({ body: req.body, params: req.params });
    const { id } = validatedData.params;
    const updateData: any = { ...validatedData.body };

    // Add processed coverImage if uploaded
    if (req.processedFiles) {
      updateData.coverImage = req.processedFiles;
    }

    const video = await videoService.update(id, updateData);
    if (!video) throw new ApiError(404, "ویدئو مورد نظر یافت نشد.");
    res.status(200).json({ message: "ویدئو با موفقیت به‌روزرسانی شد.", data: video });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const video = await videoService.findOne(id);
    if (!video) throw new ApiError(404, "ویدئو مورد نظر یافت نشد.");
    await videoService.delete(id);
    res.status(200).json({ message: "ویدئو با موفقیت حذف شد." });
  });

  public incrementView = asyncHandler(async (req: Request, res: Response) => {
    await videoService.incrementViews(req.params.id);
    res.status(200).json({ message: "View count incremented." });
  });
}

export const videoController = new VideoController();
