import { Schema, model, Types } from "mongoose";
import { IFeaturedItem } from "common-types";

const featuredItemSchema = new Schema<IFeaturedItem>(
  {
    order: { type: Number, required: true },
    item: { type: Types.ObjectId, required: true, refPath: "itemType" },
    itemType: {
      type: String,
      required: true,
      enum: ["Article", "Video", "Gallery"],
    },
  },
  { timestamps: true }
);

featuredItemSchema.index({ order: 1 }, { unique: true });

export const FeaturedItemModel = model<IFeaturedItem>("FeaturedItem", featuredItemSchema);
