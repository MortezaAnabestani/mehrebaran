import { Request, Response } from "express";
import { articleService } from "./article.service";
import { createArticleSchema, updateArticleSchema } from "./article.validation";
import asyncHandler from "../../../core/utils/asyncHandler";
import ApiError from "../../../core/utils/apiError";

class ArticleController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createArticleSchema.parse({ body: req.body });
    const article = await articleService.create(validatedData.body);
    res.status(201).json({ message: "مقاله با موفقیت ایجاد شد.", data: article });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await articleService.findAll(req.query);
    res.status(200).json(result);
  });

  public getOne = asyncHandler(async (req: Request, res: Response) => {
    const article = await articleService.findOne(req.params.identifier);
    if (!article) {
      throw new ApiError(404, "مقاله مورد نظر یافت نشد.");
    }
    res.status(200).json({ data: article });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateArticleSchema.parse({ body: req.body, params: req.params });
    const article = await articleService.update(validatedData.params.id, validatedData.body);
    if (!article) {
      throw new ApiError(404, "مقاله مورد نظر یافت نشد.");
    }
    res.status(200).json({ message: "مقاله با موفقیت به‌روزرسانی شد.", data: article });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const article = await articleService.findOne(id);
    if (!article) {
      throw new ApiError(404, "مقاله مورد نظر یافت نشد.");
    }
    await articleService.delete(id);
    res.status(200).json({ message: "مقاله با موفقیت حذف شد." });
  });

  public incrementView = asyncHandler(async (req: Request, res: Response) => {
    await articleService.incrementViews(req.params.id);
    res.status(200).json({ message: "View count incremented." });
  });
}

export const articleController = new ArticleController();
