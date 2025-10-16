import { Schema, model, Types } from "mongoose";
import { INeed } from "common-types";
import { createPersianSlug } from "../../core/utils/slug.utils";

const geoLocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      index: "2dsphere",
    },
    address: { type: String },
  },
  { _id: false }
);

const attachmentSchema = new Schema(
  {
    fileType: {
      type: String,
      enum: ["image", "audio", "video"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const needUpdateSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const needSchema = new Schema<INeed>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: Types.ObjectId, ref: "NeedCategory", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "in_progress", "completed", "rejected"],
      default: "pending",
      index: true,
    },
    submittedBy: {
      user: { type: Types.ObjectId, ref: "User" },
      guestName: { type: String },
      guestEmail: { type: String },
    },
    attachments: [attachmentSchema],
    upvotes: [{ type: Types.ObjectId, ref: "User" }],
    supporters: [{ type: Types.ObjectId, ref: "User" }],
    location: { type: geoLocationSchema },
    updates: [needUpdateSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

needSchema.virtual("upvotesCount", {
  ref: "User",
  localField: "upvotes",
  foreignField: "_id",
  count: true,
});

needSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  match: { postType: "Need" },
});

needSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("title")) {
    this.slug = createPersianSlug(this.title);
  }
  next();
});

export const NeedModel = model<INeed>("Need", needSchema);
