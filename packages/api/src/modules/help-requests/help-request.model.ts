import mongoose, { Schema } from "mongoose";

export interface IHelpRequest extends mongoose.Document {
  title: string;
  description: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  media: { desktop: string; mobile: string }[];
  status: "pending" | "approved" | "in_progress" | "completed" | "rejected";
  adminNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const helpRequestSchema = new Schema<IHelpRequest>(
  {
    title: {
      type: String,
      required: [true, "عنوان درخواست الزامی است"],
      trim: true,
      maxlength: [200, "عنوان نباید بیشتر از 200 کاراکتر باشد"],
    },
    description: {
      type: String,
      required: [true, "توضیحات الزامی است"],
      trim: true,
      maxlength: [2000, "توضیحات نباید بیشتر از 2000 کاراکتر باشد"],
    },
    guestName: {
      type: String,
      required: [true, "نام الزامی است"],
      trim: true,
    },
    guestEmail: {
      type: String,
      required: [true, "ایمیل الزامی است"],
      trim: true,
      lowercase: true,
    },
    guestPhone: {
      type: String,
      trim: true,
    },
    media: [
      {
        desktop: { type: String },
        mobile: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "in_progress", "completed", "rejected"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
helpRequestSchema.index({ status: 1, createdAt: -1 });
helpRequestSchema.index({ guestEmail: 1 });
helpRequestSchema.index({ createdAt: -1 });

export const HelpRequestModel = mongoose.model<IHelpRequest>("HelpRequest", helpRequestSchema);
