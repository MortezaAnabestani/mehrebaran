import { Schema, model, Types } from "mongoose";
import { INews } from "common-types";
import { createPersianSlug } from "../../core/utils/slug.utils";
import { responsiveImageSchema } from "../../core/schemas/shared.schemas";

const newsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    seo: {
      metaTitle: { type: String, required: true },
      metaDescription: { type: String },
    },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    featuredImage: { type: responsiveImageSchema, required: true },
    gallery: [responsiveImageSchema],

    author: { type: Types.ObjectId, ref: "Author", required: true },

    category: { type: Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    views: { type: Number, default: 0 },
    relatedNews: [{ type: Types.ObjectId, ref: "News" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

newsSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

newsSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = createPersianSlug(this.title);
  }
  next();
});

export const NewsModel = model<INews>("News", newsSchema);
