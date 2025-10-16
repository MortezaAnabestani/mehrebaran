import { Request, Response } from "express";
import { tagService } from "./tag.service";
import { createTagSchema, updateTagSchema } from "./tag.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class TagController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createTagSchema.parse({ body: req.body });
    const tag = await tagService.create(validatedData.body);
    res.status(201).json({ message: "تگ با موفقیت ایجاد شد.", data: tag });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const tags = await tagService.findAll();
    res.status(200).json({ data: tags });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateTagSchema.parse({ body: req.body, params: req.params });
    const tag = await tagService.update(validatedData.params.id, validatedData.body);
    if (!tag) {
      throw new ApiError(404, "تگ یافت نشد.");
    }
    res.status(200).json({ message: "تگ با موفقیت به‌روزرسانی شد.", data: tag });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedTag = await tagService.delete(id);
    if (!deletedTag) {
      throw new ApiError(404, "تگ یافت نشد.");
    }
    res.status(200).json({ message: "تگ با موفقیت حذف شد." });
  });
}

export const tagController = new TagController();
