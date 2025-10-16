import { IFeaturedItem } from "common-types";
import { FeaturedItemModel } from "./featuredItem.model";

import { updateFeaturedItemsSchema } from "./featured.validation";
import { z } from "zod";
type FeaturedItemData = z.infer<typeof updateFeaturedItemsSchema>["body"]["items"][number];

class FeaturedItemService {
  public async findAll(): Promise<IFeaturedItem[]> {
    return FeaturedItemModel.find().sort({ order: 1 }).populate({
      path: "item",
      select: "title slug featuredImage coverImage images excerpt",
    });
  }

  public async updateAll(items: FeaturedItemData[]): Promise<IFeaturedItem[]> {
    await FeaturedItemModel.deleteMany({});
    const newItems = await FeaturedItemModel.insertMany(items);
    const populatedItems = await FeaturedItemModel.find({
      _id: { $in: newItems.map((item) => item._id) },
    })
      .sort({ order: 1 })
      .populate("item");

    return populatedItems;
  }
}

export const featuredItemService = new FeaturedItemService();
