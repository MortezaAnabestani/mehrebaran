import { Schema, model, Types } from "mongoose";
import { ISupporterSubmission, SubmissionStatus } from "common-types";
import { responsiveImageSchema } from "../../../core/schemas/shared.schemas";

const supporterSubmissionSchema = new Schema<ISupporterSubmission>(
  {
    submitter: { type: Types.ObjectId, ref: "User", required: true },
    need: { type: Types.ObjectId, ref: "Need", required: true },
    image: { type: responsiveImageSchema, required: true },
    caption: { type: String },
    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: "pending",
    },
  },
  { timestamps: true }
);

export const SupporterSubmissionModel = model<ISupporterSubmission>(
  "SupporterSubmission",
  supporterSubmissionSchema
);
