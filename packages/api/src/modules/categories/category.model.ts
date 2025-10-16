import { Schema, model } from "mongoose";
import { ICategory } from "common-types";

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const CategoryModel = model<ICategory>("Category", categorySchema);
