import { Schema, model, Types } from "mongoose";
import { IProject } from "common-types";
import { createPersianSlug } from "../../core/utils/slug.utils";
import { responsiveImageSchema, seoSchema } from "../../core/schemas/shared.schemas";

const bankInfoSchema = new Schema(
  {
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    cardNumber: { type: String, required: true },
    iban: { type: String, required: true },
    accountHolderName: { type: String, required: true },
  },
  { _id: false }
);

const donationSettingsSchema = new Schema(
  {
    enabled: { type: Boolean, default: true },
    minimumAmount: { type: Number, default: 10000 }, // 10,000 تومان
    allowAnonymous: { type: Boolean, default: true },
    showDonors: { type: Boolean, default: true },
  },
  { _id: false }
);

const volunteerSettingsSchema = new Schema(
  {
    enabled: { type: Boolean, default: true },
    requiredSkills: [{ type: String }],
    maxVolunteers: { type: Number },
    autoApprove: { type: Boolean, default: false },
  },
  { _id: false }
);

const certificateSettingsSchema = new Schema(
  {
    donationTemplate: { type: String },
    volunteerTemplate: { type: String },
    customMessage: { type: String },
  },
  { _id: false }
);

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

    // Bank & Payment Information
    bankInfo: { type: bankInfoSchema },
    paymentGateway: { type: String, enum: ["zarinpal", "idpay", "zibal"] },
    merchantId: { type: String },

    // Donation Settings
    donationSettings: { type: donationSettingsSchema, default: () => ({}) },
    donorCount: { type: Number, default: 0 },

    // Volunteer Settings
    volunteerSettings: { type: volunteerSettingsSchema, default: () => ({}) },
    volunteerCount: { type: Number, default: 0 },
    pendingVolunteers: { type: Number, default: 0 },

    // Certificate Settings
    certificateSettings: { type: certificateSettingsSchema },
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
