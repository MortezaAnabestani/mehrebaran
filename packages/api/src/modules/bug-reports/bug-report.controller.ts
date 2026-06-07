import { Request, Response } from "express";
import { bugReportService } from "./bug-report.service";
import { emailService } from "./email.service";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";
import { getParam } from "../../core/utils/getParam";

class BugReportController {
  public createBugReport = asyncHandler(async (req: Request, res: Response) => {
    const bugReportData = req.body;

    // اگر کاربر لاگین کرده باشد، ID او را ذخیره کن
    if (req.user) {
      bugReportData.reportedBy = req.user._id;
    }

    const bugReport = await bugReportService.createBugReport(bugReportData);

    // ارسال ایمیل به صورت async (بدون انتظار)
    emailService.sendBugReportEmail(bugReport).catch((error) => {
      console.error("Failed to send email notification:", error);
    });

    res.status(201).json({
      message: "گزارش با موفقیت ثبت شد و به ایمیل ارسال خواهد شد.",
      data: bugReport,
    });
  });

  public getAllBugReports = asyncHandler(async (req: Request, res: Response) => {
    const bugReports = await bugReportService.findAllBugReports();
    res.status(200).json({
      message: "لیست گزارش‌ها با موفقیت دریافت شد.",
      data: bugReports,
    });
  });

  public getBugReportById = asyncHandler(async (req: Request, res: Response) => {
    const bugReport = await bugReportService.findBugReportById(getParam(req.params.id));
    if (!bugReport) {
      throw new ApiError(404, "گزارش یافت نشد.");
    }
    res.status(200).json({
      message: "گزارش با موفقیت دریافت شد.",
      data: bugReport,
    });
  });

  public updateBugReportStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const bugReport = await bugReportService.updateBugReportStatus(getParam(req.params.id), status);
    if (!bugReport) {
      throw new ApiError(404, "گزارش یافت نشد.");
    }
    res.status(200).json({
      message: "وضعیت گزارش به‌روزرسانی شد.",
      data: bugReport,
    });
  });

  public deleteBugReport = asyncHandler(async (req: Request, res: Response) => {
    const bugReport = await bugReportService.deleteBugReport(getParam(req.params.id));
    if (!bugReport) {
      throw new ApiError(404, "گزارش یافت نشد.");
    }
    res.status(200).json({
      message: "گزارش با موفقیت حذف شد.",
    });
  });
}

export const bugReportController = new BugReportController();
