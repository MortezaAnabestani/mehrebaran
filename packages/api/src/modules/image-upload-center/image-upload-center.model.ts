import { Schema, model, Model } from "mongoose";
import { IImageUploadCenter } from "common-types";

type ImageUploadCenterModelType = Model<IImageUploadCenter>;

const imageUploadCenterSchema = new Schema<IImageUploadCenter, ImageUploadCenterModelType>(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const ImageUploadCenterModel = model<IImageUploadCenter, ImageUploadCenterModelType>(
  "ImageUploadCenter",
  imageUploadCenterSchema,
);
