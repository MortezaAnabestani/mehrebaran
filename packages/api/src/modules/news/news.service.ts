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

  public async findAll(queryString: Record<string, any>): Promise<INews[]> {
    const features = new ApiFeatures(NewsModel.find(), queryString).filter().sort().limitFields().paginate();

    features.query = features.query.populate([
      { path: "category", select: "name slug" },
      { path: "author", select: "name avatar" },
      { path: "tags", select: "name slug" },
    ]);

    return features.query;
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
