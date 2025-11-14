import { IFocusArea } from "common-types";
import { Types } from "mongoose";
import ApiFeatures from "../../core/utils/apiFeatures";
import { createFocusAreaSchema, updateFocusAreaSchema } from "./focus-area.validation";
import { z } from "zod";
import { FocusAreaModel } from "./focus-area.model";

type CreateFocusAreaData = z.infer<typeof createFocusAreaSchema>["body"];
type UpdateFocusAreaData = z.infer<typeof updateFocusAreaSchema>["body"];

class FocusAreaService {
  public async create(data: CreateFocusAreaData): Promise<IFocusArea> {
    const focusArea = await FocusAreaModel.create(data);
    return focusArea;
  }

  public async findAll(queryString: Record<string, any>): Promise<IFocusArea[]> {
    const features = new ApiFeatures(FocusAreaModel.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return features.query;
  }

  public async findOne(identifier: string): Promise<IFocusArea | null> {
    const isObjectId = Types.ObjectId.isValid(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const focusArea = await FocusAreaModel.findOne(query);
    return focusArea;
  }

  public async update(id: string, data: UpdateFocusAreaData): Promise<IFocusArea | null> {
    const updatedFocusArea = await FocusAreaModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return updatedFocusArea;
  }

  public async delete(id: string): Promise<void> {
    await FocusAreaModel.findByIdAndDelete(id);
  }

  public async reorder(orders: Array<{ id: string; order: number }>): Promise<void> {
    const bulkOps = orders.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } },
      },
    }));

    await FocusAreaModel.bulkWrite(bulkOps);
  }

  public async toggleActive(id: string): Promise<IFocusArea | null> {
    const focusArea = await FocusAreaModel.findById(id);
    if (!focusArea) return null;

    focusArea.isActive = !focusArea.isActive;
    await focusArea.save();
    return focusArea;
  }
}

export const focusAreaService = new FocusAreaService();
