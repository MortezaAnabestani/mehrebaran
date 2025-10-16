import { Schema, model } from "mongoose";
import { INeedCategory } from "common-types";
import { createPersianSlug } from "../../core/utils/slug.utils";

const needCategorySchema = new Schema<INeedCategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String },
  },
  { timestamps: true }
);

needCategorySchema.pre("save", function (next) {
  if (this.isNew || this.isModified("name")) {
    this.slug = createPersianSlug(this.name);
  }
  next();
});

export const NeedCategoryModel = model<INeedCategory>("NeedCategory", needCategorySchema);
