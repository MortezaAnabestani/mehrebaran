import { Request, Response } from "express";
import { featuredItemService } from "./featured.service";
import asyncHandler from "../../../core/utils/asyncHandler";
import { updateFeaturedItemsSchema } from "./featured.validation";

class FeaturedItemController {
  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const items = await featuredItemService.findAll();
    res.status(200).json({ data: items });
  });

  public updateAll = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateFeaturedItemsSchema.parse({ body: req.body });
    const items = await featuredItemService.updateAll(validatedData.body.items);
    res.status(200).json({ message: "چینش مطالب ویژه با موفقیت به‌روزرسانی شد.", data: items });
  });
}

export const featuredItemController = new FeaturedItemController();
