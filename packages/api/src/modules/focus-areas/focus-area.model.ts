import { Schema, model } from "mongoose";
import { IFocusArea } from "common-types";
import { createPersianSlug } from "../../core/utils/slug.utils";

const focusAreaSchema = new Schema<IFocusArea>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    gradient: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

focusAreaSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = createPersianSlug(this.title);
  }
  next();
});

// Index for ordering
focusAreaSchema.index({ order: 1, isActive: 1 });

export const FocusAreaModel = model<IFocusArea>("FocusArea", focusAreaSchema);
