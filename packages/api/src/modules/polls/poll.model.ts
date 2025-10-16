import { Schema, model, Types } from "mongoose";
import { IPoll, IPollOption } from "common-types";

const pollOptionSchema = new Schema<IPollOption>({
  text: { type: String, required: true },
  votes: [{ type: Types.ObjectId, ref: "User" }],
});

pollOptionSchema.virtual("votesCount").get(function () {
  return this.votes ? this.votes.length : 0;
});

const pollSchema = new Schema<IPoll>(
  {
    question: { type: String, required: true },
    options: [pollOptionSchema],
    need: { type: Types.ObjectId, ref: "Need", required: true },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const PollModel = model<IPoll>("Poll", pollSchema);
