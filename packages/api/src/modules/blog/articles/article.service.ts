import { IArticle, IResponsiveImage } from "common-types";
import { ArticleModel } from "./article.model";
import { Types } from "mongoose";
import ApiFeatures from "../../../core/utils/apiFeatures";
import fs from "fs";
import path from "path";
import { createArticleSchema } from "./article.validation";
import { z } from "zod";

type CreateArticleData = z.infer<typeof createArticleSchema>["body"];
type UpdateArticleData = Partial<CreateArticleData>;

class ArticleService {
  public async create(data: CreateArticleData): Promise<IArticle> {
    const article = await ArticleModel.create(data);
    return this.populateArticle(article);
  }

  public async findAll(queryString: Record<string, any>): Promise<IArticle[]> {
    const features = new ApiFeatures(ArticleModel.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    features.query = features.query.populate([
      { path: "category", select: "name slug" },
      { path: "author", select: "name slug avatar" },
    ]);

    return features.query;
  }

  public async findOne(identifier: string): Promise<IArticle | null> {
    const isObjectId = Types.ObjectId.isValid(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const article = await ArticleModel.findOne(query);
    if (!article) return null;

    return this.populateArticle(article);
  }

  public async update(id: string, data: UpdateArticleData): Promise<IArticle | null> {
    const currentArticle = await ArticleModel.findById(id).select("featuredImage gallery");
    if (currentArticle) {
      if (data.featuredImage && currentArticle.featuredImage.desktop !== data.featuredImage.desktop) {
        this.deleteImageFiles(currentArticle.featuredImage);
      }
      if (data.gallery) {
        const newImageUrls = new Set(data.gallery.map((img) => img.desktop));
        currentArticle.gallery?.forEach((oldImage) => {
          if (!newImageUrls.has(oldImage.desktop)) {
            this.deleteImageFiles(oldImage);
          }
        });
      }
    }

    const updatedArticle = await ArticleModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedArticle) return null;
    return this.populateArticle(updatedArticle);
  }

  public async delete(id: string): Promise<void> {
    const articleToDelete = await ArticleModel.findById(id);
    if (articleToDelete) {
      this.deleteImageFiles(articleToDelete.featuredImage);
      articleToDelete.gallery?.forEach((image) => this.deleteImageFiles(image));
      await ArticleModel.findByIdAndDelete(id);
    }
  }

  private deleteImageFiles(image: IResponsiveImage) {
    if (!image) return;
    try {
      const publicFolderPath = path.join(__dirname, "../../../../public");
      const desktopPath = path.join(publicFolderPath, image.desktop);
      const mobilePath = path.join(publicFolderPath, image.mobile);
      if (fs.existsSync(desktopPath)) fs.unlinkSync(desktopPath);
      if (fs.existsSync(mobilePath)) fs.unlinkSync(mobilePath);
    } catch (error) {
      console.error(`Error deleting image files for ${image.desktop}:`, error);
    }
  }

  private populateArticle(doc: any): Promise<IArticle> {
    return doc.populate([
      { path: "category", select: "name slug" },
      { path: "tags", select: "name slug" },
      { path: "author", select: "name slug avatar" },
      { path: "relatedArticles", select: "title slug featuredImage" },
      { path: "comments" },
    ]);
  }

  public async incrementViews(id: string): Promise<void> {
    await ArticleModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }
}

export const articleService = new ArticleService();
