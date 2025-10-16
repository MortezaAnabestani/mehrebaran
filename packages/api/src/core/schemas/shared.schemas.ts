import { Schema } from "mongoose";

export const responsiveImageSchema = new Schema(
  {
    desktop: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  { _id: false }
);

export const seoSchema = new Schema(
  {
    metaTitle: { type: String, required: true },
    metaDescription: { type: String },
  },
  { _id: false }
);
