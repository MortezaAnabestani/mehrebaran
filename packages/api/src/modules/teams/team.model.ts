import { Schema, model, Types } from "mongoose";
import { ITeam } from "common-types";

const teamMemberSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["leader", "co_leader", "member"],
      default: "member",
    },
    joinedAt: { type: Date, default: Date.now },
    invitedBy: { type: Types.ObjectId, ref: "User" },
    tasksCompleted: { type: Number, default: 0 },
    contributionScore: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    leftAt: { type: Date },
    leaveReason: { type: String },
  },
  { _id: false, timestamps: false }
);

const teamSchema = new Schema<ITeam>(
  {
    need: { type: Types.ObjectId, ref: "Need", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    focusArea: {
      type: String,
      enum: [
        "fundraising",
        "logistics",
        "communication",
        "technical",
        "volunteer",
        "coordination",
        "documentation",
        "general",
      ],
      default: "general",
    },
    members: [teamMemberSchema],
    status: {
      type: String,
      enum: ["active", "paused", "completed", "disbanded"],
      default: "active",
    },
    maxMembers: { type: Number, min: 2 },
    tags: [{ type: String, trim: true }],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for efficient querying
teamSchema.index({ need: 1, status: 1 });
teamSchema.index({ need: 1, focusArea: 1 });
teamSchema.index({ "members.user": 1 });

// Virtual: Total members count
teamSchema.virtual("totalMembers").get(function () {
  if (!this.members) return 0;
  return this.members.length;
});

// Virtual: Active members count
teamSchema.virtual("activeMembers").get(function () {
  if (!this.members) return 0;
  return this.members.filter((m: any) => m.isActive).length;
});

// Virtual: Tasks assigned to team (will be calculated from Task model)
teamSchema.virtual("tasksAssignedToTeam").get(function () {
  return 0; // This will be populated dynamically in the service
});

// Virtual: Tasks completed by team
teamSchema.virtual("tasksCompletedByTeam").get(function () {
  if (!this.members) return 0;
  return this.members.reduce((sum: number, m: any) => sum + (m.tasksCompleted || 0), 0);
});

// Virtual: Team progress percentage
teamSchema.virtual("teamProgress").get(function () {
  const tasksAssigned = (this as any).tasksAssignedToTeam || 0;
  const tasksCompleted = (this as any).tasksCompletedByTeam || 0;
  if (tasksAssigned === 0) return 0;
  return Math.round((tasksCompleted / tasksAssigned) * 100);
});

// Ensure virtuals are included in JSON
teamSchema.set("toJSON", { virtuals: true });
teamSchema.set("toObject", { virtuals: true });

// Ensure at least one leader exists
teamSchema.pre("save", function (next) {
  if (this.members && this.members.length > 0) {
    const hasLeader = this.members.some((m: any) => m.role === "leader" && m.isActive);
    if (!hasLeader) {
      // Auto-promote first member to leader if no leader exists
      const firstActiveMember = this.members.find((m: any) => m.isActive);
      if (firstActiveMember) {
        (firstActiveMember as any).role = "leader";
      }
    }
  }
  next();
});

export const TeamModel = model<ITeam>("Team", teamSchema);
