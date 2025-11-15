import { INews, IResponsiveImage } from "common-types";
import { Types } from "mongoose";
import ApiFeatures from "../../core/utils/apiFeatures";
import fs from "fs";
import path from "path";
import { createNewsSchema, updateNewsSchema } from "./news.validation";
import { z } from "zod";
import { NewsModel } from "./news.model";

type CreateNewsData = z.infer<typeof createNewsSchema>["body"];
type UpdateNewsData = z.infer<typeof updateNewsSchema>["body"];

class NewsService {
  public async create(data: CreateNewsData): Promise<INews> {
    const news = await NewsModel.create(data);
    return this.populateNews(news);
  }

  public async findAll(queryString: Record<string, any>): Promise<{
    news: INews[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    // Get pagination params
    const page = parseInt(queryString.page) || 1;
    const limit = parseInt(queryString.limit) || 10;

    // Build filter query
    const queryObj = { ...queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const filterQuery = JSON.parse(queryStr);

    // Get total count for pagination
    const total = await NewsModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(total / limit);

    // Build and execute query with pagination
    const features = new ApiFeatures(NewsModel.find(), queryString).filter().sort().limitFields().paginate();

    features.query = features.query.populate([
      { path: "category", select: "name slug" },
      { path: "author", select: "name avatar" },
      { path: "tags", select: "name slug" },
    ]);

    const news = await features.query;

    return {
      news,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  public async findOne(identifier: string): Promise<INews | null> {
    const isObjectId = Types.ObjectId.isValid(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const news = await NewsModel.findOne(query);
    if (!news) return null;

    return this.populateNews(news);
  }

  public async update(id: string, data: UpdateNewsData): Promise<INews | null> {
    if (data.featuredImage || data.gallery) {
      const currentNews = await NewsModel.findById(id).select("featuredImage gallery");
      if (currentNews) {
        if (data.featuredImage && currentNews.featuredImage.desktop !== data.featuredImage.desktop) {
          this.deleteImageFiles(currentNews.featuredImage);
        }
        if (data.gallery) {
          const newImageUrls = new Set(data.gallery.map((img) => img.desktop));
          currentNews.gallery?.forEach((oldImage) => {
            if (!newImageUrls.has(oldImage.desktop)) {
              this.deleteImageFiles(oldImage);
            }
          });
        }
      }
    }
    const updatedNews = await NewsModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedNews) return null;
    return this.populateNews(updatedNews);
  }

  public async delete(id: string): Promise<void> {
    const newsToDelete = await NewsModel.findById(id);
    if (newsToDelete) {
      this.deleteImageFiles(newsToDelete.featuredImage);
      newsToDelete.gallery?.forEach((image) => this.deleteImageFiles(image));
      await NewsModel.findByIdAndDelete(id);
    }
  }

  private populateNews(newsDoc: any): Promise<INews> {
    return newsDoc.populate([
      { path: "category", select: "name slug" },
      { path: "tags", select: "name slug" },
      { path: "author", select: "name avatar slug" },
      { path: "relatedNews", select: "title slug featuredImage" },
      { path: "comments" },
    ]);
  }

  private deleteImageFiles(image: IResponsiveImage) {
    if (!image) return;
    try {
      const publicFolderPath = path.join(__dirname, "../../../public");
      const desktopPath = path.join(publicFolderPath, image.desktop);
      const mobilePath = path.join(publicFolderPath, image.mobile);
      if (fs.existsSync(desktopPath)) fs.unlinkSync(desktopPath);
      if (fs.existsSync(mobilePath)) fs.unlinkSync(mobilePath);
    } catch (error) {
      console.error(`Error deleting image files for ${image.desktop}:`, error);
    }
  }

  public async incrementViews(id: string): Promise<void> {
    await NewsModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }
}

export const newsService = new NewsService();
