import { IGallery, IResponsiveImage } from "common-types";
import { GalleryModel } from "./gallery.model";
import { Types } from "mongoose";
import ApiFeatures from "../../../core/utils/apiFeatures";
import { createGallerySchema } from "./gallery.validation";
import { z } from "zod";
import fs from "fs";
import path from "path";

type CreateGalleryData = z.infer<typeof createGallerySchema>["body"];
type UpdateGalleryData = Partial<CreateGalleryData>;

class GalleryService {
  public async create(data: CreateGalleryData): Promise<IGallery> {
    const gallery = await GalleryModel.create(data);
    return this.populateGallery(gallery);
  }

  public async findAll(queryString: Record<string, any>): Promise<{
    galleries: IGallery[];
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
    const total = await GalleryModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(total / limit);

    // Build and execute query with pagination
    const features = new ApiFeatures(GalleryModel.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    features.query = features.query.populate([
      { path: "category", select: "name slug" },
      { path: "photographer", select: "name slug avatar" },
      { path: "tags", select: "name slug" },
    ]);

    const galleries = await features.query;

    return {
      galleries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  public async findOne(identifier: string): Promise<IGallery | null> {
    const isObjectId = Types.ObjectId.isValid(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };
    const gallery = await GalleryModel.findOne(query);
    if (!gallery) return null;
    return this.populateGallery(gallery);
  }

  public async update(id: string, data: UpdateGalleryData): Promise<IGallery | null> {
    if (data.images) {
      const currentGallery = await GalleryModel.findById(id).select("images");
      if (currentGallery) {
        const newImageUrls = new Set(data.images.map((img) => img.desktop));
        currentGallery.images.forEach((oldImage) => {
          if (!newImageUrls.has(oldImage.desktop)) {
            this.deleteImageFiles(oldImage);
          }
        });
      }
    }
    const updatedGallery = await GalleryModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedGallery) return null;
    return this.populateGallery(updatedGallery);
  }

  public async delete(id: string): Promise<void> {
    const galleryToDelete = await GalleryModel.findById(id);
    if (galleryToDelete) {
      galleryToDelete.images.forEach((image) => this.deleteImageFiles(image));
    }
    await GalleryModel.findByIdAndDelete(id);
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

  private populateGallery(doc: any): Promise<IGallery> {
    return doc.populate([
      { path: "category", select: "name slug" },
      { path: "tags", select: "name slug" },
      { path: "photographer", select: "name slug avatar" },
      { path: "relatedGalleries", select: "title slug images" },
      { path: "comments" },
    ]);
  }
  public async incrementViews(id: string): Promise<void> {
    await GalleryModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }
}

export const galleryService = new GalleryService();
