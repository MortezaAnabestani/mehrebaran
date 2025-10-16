import { ICategory } from "common-types";
import { CategoryModel } from "./category.model";

class CategoryService {
  public async create(data: Partial<ICategory>): Promise<ICategory> {
    const category = await CategoryModel.create(data);
    return category;
  }

  public async findAll(): Promise<ICategory[]> {
    return CategoryModel.find().sort({ createdAt: -1 });
  }

  public async findById(id: string): Promise<ICategory | null> {
    return CategoryModel.findById(id);
  }

  public async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return CategoryModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  public async delete(id: string): Promise<void> {
    await CategoryModel.findByIdAndDelete(id);
  }
}

export const categoryService = new CategoryService();
