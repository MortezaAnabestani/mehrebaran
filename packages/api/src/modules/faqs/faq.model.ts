import { Schema, model } from "mongoose";
import { IFaq } from "common-types";

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FaqModel = model<IFaq>("Faq", faqSchema);
