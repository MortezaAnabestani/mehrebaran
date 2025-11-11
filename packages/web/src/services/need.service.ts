import api from "@/lib/api";
import type { INeed, NeedCategory, NeedStatus, NeedPriority } from "common-types";

/**
 * Query parameters for getting needs list
 */
export interface GetNeedsParams {
  page?: number;
  limit?: number;
  skip?: number;
  category?: string; // Can be ObjectId, slug, or name
  status?: string; // NeedStatus or custom string
  priority?: NeedPriority;
  search?: string;
  sortBy?: string;
  tags?: string[];
  trending?: boolean;
}

/**
 * Response for needs list
 */
interface GetNeedsResponse {
  message: string;
  data: INeed[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}

/**
 * Response for single need
 */
interface GetNeedResponse {
  message: string;
  data: INeed;
}

/**
 * Data for creating a need
 */
export interface CreateNeedData {
  title: string;
  description: string;
  category?: string; // Optional: ObjectId, slug, or name
  priority?: NeedPriority;
  tags?: string[];
  targetAmount?: number;
  deadline?: Date;
  location?: {
    address: string;
    city: string;
    province: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  images?: string[];
}

/**
 * Need Service - تمام درخواست‌های مربوط به نیازها
 * Updated: Force rebuild
 */
class NeedService {
  /**
   * دریافت لیست نیازها
   */
  public async getNeeds(params?: GetNeedsParams): Promise<GetNeedsResponse> {
    try {
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/needs`, { params });
      return response.data;
    } catch (error: any) {
      console.error("Get needs failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت لیست نیازها");
    }
  }

  /**
   * دریافت جزئیات یک نیاز
   */
  public async getNeedById(id: string): Promise<INeed> {
    try {
      const response = await api.get(`/needs/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error("Get need failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت اطلاعات نیاز");
    }
  }

  /**
   * ایجاد نیاز جدید
   */
  public async createNeed(data: CreateNeedData): Promise<INeed> {
    try {
      const response = await api.post("/needs", data);
      return response.data.data;
    } catch (error: any) {
      console.error("Create need failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ایجاد نیاز");
    }
  }

