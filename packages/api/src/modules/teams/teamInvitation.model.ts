import { Schema, model, Types } from "mongoose";
import { ITeamInvitation } from "common-types";

const teamInvitationSchema = new Schema<ITeamInvitation>(
  {
    team: { type: Types.ObjectId, ref: "Team", required: true },
    invitedUser: { type: Types.ObjectId, ref: "User", required: true },
    invitedBy: { type: Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "expired"],
      default: "pending",
    },
    message: { type: String, trim: true },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes for efficient querying
teamInvitationSchema.index({ team: 1, invitedUser: 1 });
teamInvitationSchema.index({ invitedUser: 1, status: 1 });
teamInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Auto-expire invitations
teamInvitationSchema.pre("save", function (next) {
  if (this.status === "pending" && this.expiresAt < new Date()) {
    this.status = "expired";
  }
  next();
});

export const TeamInvitationModel = model<ITeamInvitation>("TeamInvitation", teamInvitationSchema);
