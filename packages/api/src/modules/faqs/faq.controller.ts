import { Request, Response } from "express";
import { faqService } from "./faq.service";
import { createFaqSchema, updateFaqSchema } from "./faq.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class FaqController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createFaqSchema.parse({ body: req.body });
    const faq = await faqService.create(validatedData.body);
    res.status(201).json({ message: "سوال متداول با موفقیت ایجاد شد.", data: faq });
  });

  public getAllForAdmin = asyncHandler(async (req: Request, res: Response) => {
    const faqs = await faqService.findAll();
    res.status(200).json({ data: faqs });
  });

  public getAllForClient = asyncHandler(async (req: Request, res: Response) => {
    const faqs = await faqService.findAllActive();
    res.status(200).json({ data: faqs });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateFaqSchema.parse({ body: req.body, params: req.params });
    const faq = await faqService.update(validatedData.params.id, validatedData.body);
    if (!faq) {
      throw new ApiError(404, "سوال یافت نشد.");
    }
    res.status(200).json({ message: "سوال با موفقیت به‌روزرسانی شد.", data: faq });
  });

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const faq = await faqService.findById(id);
    if (!faq) {
      res.status(404).json({ message: "سوال یافت نشد." });
      return;
    }
    await faqService.delete(id);
    res.status(200).json({ message: "سوال با موفقیت حذف شد." });
  }
}

export const faqController = new FaqController();
