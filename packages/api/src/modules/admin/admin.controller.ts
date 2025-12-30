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

  /**
   * Get site views analytics
   * آنالیز بازدیدهای سایت
   *
   * @route GET /api/v1/admin/analytics/views
   * @access Private (Admin, Super Admin)
   */
  public getViewsAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const analytics = await adminService.getViewsAnalytics(days);

    return ResponseFormatter.success(res, analytics, "آنالیز بازدیدها با موفقیت دریافت شد");
  });

  // ==================== MODERATION ENDPOINTS ====================

  /**
   * Get needs for moderation
   * دریافت نیازها برای مدیریت
   *
   * @route GET /api/v1/admin/moderation/needs
   * @access Private (Admin, Super Admin)
   */
  public getModerationNeeds = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      status: req.query.status as string,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const result = await adminService.getModerationNeeds(filters);

    return ResponseFormatter.successWithPagination(
      res,
      result.needs,
      result.pagination,
      "لیست نیازها با موفقیت دریافت شد"
    );
  });

  /**
   * Bulk update needs status
   * به‌روزرسانی گروهی وضعیت نیازها
   *
   * @route PUT /api/v1/admin/moderation/needs/bulk-status
   * @access Private (Admin, Super Admin)
   */
  public bulkUpdateNeedsStatus = asyncHandler(async (req: Request, res: Response) => {
    const { needIds, status, reason } = req.body;

    if (!needIds || !Array.isArray(needIds) || needIds.length === 0) {
      return ResponseFormatter.badRequest(res, "لیست نیازها الزامی است");
    }

    if (!status) {
      return ResponseFormatter.badRequest(res, "وضعیت جدید الزامی است");
    }

    const result = await adminService.bulkUpdateNeedsStatus(needIds, status, reason);

    return ResponseFormatter.success(
      res,
      result,
      `${result.modifiedCount} نیاز با موفقیت به‌روزرسانی شد`
    );
  });

  /**
   * Get comments for moderation
   * دریافت نظرات برای مدیریت
   *
   * @route GET /api/v1/admin/moderation/comments
   * @access Private (Admin, Super Admin)
   */
  public getModerationComments = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const result = await adminService.getModerationComments(filters);

    return ResponseFormatter.successWithPagination(
      res,
      result.comments,
      result.pagination,
      "لیست نظرات با موفقیت دریافت شد"
    );
  });

  /**
   * Bulk update comments approval
   * به‌روزرسانی گروهی تایید نظرات
   *
   * NOTE: Disabled - NeedComment model does not have isApproved field
   *
   * @route PUT /api/v1/admin/moderation/comments/bulk-approval
   * @access Private (Admin, Super Admin)
   */
  // public bulkUpdateCommentsApproval = asyncHandler(async (req: Request, res: Response) => {
  //   const { commentIds, isApproved } = req.body;

  //   if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
  //     return ResponseFormatter.badRequest(res, "لیست نظرات الزامی است");
  //   }

  //   if (typeof isApproved !== "boolean") {
  //     return ResponseFormatter.badRequest(res, "وضعیت تایید الزامی است");
  //   }

  //   const result = await adminService.bulkUpdateCommentsApproval(commentIds, isApproved);

  //   return ResponseFormatter.success(
  //     res,
  //     result,
  //     `${result.modifiedCount} نظر با موفقیت ${isApproved ? "تایید" : "رد"} شد`
  //   );
  // });

  /**
   * Get donations for moderation
   * دریافت کمک‌ها برای مدیریت
   *
   * @route GET /api/v1/admin/moderation/donations
   * @access Private (Admin, Super Admin)
   */
  public getModerationDonations = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      status: req.query.status as string,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const result = await adminService.getModerationDonations(filters);

    return ResponseFormatter.successWithPagination(
      res,
      result.donations,
      result.pagination,
      "لیست کمک‌ها با موفقیت دریافت شد"
    );
  });

  /**
   * Update donation status
   * به‌روزرسانی وضعیت کمک
   *
   * @route PUT /api/v1/admin/moderation/donations/:donationId/status
   * @access Private (Admin, Super Admin)
   */
  public updateDonationStatus = asyncHandler(async (req: Request, res: Response) => {
    const { donationId } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return ResponseFormatter.badRequest(res, "وضعیت جدید الزامی است");
    }

    const donation = await adminService.updateDonationStatus(donationId, status, notes);

    if (!donation) {
      return ResponseFormatter.notFound(res, "کمک یافت نشد");
    }

    return ResponseFormatter.success(res, donation, "وضعیت کمک با موفقیت به‌روزرسانی شد");
  });

  // ==================== ACTIVITY FEED ENDPOINTS ====================

  /**
   * Get activity feed with all recent activities
   * دریافت فید فعالیت‌های اخیر
   *
   * @route GET /api/v1/admin/activity-feed
   * @access Private (Admin, Super Admin)
   */
  public getActivityFeed = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      activityType: req.query.activityType as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      days: req.query.days ? parseInt(req.query.days as string) : 7,
    };

    const result = await adminService.getActivityFeed(filters);

    return ResponseFormatter.successWithPagination(
      res,
      result.activities,
      result.pagination,
      "فید فعالیت‌ها با موفقیت دریافت شد"
    );
  });

  /**
   * Get all admin users
   * دریافت لیست کاربران ادمین
   *
   * @route GET /api/v1/admins/all
   * @access Private (Admin, Super Admin)
   */
  public getAllAdmins = asyncHandler(async (req: Request, res: Response) => {
    const admins = await adminService.getAllAdmins();

    return ResponseFormatter.success(res, admins, "لیست ادمین‌ها با موفقیت دریافت شد");
  });

  /**
   * Get admin by ID
   * دریافت ادمین بر اساس ID
   *
   * @route GET /api/v1/admins/one/:id
   * @access Private (Admin, Super Admin)
   */
  public getAdminById = asyncHandler(async (req: Request, res: Response) => {
    const admin = await adminService.getAdminById(req.params.id);

    if (!admin) {
      return ResponseFormatter.notFound(res, "ادمین مورد نظر یافت نشد");
    }

    return ResponseFormatter.success(res, admin, "ادمین با موفقیت دریافت شد");
  });

  /**
   * Create new admin
   * ایجاد ادمین جدید
   *
   * @route POST /api/v1/admins/create
   * @access Private (Super Admin only)
   */
  public createAdmin = asyncHandler(async (req: Request, res: Response) => {
    const adminData = req.body;

    // اگر فایل آپلود شده باشد، مسیر آن را به adminData اضافه کن
    if (req.processedFiles?.desktop) {
      adminData.avatar = req.processedFiles.desktop;
    }

    const admin = await adminService.createAdmin(adminData);

    return ResponseFormatter.created(res, admin, "ادمین جدید با موفقیت ایجاد شد");
  });

  /**
   * Update admin
   * ویرایش ادمین
   *
   * @route PATCH /api/v1/admins/:id
   * @access Private (Admin, Super Admin)
   */
  public updateAdmin = asyncHandler(async (req: Request, res: Response) => {
    const updates = req.body;

    // اگر فایل آپلود شده باشد، مسیر آن را به updates اضافه کن
    if (req.processedFiles?.desktop) {
      updates.avatar = req.processedFiles.desktop;
    }

    const admin = await adminService.updateAdmin(req.params.id, updates);

    if (!admin) {
      return ResponseFormatter.notFound(res, "ادمین مورد نظر یافت نشد");
    }

    return ResponseFormatter.success(res, admin, "ادمین با موفقیت به‌روزرسانی شد");
  });

  /**
   * Delete admin
   * حذف ادمین
   *
   * @route DELETE /api/v1/admins/:id
   * @access Private (Super Admin only)
   */
  public deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
    const admin = await adminService.deleteAdmin(req.params.id);

    if (!admin) {
      return ResponseFormatter.notFound(res, "ادمین مورد نظر یافت نشد");
    }

    return ResponseFormatter.success(res, null, "ادمین با موفقیت حذف شد");
  });
}

export const adminController = new AdminController();
