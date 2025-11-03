import api from "@/lib/api";
import type { INeed, NeedCategory, NeedStatus, NeedPriority } from "common-types";

/**
 * Query parameters for getting needs list
 */
export interface GetNeedsParams {
  page?: number;
  limit?: number;
  category?: NeedCategory;
  status?: NeedStatus;
  priority?: NeedPriority;
  search?: string;
  sortBy?: string;
  tags?: string[];
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
  category: NeedCategory;
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
 */
class NeedService {
  /**
   * دریافت لیست نیازها
   */
  public async getNeeds(params?: GetNeedsParams): Promise<GetNeedsResponse> {
    try {
      const response = await api.get("/needs", { params });
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
      await api.post(`/social/follow`, {
        followingType: "need",
        following: id,
      });
    } catch (error: any) {
      console.error("Follow need failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دنبال کردن نیاز");
    }
  }

  /**
   * لغو دنبال کردن نیاز
   */
  public async unfollowNeed(id: string): Promise<void> {
    try {
      await api.delete(`/social/follow/${id}`);
    } catch (error: any) {
      console.error("Unfollow need failed:", error);
      throw new Error(error.response?.data?.message || "خطا در لغو دنبال کردن");
    }
  }

  /**
   * لایک کردن نیاز
   */
  public async likeNeed(id: string): Promise<void> {
    try {
      await api.post(`/social/like`, {
        targetType: "need",
        target: id,
      });
    } catch (error: any) {
      console.error("Like need failed:", error);
      throw new Error(error.response?.data?.message || "خطا در لایک کردن");
    }
  }

  /**
   * حذف لایک نیاز
   */
  public async unlikeNeed(id: string): Promise<void> {
    try {
      await api.delete(`/social/like/${id}`);
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

  /**
   * دریافت نیازهای trending
   */
  public async getTrendingNeeds(limit: number = 10): Promise<INeed[]> {
    try {
      const response = await api.get("/discovery/trending-needs", {
        params: { limit },
      });
      return response.data.data;
    } catch (error: any) {
      console.error("Get trending needs failed:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت نیازهای ترند");
    }
  }
}

export const needService = new NeedService();
