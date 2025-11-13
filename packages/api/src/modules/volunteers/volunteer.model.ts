import { Schema, model, Types } from "mongoose";
import { IVolunteerRegistration } from "common-types";

const availabilitySchema = new Schema(
  {
    days: [
      {
        type: String,
        enum: ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"],
      },
    ],
    timeSlots: [{ type: String, enum: ["morning", "afternoon", "evening"] }],
  },
  { _id: false }
);

const emergencyContactSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true },
  },
  { _id: false }
);

const volunteerRegistrationSchema = new Schema<IVolunteerRegistration>(
  {
    project: { type: Types.ObjectId, ref: "Project", required: true, index: true },
    volunteer: { type: Types.ObjectId, ref: "User", required: true, index: true },

    // Volunteer Information
    skills: [{ type: String, required: true }],
    availableHours: { type: Number, required: true, min: 1, max: 168 }, // Max hours in a week
    preferredRole: { type: String },
    experience: { type: String, maxlength: 1000 },
    motivation: { type: String, maxlength: 1000 },
    availability: { type: availabilitySchema, required: true },

    // Status & Review
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "completed", "withdrawn", "suspended"],
      default: "pending",
      index: true,
    },
    reviewedBy: { type: Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reviewNotes: { type: String, maxlength: 500 },
    rejectionReason: { type: String, maxlength: 500 },

    // Activity Tracking
    hoursContributed: { type: Number, default: 0, min: 0 },
    tasksCompleted: { type: Number, default: 0, min: 0 },
    lastActivity: { type: Date },
    contributionScore: { type: Number, default: 0, min: 0 }, // For gamification

    // Certificate
    certificateUrl: { type: String },
    certificateGenerated: { type: Boolean, default: false },
    certificateGeneratedAt: { type: Date },

    // Additional
    emergencyContact: { type: emergencyContactSchema },

    // Timestamps
    approvedAt: { type: Date },
    completedAt: { type: Date },
    withdrawnAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
volunteerRegistrationSchema.index({ project: 1, status: 1 });
volunteerRegistrationSchema.index({ volunteer: 1, status: 1 });
volunteerRegistrationSchema.index({ createdAt: -1 });

// Prevent duplicate registrations
volunteerRegistrationSchema.index({ project: 1, volunteer: 1 }, { unique: true });

// Virtual for completion percentage
volunteerRegistrationSchema.virtual("completionPercentage").get(function () {
  if (this.availableHours === 0) return 0;
  return Math.min(100, Math.round((this.hoursContributed / this.availableHours) * 100));
});

// Pre-save hook for status changes
volunteerRegistrationSchema.pre("save", async function (next) {
  // Update project counts when status changes
  if (this.isModified("status")) {
    const Project = model("Project");

    if (this.status === "approved" && this.get("_original_status") === "pending") {
      // Approved: decrease pending, increase volunteer count
      await Project.findByIdAndUpdate(this.project, {
        $inc: {
          pendingVolunteers: -1,
          volunteerCount: 1,
        },
      });
      this.approvedAt = new Date();
    } else if (this.status === "rejected" && this.get("_original_status") === "pending") {
      // Rejected: decrease pending
      await Project.findByIdAndUpdate(this.project, {
        $inc: { pendingVolunteers: -1 },
      });
    } else if (this.status === "completed") {
      this.completedAt = new Date();
    } else if (this.status === "withdrawn") {
      this.withdrawnAt = new Date();
      // Decrease volunteer count
      await Project.findByIdAndUpdate(this.project, {
        $inc: { volunteerCount: -1 },
      });
    }
  }

  next();
});

// Store original status before modification
volunteerRegistrationSchema.pre("save", function (next) {
  if (this.isModified("status") && !this.isNew) {
    this.set("_original_status", this.get("status", null, { getters: false }));
  }
  next();
});

// Post-save: Update project pending volunteers count for new registrations
volunteerRegistrationSchema.post("save", async function (doc) {
  if (doc.isNew && doc.status === "pending") {
    const Project = model("Project");
    await Project.findByIdAndUpdate(doc.project, {
      $inc: { pendingVolunteers: 1 },
    });
  }
});

// Static methods
volunteerRegistrationSchema.statics.getByProject = function (projectId: string, status?: string) {
  const query: any = { project: projectId };
  if (status) query.status = status;
  return this.find(query)
    .populate("volunteer", "name email avatar")
    .sort({ createdAt: -1 });
};

volunteerRegistrationSchema.statics.getByUser = function (userId: string) {
  return this.find({ volunteer: userId })
    .populate("project", "title slug featuredImage")
    .sort({ createdAt: -1 });
};

export const VolunteerRegistrationModel = model<IVolunteerRegistration>(
  "VolunteerRegistration",
  volunteerRegistrationSchema
);
