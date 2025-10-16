import { ITag } from "common-types";
import { TagModel } from "./tag.model";
import { createPersianSlug } from "../../core/utils/slug.utils";

class TagService {
  public async create(data: { name: string }): Promise<ITag> {
    const existingTag = await TagModel.findOne({ name: data.name });
    if (existingTag) {
      throw { status: 409, message: "تگی با این نام از قبل وجود دارد." };
    }
    return TagModel.create(data);
  }

  public async findAll(): Promise<ITag[]> {
    return TagModel.find().sort({ name: 1 });
  }

  public async update(id: string, data: { name?: string; slug?: string }): Promise<ITag | null> {
    if (data.name && !data.slug) {
      data.slug = createPersianSlug(data.name);
    }
    return TagModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async delete(id: string): Promise<ITag | null> {
    return TagModel.findByIdAndDelete(id);
  }
}

export const tagService = new TagService();
