// packages/api/src/modules/categories/category.controller.ts
import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { createCategorySchema, updateCategorySchema } from "./category.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class CategoryController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createCategorySchema.parse({ body: req.body });
    const category = await categoryService.create(validatedData.body);
    res.status(201).json({ message: "دسته‌بندی با موفقیت ایجاد شد.", data: category });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const categories = await categoryService.findAll();
    res.status(200).json({ data: categories });
  });

  public getById = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.findById(req.params.id);
    if (!category) {
      throw new ApiError(404, "دسته‌بندی یافت نشد.");
    }
    res.status(200).json({ data: category });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateCategorySchema.parse({ body: req.body, params: req.params });
    const category = await categoryService.update(validatedData.params.id, validatedData.body);
    if (!category) {
      throw new ApiError(404, "دسته‌بندی یافت نشد.");
    }
    res.status(200).json({ message: "دسته‌بندی با موفقیت به‌روزرسانی شد.", data: category });
  });

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const category = await categoryService.findById(id);
    if (!category) {
      res.status(404).json({ message: "دسته‌بندی یافت نشد." });
      return;
    }
    await categoryService.delete(id);
    res.status(200).json({ message: "دسته‌بندی با موفقیت حذف شد." });
  }
}

export const categoryController = new CategoryController();
