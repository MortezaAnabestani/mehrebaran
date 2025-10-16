import { INeedCategory } from "common-types";
import { NeedCategoryModel } from "./needCategory.model";
import { createPersianSlug } from "../../core/utils/slug.utils";
import ApiError from "../../core/utils/apiError";

class NeedCategoryService {
  public async create(data: { name: string; description?: string }): Promise<INeedCategory> {
    const existing = await NeedCategoryModel.findOne({ name: data.name });
    if (existing) {
      throw new ApiError(409, "حوزه‌ای با این نام از قبل وجود دارد.");
    }
    return NeedCategoryModel.create(data);
  }

  public async findAll(): Promise<INeedCategory[]> {
    return NeedCategoryModel.find().sort({ createdAt: 1 });
  }

  public async findById(id: string): Promise<INeedCategory | null> {
    return NeedCategoryModel.findById(id);
  }

  public async update(id: string, data: Partial<INeedCategory>): Promise<INeedCategory | null> {
    if (data.name && !data.slug) {
      data.slug = createPersianSlug(data.name);
    }
    return NeedCategoryModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  public async delete(id: string): Promise<INeedCategory | null> {
    // TODO: در آینده باید چک کنیم که آیا نیازی به این حوزه متصل است یا نه
    // و در آن صورت، از حذف جلوگیری کنیم.
    return NeedCategoryModel.findByIdAndDelete(id);
  }
}

export const needCategoryService = new NeedCategoryService();
