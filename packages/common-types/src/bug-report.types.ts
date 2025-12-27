export enum BugReportType {
  BUG = "bug",
  FEATURE = "feature",
  SUGGESTION = "suggestion",
}

export enum BugReportPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum BugReportStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export interface IBugReport {
  _id: string;
  type: BugReportType;
  priority: BugReportPriority;
  status: BugReportStatus;
  title: string;
  description: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  screenshots: string[];
  systemInfo: {
    userAgent: string;
    platform: string;
    language: string;
    screenResolution: string;
    viewport: string;
    url: string;
  };
  consoleLogs?: Array<{
    type: string;
    message: string;
    time: string;
  }>;
  reportedBy?: string; // user ID
  createdAt: Date;
  updatedAt: Date;
}

export type TCreateBugReport = Omit<IBugReport, "_id" | "createdAt" | "updatedAt" | "status">;
