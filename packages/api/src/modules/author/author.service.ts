import { IAuthor, IResponsiveImage } from "common-types";
import { createPersianSlug } from "../../core/utils/slug.utils";
import fs from "fs";
import path from "path";
import { AuthorModel } from "./author.model";
import ApiFeatures from "../../core/utils/apiFeatures";

class AuthorService {
  public async create(data: Omit<IAuthor, "_id" | "slug">): Promise<IAuthor> {
    const slug = createPersianSlug(data.name);
    return AuthorModel.create({ ...data, slug });
  }

  public async findAll(queryString: Record<string, any>): Promise<{
    authors: IAuthor[];
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
    const total = await AuthorModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(total / limit);

    // Build and execute query with pagination
    const features = new ApiFeatures(AuthorModel.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const authors = await features.query;

    return {
      authors,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  public async findById(id: string): Promise<IAuthor | null> {
    return AuthorModel.findById(id);
  }

  public async findOne(identifier: string): Promise<IAuthor | null> {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };
    return AuthorModel.findOne(query);
  }

  public async update(identifier: string, data: Partial<IAuthor>): Promise<IAuthor | null> {
    if (data.name && !data.slug) {
      data.slug = createPersianSlug(data.name);
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    if (data.avatar) {
      const currentAuthor = await AuthorModel.findOne(query);
      if (currentAuthor?.avatar) {
        this.deleteAvatarFiles(currentAuthor.avatar);
      }
    }

    return AuthorModel.findOneAndUpdate(query, data, { new: true, runValidators: true });
  }

  public async delete(identifier: string): Promise<IAuthor | null> {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const authorToDelete = await AuthorModel.findOne(query);
    if (authorToDelete?.avatar) {
      this.deleteAvatarFiles(authorToDelete.avatar);
    }
    return AuthorModel.findOneAndDelete(query);
  }

  private deleteAvatarFiles(avatar: IResponsiveImage) {
    if (!avatar) return;
    try {
      const publicFolderPath = path.join(__dirname, "../../../public");

      const desktopPath = path.join(publicFolderPath, avatar.desktop);
      const mobilePath = path.join(publicFolderPath, avatar.mobile);

      if (fs.existsSync(desktopPath)) fs.unlinkSync(desktopPath);
      if (fs.existsSync(mobilePath)) fs.unlinkSync(mobilePath);
    } catch (error) {
      console.error(`Error deleting avatar files for desktop URL ${avatar.desktop}:`, error);
    }
  }
}

export const authorService = new AuthorService();
