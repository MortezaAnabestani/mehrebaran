import { IAuthor, IResponsiveImage } from "common-types";
import { createPersianSlug } from "../../core/utils/slug.utils";
import fs from "fs";
import path from "path";
import { AuthorModel } from "./author.model";

class AuthorService {
  public async create(data: Omit<IAuthor, "_id" | "slug">): Promise<IAuthor> {
    const slug = createPersianSlug(data.name);
    return AuthorModel.create({ ...data, slug });
  }

  public async findAll(): Promise<IAuthor[]> {
    return AuthorModel.find().sort({ name: 1 });
  }

  public async findById(id: string): Promise<IAuthor | null> {
    return AuthorModel.findById(id);
  }

  public async update(id: string, data: Partial<IAuthor>): Promise<IAuthor | null> {
    if (data.name && !data.slug) {
      data.slug = createPersianSlug(data.name);
    }

    if (data.avatar) {
      const currentAuthor = await this.findById(id);
      if (currentAuthor?.avatar) {
        this.deleteAvatarFiles(currentAuthor.avatar);
      }
    }

    return AuthorModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  public async delete(id: string): Promise<IAuthor | null> {
    const authorToDelete = await this.findById(id);
    if (authorToDelete?.avatar) {
      this.deleteAvatarFiles(authorToDelete.avatar);
    }
    return AuthorModel.findByIdAndDelete(id);
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