  /**
   * ویرایش نیاز
   */
  public async updateNeed(id: string, data: Partial<CreateNeedData>): Promise<INeed> {
    try {
      const response = await api.put(`/needs/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error("Update need failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ویرایش نیاز");
    }
  }

  /**
   * حذف نیاز
   */
  public async deleteNeed(id: string): Promise<void> {
    try {
      await api.delete(`/needs/${id}`);
    } catch (error: any) {
      console.error("Delete need failed:", error);
      throw new Error(error.response?.data?.message || "خطا در حذف نیاز");
    }
  }

  /**
   * دنبال کردن نیاز
   */
  public async followNeed(id: string): Promise<void> {
    try {
      await api.post(`/needs/${id}/support`);
    } catch (error: any) {
      console.error("Follow need failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دنبال کردن نیاز");
    }
  }

  /**
   * لغو دنبال کردن نیاز (same endpoint, it toggles)
   */
  public async unfollowNeed(id: string): Promise<void> {
    try {
      await api.post(`/needs/${id}/support`);
    } catch (error: any) {
      console.error("Unfollow need failed:", error);
      throw new Error(error.response?.data?.message || "خطا در لغو دنبال کردن");
    }
  }

  /**
   * لایک کردن نیاز (upvote)
   */
  public async likeNeed(id: string): Promise<void> {
    try {
      await api.post(`/needs/${id}/upvote`);
    } catch (error: any) {
      console.error("Like need failed:", error);
      throw new Error(error.response?.data?.message || "خطا در لایک کردن");
    }
  }

  /**
   * حذف لایک نیاز (same endpoint, it toggles)
   */
  public async unlikeNeed(id: string): Promise<void> {
    try {
      await api.post(`/needs/${id}/upvote`);
    } catch (error: any) {
      console.error("Unlike need failed:", error);
      throw new Error(error.response?.data?.message || "خطا در حذف لایک");
    }
  }

  /**
   * دریافت نیازهای من
   */
  public async getMyNeeds(params?: GetNeedsParams): Promise<GetNeedsResponse> {
    try {
      const response = await api.get("/needs/my-needs", { params });
      return response.data;
    } catch (error: any) {
      console.error("Get my needs failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت نیازهای من");
    }
  }

  // ===========================
  // Special Feeds
  // ===========================

  /**
   * دریافت نیازهای trending
   */
  public async getTrendingNeeds(params?: GetNeedsParams): Promise<GetNeedsResponse> {
    try {
      const response = await api.get("/needs/trending", { params });
      return response.data;
    } catch (error: any) {
      console.error("Get trending needs failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت نیازهای ترند");
    }
  }

  /**
   * دریافت نیازهای محبوب
   */
  public async getPopularNeeds(params?: GetNeedsParams): Promise<GetNeedsResponse> {
    try {
      const response = await api.get("/needs/popular", { params });
      return response.data;
    } catch (error: any) {
      console.error("Get popular needs failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت نیازهای محبوب");
    }
  }

  /**
   * دریافت نیازهای فوری
   */
  public async getUrgentNeeds(params?: GetNeedsParams): Promise<GetNeedsResponse> {
    try {
      const response = await api.get("/needs/urgent", { params });
      return response.data;
    } catch (error: any) {
      console.error("Get urgent needs failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت نیازهای فوری");
    }
  }

  /**
   * دریافت نیازهای نزدیک
   */
  public async getNearbyNeeds(
    params?: GetNeedsParams & { lat?: number; lng?: number; radius?: number }
  ): Promise<GetNeedsResponse> {
    try {
      const response = await api.get("/needs/nearby", { params });
      return response.data;
    } catch (error: any) {
      console.error("Get nearby needs failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت نیازهای نزدیک");
    }
  }

  // ===========================
  // Updates (Timeline)
  // ===========================

  /**
   * دریافت آپدیت‌های یک نیاز
   */
  public async getUpdates(needId: string): Promise<{ success: boolean; data: any[]; message: string }> {
    try {
      const response = await api.get(`/needs/${needId}/updates`);
      return response.data;
    } catch (error: any) {
      console.error("Get updates failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت آپدیت‌ها");
    }
  }

  /**
   * ایجاد آپدیت برای نیاز
   */
  public async createUpdate(
    needId: string,
    data: { title: string; content: string; images?: string[] }
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.post(`/needs/${needId}/updates`, data);
      return response.data;
    } catch (error: any) {
      console.error("Create update failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ایجاد آپدیت");
    }
  }

  /**
   * ویرایش آپدیت
   */
  public async updateUpdate(
    needId: string,
    updateId: string,
    data: { title?: string; content?: string; images?: string[] }
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.patch(`/needs/${needId}/updates/${updateId}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Update update failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ویرایش آپدیت");
    }
  }

  /**
   * حذف آپدیت
   */
  public async deleteUpdate(
    needId: string,
    updateId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/needs/${needId}/updates/${updateId}`);
      return response.data;
    } catch (error: any) {
      console.error("Delete update failed:", error);
      throw new Error(error.response?.data?.message || "خطا در حذف آپدیت");
    }
  }

  // ===========================
  // Milestones
  // ===========================

  /**
   * دریافت milestone‌های یک نیاز
   */
  public async getMilestones(needId: string): Promise<{ success: boolean; data: any[]; message: string }> {
    try {
      const response = await api.get(`/needs/${needId}/milestones`);
      return response.data;
    } catch (error: any) {
      console.error("Get milestones failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت milestone‌ها");
    }
  }

  /**
   * ایجاد milestone برای نیاز
   */
  public async createMilestone(
    needId: string,
    data: { title: string; description?: string; targetAmount?: number; deadline?: Date }
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.post(`/needs/${needId}/milestones`, data);
      return response.data;
    } catch (error: any) {
      console.error("Create milestone failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ایجاد milestone");
    }
  }

  /**
   * ویرایش milestone
   */
  public async updateMilestone(
    needId: string,
    milestoneId: string,
    data: { title?: string; description?: string; targetAmount?: number; deadline?: Date }
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.patch(`/needs/${needId}/milestones/${milestoneId}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Update milestone failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ویرایش milestone");
    }
  }

  /**
   * حذف milestone
   */
  public async deleteMilestone(
    needId: string,
    milestoneId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/needs/${needId}/milestones/${milestoneId}`);
      return response.data;
    } catch (error: any) {
      console.error("Delete milestone failed:", error);
      throw new Error(error.response?.data?.message || "خطا در حذف milestone");
    }
  }

  /**
   * تکمیل milestone
   */
  public async completeMilestone(
    needId: string,
    milestoneId: string
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.post(`/needs/${needId}/milestones/${milestoneId}/complete`);
      return response.data;
    } catch (error: any) {
      console.error("Complete milestone failed:", error);
      throw new Error(error.response?.data?.message || "خطا در تکمیل milestone");
    }
  }

  // ===========================
  // Budget Management
  // ===========================

  /**
   * دریافت budget items یک نیاز
   */
  public async getBudgetItems(needId: string): Promise<{ success: boolean; data: any[]; message: string }> {
    try {
      const response = await api.get(`/needs/${needId}/budget`);
      return response.data;
    } catch (error: any) {
      console.error("Get budget items failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت بودجه");
    }
  }

  /**
   * ایجاد budget item
   */
  public async createBudgetItem(
    needId: string,
    data: { category: string; description?: string; amount: number }
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.post(`/needs/${needId}/budget`, data);
      return response.data;
    } catch (error: any) {
      console.error("Create budget item failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ایجاد آیتم بودجه");
    }
  }

  /**
   * ویرایش budget item
   */
  public async updateBudgetItem(
    needId: string,
    budgetItemId: string,
    data: { category?: string; description?: string; amount?: number }
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.patch(`/needs/${needId}/budget/${budgetItemId}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Update budget item failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ویرایش آیتم بودجه");
    }
  }

