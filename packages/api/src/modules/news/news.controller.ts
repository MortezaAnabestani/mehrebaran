import { Request, Response } from "express";
import { newsService } from "./news.service";
import { createNewsSchema, updateNewsSchema } from "./news.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class NewsController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createNewsSchema.parse({ body: req.body });
    const newsData: any = { ...validatedData.body };

    // Add processed featuredImage if uploaded
    if (req.processedFiles) {
      newsData.featuredImage = req.processedFiles;
    }

    const news = await newsService.create(newsData);
    res.status(201).json({ message: "خبر با موفقیت ایجاد شد.", data: news });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await newsService.findAll(req.query);
    res.status(200).json({
      results: result.news.length,
      data: result.news,
      pagination: result.pagination,
    });
  });

  public getOne = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const newsItem = await newsService.findOne(id);
    if (!newsItem) {
      throw new ApiError(404, "خبر مورد نظر یافت نشد.");
    }
    res.status(200).json({ data: newsItem });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateNewsSchema.parse({ body: req.body, params: req.params });
    const { id } = validatedData.params;
    const updateData: any = { ...validatedData.body };

    // Add processed featuredImage if uploaded
    if (req.processedFiles) {
      updateData.featuredImage = req.processedFiles;
    }

    const newsItem = await newsService.update(id, updateData);
    if (!newsItem) {
      throw new ApiError(404, "خبر مورد نظر یافت نشد.");
    }
    res.status(200).json({ message: "خبر با موفقیت به‌روزرسانی شد.", data: newsItem });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const newsItem = await newsService.findOne(id);
    if (!newsItem) {
      throw new ApiError(404, "خبر مورد نظر یافت نشد.");
    }
    await newsService.delete(id);
    res.status(200).json({ message: "خبر با موفقیت حذف شد." });
  });

  public incrementView = asyncHandler(async (req: Request, res: Response) => {
    await newsService.incrementViews(req.params.id);
    res.status(200).json({ message: "View count incremented." });
  });
}

export const newsController = new NewsController();
