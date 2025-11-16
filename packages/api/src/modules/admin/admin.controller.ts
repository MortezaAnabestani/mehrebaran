import { Request, Response } from "express";
import { adminService } from "./admin.service";
import asyncHandler from "../../core/utils/asyncHandler";
import ResponseFormatter from "../../utils/ResponseFormatter";

/**
 * Admin Controller - Handles admin dashboard endpoints
 * کنترلر مدیریت - مدیریت endpoint های داشبورد مدیریت
 */
class AdminController {
  /**
   * Get dashboard overview with stats and KPIs
   * دریافت نمای کلی داشبورد با آمار و شاخص‌های کلیدی
   *
   * @route GET /api/v1/admin/dashboard/overview
   * @access Private (Admin, Super Admin)
   */
  public getDashboardOverview = asyncHandler(async (req: Request, res: Response) => {
    const overview = await adminService.getDashboardOverview();

    return ResponseFormatter.success(res, overview, "داده‌های داشبورد با موفقیت دریافت شد");
  });

  /**
   * Get trending needs
   * دریافت نیازهای پرطرفدار
   *
   * @route GET /api/v1/admin/dashboard/trending-needs
   * @access Private (Admin, Super Admin)
   */
  public getTrendingNeeds = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const trending = await adminService.getTrendingNeeds(limit);

    return ResponseFormatter.success(res, trending);
  });

  /**
   * Get active users statistics
   * دریافت آمار کاربران فعال
   *
   * @route GET /api/v1/admin/dashboard/active-users
   * @access Private (Admin, Super Admin)
   */
  public getActiveUsersStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await adminService.getActiveUsersStats();

    return ResponseFormatter.success(res, stats);
  });

  /**
   * Get donation progress statistics
   * دریافت آمار پیشرفت کمک‌ها
   *
   * @route GET /api/v1/admin/dashboard/donation-progress
   * @access Private (Admin, Super Admin)
   */
  public getDonationProgress = asyncHandler(async (req: Request, res: Response) => {
    const progress = await adminService.getDonationProgress();

    return ResponseFormatter.success(res, progress);
  });

  // ==================== ANALYTICS ENDPOINTS ====================

  /**
   * Get content analytics
   * آنالیز محتوا
   *
   * @route GET /api/v1/admin/analytics/content
   * @access Private (Admin, Super Admin)
   */
  public getContentAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const analytics = await adminService.getContentAnalytics(days);

    return ResponseFormatter.success(res, analytics, "آنالیز محتوا با موفقیت دریافت شد");
  });

  /**
   * Get user analytics
   * آنالیز کاربران
   *
   * @route GET /api/v1/admin/analytics/users
   * @access Private (Admin, Super Admin)
   */
  public getUserAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const analytics = await adminService.getUserAnalytics(days);

    return ResponseFormatter.success(res, analytics, "آنالیز کاربران با موفقیت دریافت شد");
  });

  /**
   * Get engagement analytics
   * آنالیز تعامل
   *
   * @route GET /api/v1/admin/analytics/engagement
   * @access Private (Admin, Super Admin)
   */
  public getEngagementAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const analytics = await adminService.getEngagementAnalytics(days);

    return ResponseFormatter.success(res, analytics, "آنالیز تعامل با موفقیت دریافت شد");
  });
}

export const adminController = new AdminController();
