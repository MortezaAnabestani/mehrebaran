import { Request, Response } from "express";
import { focusAreaService } from "./focus-area.service";
import {
  createFocusAreaSchema,
  updateFocusAreaSchema,
  getFocusAreaSchema,
  deleteFocusAreaSchema,
} from "./focus-area.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class FocusAreaController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createFocusAreaSchema.parse({ body: req.body });
    const focusArea = await focusAreaService.create(validatedData.body);
    res.status(201).json({ message: "حوزه فعالیت با موفقیت ایجاد شد.", data: focusArea });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const focusAreas = await focusAreaService.findAll(req.query);
    res.status(200).json({
      results: focusAreas.length,
      data: focusAreas,
    });
  });

  public getOne = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = getFocusAreaSchema.parse({ params: req.params });
    const { id } = validatedData.params;
    const focusArea = await focusAreaService.findOne(id);
    if (!focusArea) {
      throw new ApiError(404, "حوزه فعالیت مورد نظر یافت نشد.");
    }
    res.status(200).json({ data: focusArea });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateFocusAreaSchema.parse({ body: req.body, params: req.params });
    const { id } = validatedData.params;

    const focusArea = await focusAreaService.update(id, validatedData.body);
    if (!focusArea) {
      throw new ApiError(404, "حوزه فعالیت مورد نظر یافت نشد.");
    }
    res.status(200).json({ message: "حوزه فعالیت با موفقیت به‌روزرسانی شد.", data: focusArea });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = deleteFocusAreaSchema.parse({ params: req.params });
    const { id } = validatedData.params;
    const focusArea = await focusAreaService.findOne(id);
    if (!focusArea) {
      throw new ApiError(404, "حوزه فعالیت مورد نظر یافت نشد.");
    }
    await focusAreaService.delete(id);
    res.status(200).json({ message: "حوزه فعالیت با موفقیت حذف شد." });
  });

  public reorder = asyncHandler(async (req: Request, res: Response) => {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      throw new ApiError(400, "داده ورودی معتبر نیست.");
    }
    await focusAreaService.reorder(orders);
    res.status(200).json({ message: "ترتیب حوزه‌های فعالیت با موفقیت به‌روزرسانی شد." });
  });

  public toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const focusArea = await focusAreaService.toggleActive(id);
    if (!focusArea) {
      throw new ApiError(404, "حوزه فعالیت مورد نظر یافت نشد.");
    }
    res.status(200).json({
      message: `حوزه فعالیت با موفقیت ${focusArea.isActive ? "فعال" : "غیرفعال"} شد.`,
      data: focusArea,
    });
  });
}

export const focusAreaController = new FocusAreaController();
