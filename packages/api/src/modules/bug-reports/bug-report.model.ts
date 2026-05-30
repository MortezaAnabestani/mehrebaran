import { Schema, model, Model } from "mongoose";
import { IBugReport, BugReportType, BugReportPriority, BugReportStatus } from "common-types";

type BugReportModelType = Model<IBugReport>;

const bugReportSchema = new Schema<IBugReport, BugReportModelType>(
  {
    type: {
      type: String,
      enum: Object.values(BugReportType),
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(BugReportPriority),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BugReportStatus),
      default: BugReportStatus.OPEN,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stepsToReproduce: String,
    expectedBehavior: String,
    actualBehavior: String,
    screenshots: [String],
    systemInfo: {
      userAgent: String,
      platform: String,
      language: String,
      screenResolution: String,
      viewport: String,
      url: String,
    },
    consoleLogs: [
      {
        type: {
          type: String,
        },
        message: String,
        time: String,
      },
    ],
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const BugReportModel = model<IBugReport, BugReportModelType>("BugReport", bugReportSchema);
