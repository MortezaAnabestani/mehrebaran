import { IBugReport, TCreateBugReport } from "common-types";
import { BugReportModel } from "./bug-report.model";

class BugReportService {
  public async createBugReport(data: Partial<TCreateBugReport>): Promise<IBugReport> {
    const bugReport = await BugReportModel.create(data);
    return bugReport;
  }

  public async findAllBugReports(): Promise<IBugReport[]> {
    return BugReportModel.find().populate("reportedBy", "name email").sort({ createdAt: -1 });
  }

  public async findBugReportById(id: string): Promise<IBugReport | null> {
    return BugReportModel.findById(id).populate("reportedBy", "name email");
  }

  public async updateBugReportStatus(
    id: string,
    status: string
  ): Promise<IBugReport | null> {
    return BugReportModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  public async deleteBugReport(id: string): Promise<IBugReport | null> {
    return BugReportModel.findByIdAndDelete(id);
  }
}

export const bugReportService = new BugReportService();
