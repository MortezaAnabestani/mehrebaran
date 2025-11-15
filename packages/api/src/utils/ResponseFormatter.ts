import { Response } from 'express';

/**
 * Standard API Response Format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationInfo;
  error?: ErrorDetails;
}

/**
 * Pagination Information
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

/**
 * Error Details
 */
export interface ErrorDetails {
  code?: string;
  details?: any;
  stack?: string;
}

/**
 * ResponseFormatter - Utility class for standardizing API responses
 *
 * یک کلاس کاربردی برای استانداردسازی پاسخ‌های API
 */
export class ResponseFormatter {
  /**
   * Success response with data
   * پاسخ موفقیت‌آمیز با داده
   */
  static success<T>(res: Response, data: T, message?: string, statusCode: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message: message || 'عملیات با موفقیت انجام شد',
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Success response with pagination
   * پاسخ موفقیت‌آمیز با صفحه‌بندی
   */
  static successWithPagination<T>(
    res: Response,
    data: T,
    pagination: PaginationInfo,
    message?: string,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message: message || 'عملیات با موفقیت انجام شد',
      pagination: {
        ...pagination,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPrevPage: pagination.page > 1,
      },
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Created response (201)
   * پاسخ ایجاد شده
   */
  static created<T>(res: Response, data: T, message?: string): Response {
    return ResponseFormatter.success(res, data, message || 'با موفقیت ایجاد شد', 201);
  }

  /**
   * No content response (204)
   * پاسخ بدون محتوا
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Error response
   * پاسخ خطا
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errorDetails?: ErrorDetails
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: errorDetails,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Bad request error (400)
   * خطای درخواست نامعتبر
   */
  static badRequest(res: Response, message?: string, details?: any): Response {
    return ResponseFormatter.error(
      res,
      message || 'درخواست نامعتبر است',
      400,
      details ? { details } : undefined
    );
  }

  /**
   * Unauthorized error (401)
   * خطای عدم احراز هویت
   */
  static unauthorized(res: Response, message?: string): Response {
    return ResponseFormatter.error(res, message || 'احراز هویت نشده‌اید', 401);
  }

  /**
   * Forbidden error (403)
   * خطای عدم دسترسی
   */
  static forbidden(res: Response, message?: string): Response {
    return ResponseFormatter.error(res, message || 'شما دسترسی به این منبع را ندارید', 403);
  }

  /**
   * Not found error (404)
   * خطای یافت نشدن
   */
  static notFound(res: Response, message?: string): Response {
    return ResponseFormatter.error(res, message || 'منبع مورد نظر یافت نشد', 404);
  }

  /**
   * Conflict error (409)
   * خطای تضاد
   */
  static conflict(res: Response, message?: string): Response {
    return ResponseFormatter.error(res, message || 'تضاد در داده‌ها رخ داده است', 409);
  }

  /**
   * Validation error (422)
   * خطای اعتبارسنجی
   */
  static validationError(res: Response, errors: any): Response {
    return ResponseFormatter.error(res, 'خطاهای اعتبارسنجی', 422, { details: errors });
  }

  /**
   * Internal server error (500)
   * خطای سرور داخلی
   */
  static serverError(res: Response, message?: string, error?: any): Response {
    const errorDetails: ErrorDetails = {};

    if (error) {
      errorDetails.details = error.message || error;
      if (process.env.NODE_ENV === 'development') {
        errorDetails.stack = error.stack;
      }
    }

    return ResponseFormatter.error(
      res,
      message || 'خطای سرور رخ داده است',
      500,
      errorDetails
    );
  }

  /**
   * Helper: Calculate pagination info from query
   * کمکی: محاسبه اطلاعات صفحه‌بندی از query
   */
  static getPaginationInfo(
    page: number | string = 1,
    limit: number | string = 10,
    total: number
  ): PaginationInfo {
    const currentPage = typeof page === 'string' ? parseInt(page, 10) : page;
    const itemsPerPage = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      page: currentPage,
      limit: itemsPerPage,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }

  /**
   * Helper: Extract pagination params from request
   * کمکی: استخراج پارامترهای صفحه‌بندی از درخواست
   */
  static extractPaginationParams(query: any): { page: number; limit: number; skip: number } {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }
}

export default ResponseFormatter;
