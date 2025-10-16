import { Request, Response } from "express";
import { settingService } from "./setting.service";
import { updateSettingSchema, valueSchemas } from "./setting.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class SettingController {
  public getByKey = asyncHandler(async (req: Request, res: Response) => {
    const { key } = req.params;
    const setting = await settingService.findByKey(key);
    if (!setting) {
      throw new ApiError(404, `تنظیمی با کلید '${key}' یافت نشد.`);
    }
    res.status(200).json({ data: setting.value });
  });

  public updateByKey = asyncHandler(async (req: Request, res: Response) => {
    const { key } = updateSettingSchema.parse({ params: req.params, body: req.body }).params;
    const { value } = req.body;

    const valueSchema = valueSchemas[key as keyof typeof valueSchemas];
    if (!valueSchema) {
      throw new ApiError(400, `کلید تنظیم '${key}' نامعتبر است.`);
    }
    const validatedValue = valueSchema.parse(value);

    const updatedSetting = await settingService.updateByKey(key, validatedValue);
    res.status(200).json({ message: "تنظیمات با موفقیت به‌روزرسانی شد.", data: updatedSetting });
  });
}

export const settingController = new SettingController();
