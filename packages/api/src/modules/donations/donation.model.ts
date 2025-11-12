import { Schema, model, Types } from "mongoose";
import { IDonation } from "common-types";

const donorInfoSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    isAnonymous: { type: Boolean, default: false },
  },
  { _id: false }
);

const receiptInfoSchema = new Schema(
  {
    image: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    rejectionReason: { type: String },
  },
  { _id: false }
);

const donationSchema = new Schema<IDonation>(
  {
    project: { type: Types.ObjectId, ref: "Project", required: true, index: true },
    donor: { type: Types.ObjectId, ref: "User" }, // Optional - can be anonymous

    // Payment Information
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["IRT", "USD"], default: "IRT" },
    paymentMethod: {
      type: String,
      enum: ["online", "bank_transfer", "cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "verified", "rejected"],
      default: "pending",
      index: true,
    },

    // Online Payment Details
    paymentGateway: { type: String },
    transactionId: { type: String, index: true },
    authority: { type: String }, // Zarinpal Authority
    refId: { type: String }, // Reference ID from gateway
    trackingCode: { type: String, unique: true, sparse: true },

    // Donor Information
    donorInfo: { type: donorInfoSchema },

    // Receipt for Bank Transfer
    receipt: { type: receiptInfoSchema },

    // Additional
    message: { type: String, maxlength: 500 },
    dedicatedTo: { type: String, maxlength: 200 },

    // Certificate
    certificateUrl: { type: String },
    certificateGenerated: { type: Boolean, default: false },
    certificateGeneratedAt: { type: Date },

    // Admin Actions
    adminNotes: { type: String },
    verifiedBy: { type: Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },

    // Timestamps
    completedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
donationSchema.index({ project: 1, status: 1 });
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ trackingCode: 1 });

// Virtual for formatted amount
donationSchema.virtual("formattedAmount").get(function () {
  return this.amount.toLocaleString("fa-IR");
});

// Pre-save hook to generate tracking code
donationSchema.pre("save", async function (next) {
  if (this.isNew && !this.trackingCode) {
    // Generate unique tracking code: DON-YYYYMMDD-XXXXX
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(10000 + Math.random() * 90000);
    this.trackingCode = `DON-${date}-${random}`;
  }
  next();
});

// Static method to get donations by project
donationSchema.statics.getByProject = function (projectId: string, status?: string) {
  const query: any = { project: projectId };
  if (status) query.status = status;
  return this.find(query)
    .populate("donor", "name email avatar")
    .sort({ createdAt: -1 });
};

// Static method to get total raised amount for project
donationSchema.statics.getTotalRaised = async function (projectId: string) {
  const result = await this.aggregate([
    {
      $match: {
        project: new Types.ObjectId(projectId),
        status: { $in: ["completed", "verified"] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);
  return result[0] || { total: 0, count: 0 };
};

export const DonationModel = model<IDonation>("Donation", donationSchema);
