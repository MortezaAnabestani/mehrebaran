import { Schema, model, Types } from "mongoose";
import { IPointTransaction } from "common-types";

const pointTransactionSchema = new Schema<IPointTransaction>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, index: true },
    action: {
      type: String,
      enum: [
        "need_created",
        "need_upvote",
        "need_support",
        "supporter_contribution",
        "task_completed",
        "task_assigned",
        "milestone_completed",
        "verification_approved",
        "comment_posted",
        "message_sent",
        "team_created",
        "team_joined",
        "need_completed",
        "daily_login",
        "profile_completed",
        "first_contribution",
        "invite_accepted",
        "badge_earned",
        "level_up",
        "admin_bonus",
        "penalty",
      ],
      required: true,
    },
    points: { type: Number, required: true },
    description: { type: String },
    relatedModel: { type: String },
    relatedId: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes for efficient querying
pointTransactionSchema.index({ user: 1, createdAt: -1 });
pointTransactionSchema.index({ action: 1 });
pointTransactionSchema.index({ relatedModel: 1, relatedId: 1 });

export const PointTransactionModel = model<IPointTransaction>("PointTransaction", pointTransactionSchema);
