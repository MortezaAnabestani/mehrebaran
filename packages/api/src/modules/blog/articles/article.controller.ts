import { Request, Response } from "express";
import { articleService } from "./article.service";
import { createArticleSchema, updateArticleSchema } from "./article.validation";
import asyncHandler from "../../../core/utils/asyncHandler";
import ApiError from "../../../core/utils/apiError";

class ArticleController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createArticleSchema.parse({ body: req.body });
    const articleData: any = { ...validatedData.body };

    // Build SEO object from flat fields if provided
    if (articleData.metaTitle || articleData.metaDescription) {
      articleData.seo = {
        metaTitle: articleData.metaTitle || articleData.title,
        metaDescription: articleData.metaDescription || '',
      };
      delete articleData.metaTitle;
      delete articleData.metaDescription;
    }

    // Process uploaded images
    if (req.processedFiles && Array.isArray(req.processedFiles) && req.processedFiles.length > 0) {
      // First image becomes coverImage
      articleData.featuredImage = req.processedFiles[0];

      // Rest become gallery images
      if (req.processedFiles.length > 1) {
        articleData.gallery = req.processedFiles.slice(1);
      }
    }

    const article = await articleService.create(articleData);
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
    try {
      const validatedData = updateArticleSchema.parse({ body: req.body, params: req.params });
      const { id } = validatedData.params;
      const updateData: any = { ...validatedData.body };

      // Build SEO object from flat fields if provided
      if (updateData.metaTitle || updateData.metaDescription) {
        updateData.seo = {
          metaTitle: updateData.metaTitle || updateData.title,
          metaDescription: updateData.metaDescription || '',
        };
        delete updateData.metaTitle;
        delete updateData.metaDescription;
      }

      // Handle existing images from request body
      let existingImages: any[] = [];
      if (req.body.existingImages) {
        existingImages = Array.isArray(req.body.existingImages)
          ? req.body.existingImages
          : [req.body.existingImages];

        // Parse JSON strings if needed
        existingImages = existingImages.map((img: any) => {
          if (typeof img === 'string') {
            try {
              return JSON.parse(img);
            } catch {
              return img;
            }
          }
          return img;
        });
      }

      // Process newly uploaded images
      const newImages = (req.processedFiles && Array.isArray(req.processedFiles))
        ? req.processedFiles
        : [];

      // Combine existing and new images
      const allImages = [...existingImages, ...newImages];

      if (allImages.length > 0) {
        // First image becomes coverImage
        updateData.featuredImage = allImages[0];

        // Rest become gallery images
        if (allImages.length > 1) {
          updateData.gallery = allImages.slice(1);
        } else {
          updateData.gallery = [];
        }
      }

      const article = await articleService.update(id, updateData);
      if (!article) {
        throw new ApiError(404, "مقاله مورد نظر یافت نشد.");
      }
      res.status(200).json({ message: "مقاله با موفقیت به‌روزرسانی شد.", data: article });
    } catch (error: any) {
      console.error('❌ Validation error in article update:', error);
      if (error.errors) {
        console.error('📋 Zod errors:', JSON.stringify(error.errors, null, 2));
      }
      throw error;
    }
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