  /**
   * حذف budget item
   */
  public async deleteBudgetItem(
    needId: string,
    budgetItemId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/needs/${needId}/budget/${budgetItemId}`);
      return response.data;
    } catch (error: any) {
      console.error("Delete budget item failed:", error);
      throw new Error(error.response?.data?.message || "خطا در حذف آیتم بودجه");
    }
  }

  /**
   * افزودن وجه به budget item
   */
  public async addFundsToBudgetItem(
    needId: string,
    budgetItemId: string,
    amount: number
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.post(`/needs/${needId}/budget/${budgetItemId}/add-funds`, { amount });
      return response.data;
    } catch (error: any) {
      console.error("Add funds to budget item failed:", error);
      throw new Error(error.response?.data?.message || "خطا در افزودن وجه به بودجه");
    }
  }

  // ===========================
  // Supporter Details
  // ===========================

  /**
   * دریافت جزئیات supporter‌ها
   */
  public async getSupporterDetails(
    needId: string
  ): Promise<{ success: boolean; data: any[]; message: string }> {
    try {
      const response = await api.get(`/needs/${needId}/supporters/details`);
      return response.data;
    } catch (error: any) {
      console.error("Get supporter details failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت جزئیات supporter‌ها");
    }
  }

  /**
   * ویرایش جزئیات supporter
   */
  public async updateSupporterDetail(
    needId: string,
    userId: string,
    data: { role?: string; permissions?: string[] }
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.patch(`/needs/${needId}/supporters/${userId}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Update supporter detail failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ویرایش جزئیات supporter");
    }
  }

  /**
   * افزودن contribution برای supporter
   */
  public async addContribution(
    needId: string,
    userId: string,
    data: { type: string; amount?: number; description?: string }
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.post(`/needs/${needId}/supporters/${userId}/contributions`, data);
      return response.data;
    } catch (error: any) {
      console.error("Add contribution failed:", error);
      throw new Error(error.response?.data?.message || "خطا در افزودن مشارکت");
    }
  }

  /**
   * حذف supporter
   */
  public async removeSupporterDetail(
    needId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/needs/${needId}/supporters/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Remove supporter detail failed:", error);
      throw new Error(error.response?.data?.message || "خطا در حذف supporter");
    }
  }

  // ===========================
  // Verification Requests
  // ===========================

  /**
   * دریافت درخواست‌های verification
   */
  public async getVerificationRequests(
    needId: string
  ): Promise<{ success: boolean; data: any[]; message: string }> {
    try {
      const response = await api.get(`/needs/${needId}/verifications`);
      return response.data;
    } catch (error: any) {
      console.error("Get verification requests failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت درخواست‌های تایید");
    }
  }

  /**
   * ایجاد درخواست verification
   */
  public async createVerificationRequest(
    needId: string,
    data: { type: string; documents?: string[]; notes?: string }
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.post(`/needs/${needId}/verifications`, data);
      return response.data;
    } catch (error: any) {
      console.error("Create verification request failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ایجاد درخواست تایید");
    }
  }

  /**
   * بررسی درخواست verification (فقط ادمین)
   */
  public async reviewVerificationRequest(
    needId: string,
    verificationId: string,
    data: { status: string; reviewNotes?: string }
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.patch(`/needs/${needId}/verifications/${verificationId}/review`, data);
      return response.data;
    } catch (error: any) {
      console.error("Review verification request failed:", error);
      throw new Error(error.response?.data?.message || "خطا در بررسی درخواست تایید");
    }
  }

  /**
   * حذف درخواست verification
   */
  public async deleteVerificationRequest(
    needId: string,
    verificationId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/needs/${needId}/verifications/${verificationId}`);
      return response.data;
    } catch (error: any) {
      console.error("Delete verification request failed:", error);
      throw new Error(error.response?.data?.message || "خطا در حذف درخواست تایید");
    }
  }

  // ===========================
  // Comments
  // ===========================

  /**
   * دریافت نظرات یک نیاز
   */
  public async getComments(needId: string): Promise<any[]> {
    try {
      const response = await api.get(`/needs/${needId}/comments`);
      return response.data.data;
    } catch (error: any) {
      console.error("Get comments failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت نظرات");
    }
  }

  /**
   * ارسال نظر برای یک نیاز
   */
  public async createComment(needId: string, content: string, parentId?: string): Promise<any> {
    try {
      const response = await api.post(`/needs/${needId}/comments`, { content, parentId });
      return response.data.data;
    } catch (error: any) {
      console.error("Create comment failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ارسال نظر");
    }
  }

  /**
   * ویرایش نظر
   */
  public async updateComment(needId: string, commentId: string, content: string): Promise<any> {
    try {
      const response = await api.patch(`/needs/${needId}/comments/${commentId}`, { content });
      return response.data.data;
    } catch (error: any) {
      console.error("Update comment failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ویرایش نظر");
    }
  }

  /**
   * حذف نظر
   */
  public async deleteComment(needId: string, commentId: string): Promise<void> {
    try {
      await api.delete(`/needs/${needId}/comments/${commentId}`);
    } catch (error: any) {
      console.error("Delete comment failed:", error);
      throw new Error(error.response?.data?.message || "خطا در حذف نظر");
    }
  }
}

export const needService = new NeedService();
