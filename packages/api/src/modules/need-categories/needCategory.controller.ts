import { Request, Response } from "express";
import { needCategoryService } from "./needCategory.service";
import { createNeedCategorySchema, updateNeedCategorySchema } from "./needCategory.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class NeedCategoryController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createNeedCategorySchema.parse({ body: req.body });
    const category = await needCategoryService.create(validatedData.body);
    res.status(201).json({ message: "حوزه نیاز با موفقیت ایجاد شد.", data: category });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const categories = await needCategoryService.findAll();
    res.status(200).json({ data: categories });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateNeedCategorySchema.parse({ body: req.body, params: req.params });
    const category = await needCategoryService.update(validatedData.params.id, validatedData.body);
    if (!category) {
      throw new ApiError(404, "حوزه نیاز یافت نشد.");
    }
    res.status(200).json({ message: "حوزه نیاز با موفقیت به‌روزرسانی شد.", data: category });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const deletedCategory = await needCategoryService.delete(req.params.id);
    if (!deletedCategory) {
      throw new ApiError(404, "حوزه نیاز یافت نشد.");
    }
    res.status(200).json({ message: "حوزه نیاز با موفقیت حذف شد." });
  });
}

export const needCategoryController = new NeedCategoryController();
