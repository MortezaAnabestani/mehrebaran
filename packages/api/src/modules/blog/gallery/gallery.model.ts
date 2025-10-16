import { Schema, model, Types } from "mongoose";
import { IGallery } from "common-types";
import { createPersianSlug } from "../../../core/utils/slug.utils";
import { responsiveImageSchema, seoSchema } from "../../../core/schemas/shared.schemas";

const gallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    slug: { type: String, unique: true, index: true },
    seo: { type: seoSchema, required: true },
    description: { type: String, required: true },
    images: { type: [responsiveImageSchema], required: true },
    photographer: { type: Types.ObjectId, ref: "Author" },
    category: { type: Types.ObjectId, ref: "Category" }, // 👈 الزامی نیست
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    views: { type: Number, default: 0 },
    relatedGalleries: [{ type: Types.ObjectId, ref: "Gallery" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

gallerySchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  match: { postType: "Gallery" },
});

gallerySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = createPersianSlug(this.title);
  }
  next();
});

export const GalleryModel = model<IGallery>("Gallery", gallerySchema);
