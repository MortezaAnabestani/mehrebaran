import { Schema, model, Types } from "mongoose";
import { IProject } from "common-types";
import { createPersianSlug } from "../../core/utils/slug.utils";
import { responsiveImageSchema, seoSchema } from "../../core/schemas/shared.schemas";

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    excerpt: { type: String },
    featuredImage: { type: responsiveImageSchema, required: true },
    gallery: [responsiveImageSchema],
    seo: { type: seoSchema, required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    status: { type: String, enum: ["draft", "active", "completed"], default: "draft" },
    targetAmount: { type: Number, required: true, default: 0 },
    amountRaised: { type: Number, default: 0 },
    targetVolunteer: { type: Number, required: true, default: 0 },
    collectedVolunteer: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    views: { type: Number, default: 0 },
    isFeaturedInCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = createPersianSlug(this.title);
  }
  next();
});

export const ProjectModel = model<IProject>("Project", projectSchema);
