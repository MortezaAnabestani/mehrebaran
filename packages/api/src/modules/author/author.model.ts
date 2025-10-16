import { Schema, model } from "mongoose";
import { IAuthor } from "common-types";
import { createPersianSlug } from "../../core/utils/slug.utils";
import { responsiveImageSchema } from "../../core/schemas/shared.schemas";

const authorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    metaTitle: { type: String, required: true },
    bio: { type: String },
    metaDescription: { type: String },
    avatar: { type: responsiveImageSchema },
  },
  { timestamps: true }
);

authorSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("name")) {
    this.slug = createPersianSlug(this.name);
  }
  next();
});

export const AuthorModel = model<IAuthor>("Author", authorSchema);
