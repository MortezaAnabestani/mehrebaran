import { Schema, model } from "mongoose";
import { ITag } from "common-types";
import { createPersianSlug } from "../../core/utils/slug.utils";

const tagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

tagSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = createPersianSlug(this.name);
  }
  next();
});

export const TagModel = model<ITag>("Tag", tagSchema);
