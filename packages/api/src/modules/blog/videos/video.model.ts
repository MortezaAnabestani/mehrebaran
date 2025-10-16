import { Schema, model, Types } from "mongoose";
import { IVideo } from "common-types";
import { createPersianSlug } from "../../../core/utils/slug.utils";
import { responsiveImageSchema, seoSchema } from "../../../core/schemas/shared.schemas";

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    slug: { type: String, unique: true, index: true },
    seo: { type: seoSchema, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    coverImage: { type: responsiveImageSchema, required: true },
    cameraman: { type: Types.ObjectId, ref: "Author" },
    category: { type: Types.ObjectId, ref: "Category" },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    views: { type: Number, default: 0 },
    relatedVideos: [{ type: Types.ObjectId, ref: "Video" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

videoSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  match: { postType: "Video" },
});

videoSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = createPersianSlug(this.title);
  }
  next();
});

export const VideoModel = model<IVideo>("Video", videoSchema);
