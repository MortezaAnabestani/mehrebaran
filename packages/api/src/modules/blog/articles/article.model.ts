import { Schema, model, Types } from "mongoose";
import { IArticle } from "common-types";
import { createPersianSlug } from "../../../core/utils/slug.utils";
import { responsiveImageSchema, seoSchema } from "../../../core/schemas/shared.schemas";

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    slug: { type: String, unique: true, index: true },
    seo: { type: seoSchema, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    featuredImage: { type: responsiveImageSchema, required: true },
    gallery: [responsiveImageSchema],
    category: { type: Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    author: { type: Types.ObjectId, ref: "Author", required: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    views: { type: Number, default: 0 },
    relatedArticles: [{ type: Types.ObjectId, ref: "Article" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

articleSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  match: { postType: "Article" },
});

articleSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = createPersianSlug(this.title);
  }
  next();
});

export const ArticleModel = model<IArticle>("Article", articleSchema);
