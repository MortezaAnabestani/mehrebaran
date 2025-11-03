import api from "@/lib/api";

/**
 * Types
 */
export interface IFollow {
  _id: string;
  follower: {
    _id: string;
    name: string;
    avatar?: string;
  };
  following?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  followedNeed?: {
    _id: string;
    title: string;
  };
  followType: "user" | "need";
  createdAt: Date;
}

export interface IFollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface IMention {
  _id: string;
  mentionedUser: string;
  mentionedBy: {
    _id: string;
    name: string;
    avatar?: string;
  };
  targetType: "need" | "comment" | "task";
  target: string;
  context: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ITag {
  name: string;
  usage: number;
  category?: string;
}

export interface IShareLog {
  itemType: string;
  itemId: string;
  platform?: string;
  sharedBy?: string;
  createdAt: Date;
}

/**
 * Social Service
 */
class SocialService {
  // ==================== FOLLOW ====================

  /**
   * دنبال کردن کاربر
   */
  public async followUser(userId: string): Promise<{ data: IFollow }> {
    try {
      const response = await api.post(`/social/follow/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to follow user:", error);
      throw new Error(error.response?.data?.message || "خطا در دنبال کردن کاربر");
    }
  }

  /**
   * آنفالو کردن کاربر
   */
  public async unfollowUser(userId: string): Promise<void> {
    try {
      await api.delete(`/social/follow/user/${userId}`);
    } catch (error: any) {
      console.error("Failed to unfollow user:", error);
      throw new Error(error.response?.data?.message || "خطا در آنفالو کردن کاربر");
    }
  }

  /**
   * دنبال کردن نیاز
   */
  public async followNeed(needId: string): Promise<{ data: IFollow }> {
    try {
      const response = await api.post(`/social/follow/need/${needId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to follow need:", error);
      throw new Error(error.response?.data?.message || "خطا در دنبال کردن نیاز");
    }
  }

  /**
   * آنفالو کردن نیاز
   */
  public async unfollowNeed(needId: string): Promise<void> {
    try {
      await api.delete(`/social/follow/need/${needId}`);
    } catch (error: any) {
      console.error("Failed to unfollow need:", error);
      throw new Error(error.response?.data?.message || "خطا در آنفالو کردن نیاز");
    }
  }

  /**
   * دریافت دنبال‌کنندگان کاربر
   */
  public async getUserFollowers(userId: string, limit: number = 50): Promise<{ data: IFollow[] }> {
    try {
      const response = await api.get(`/social/users/${userId}/followers`, { params: { limit } });
      return response.data;
    } catch (error: any) {
      console.error("Failed to get followers:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت دنبال‌کنندگان");
    }
  }

  /**
   * دریافت دنبال‌شوندگان کاربر
   */
  public async getUserFollowing(userId: string, limit: number = 50): Promise<{ data: IFollow[] }> {
    try {
      const response = await api.get(`/social/users/${userId}/following`, { params: { limit } });
      return response.data;
    } catch (error: any) {
      console.error("Failed to get following:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت دنبال‌شوندگان");
    }
  }

  /**
   * دریافت آمار فالو کاربر
   */
  public async getUserFollowStats(userId: string): Promise<{ data: IFollowStats }> {
    try {
      const response = await api.get(`/social/users/${userId}/follow-stats`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get follow stats:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت آمار فالو");
    }
  }

  /**
   * دریافت نیازهای دنبال شده توسط کاربر
   */
  public async getUserFollowedNeeds(): Promise<{ data: any[] }> {
    try {
      const response = await api.get("/social/my-followed-needs");
      return response.data;
    } catch (error: any) {
      console.error("Failed to get followed needs:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت نیازهای دنبال شده");
    }
  }

  /**
   * دریافت دنبال‌کنندگان یک نیاز
   */
  public async getNeedFollowers(needId: string): Promise<{ data: IFollow[] }> {
    try {
      const response = await api.get(`/social/needs/${needId}/followers`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get need followers:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت دنبال‌کنندگان نیاز");
    }
  }

  /**
   * دریافت پیشنهاد کاربران برای فالو
   */
  public async getSuggestedUsers(limit: number = 10): Promise<{ data: any[] }> {
    try {
      const response = await api.get("/social/follow/suggestions", { params: { limit } });
      return response.data;
    } catch (error: any) {
      console.error("Failed to get suggested users:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت پیشنهادات");
    }
  }

  // ==================== MENTIONS ====================

  /**
   * دریافت منشن‌های کاربر
   */
  public async getUserMentions(limit: number = 20, skip: number = 0): Promise<{ data: IMention[] }> {
    try {
      const response = await api.get("/social/mentions/me", { params: { limit, skip } });
      return response.data;
    } catch (error: any) {
      console.error("Failed to get mentions:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت منشن‌ها");
    }
  }

  /**
   * دریافت تعداد منشن‌های خوانده نشده
   */
  public async getUnreadMentionCount(): Promise<{ data: { count: number } }> {
    try {
      const response = await api.get("/social/mentions/unread-count");
      return response.data;
    } catch (error: any) {
      console.error("Failed to get unread mention count:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت تعداد منشن‌ها");
    }
  }

  /**
   * علامت‌گذاری منشن به عنوان خوانده شده
   */
  public async markMentionAsRead(mentionId: string): Promise<void> {
    try {
      await api.post(`/social/mentions/${mentionId}/read`);
    } catch (error: any) {
      console.error("Failed to mark mention as read:", error);
      throw new Error(error.response?.data?.message || "خطا در علامت‌گذاری منشن");
    }
  }

  /**
   * علامت‌گذاری همه منشن‌ها به عنوان خوانده شده
   */
  public async markAllMentionsAsRead(): Promise<void> {
    try {
      await api.post("/social/mentions/read-all");
    } catch (error: any) {
      console.error("Failed to mark all mentions as read:", error);
      throw new Error(error.response?.data?.message || "خطا در علامت‌گذاری همه منشن‌ها");
    }
  }

  // ==================== TAGS ====================

  /**
   * دریافت تگ‌های محبوب
   */
  public async getPopularTags(limit: number = 20): Promise<{ data: ITag[] }> {
    try {
      const response = await api.get("/social/tags/popular", { params: { limit } });
      return response.data;
    } catch (error: any) {
      console.error("Failed to get popular tags:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت تگ‌های محبوب");
    }
  }

  /**
   * دریافت تگ‌های ترند
   */
  public async getTrendingTags(limit: number = 20): Promise<{ data: ITag[] }> {
    try {
      const response = await api.get("/social/tags/trending", { params: { limit } });
      return response.data;
    } catch (error: any) {
      console.error("Failed to get trending tags:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت تگ‌های ترند");
    }
  }

  /**
   * جستجو در تگ‌ها
   */
  public async searchTags(query: string): Promise<{ data: ITag[] }> {
    try {
      const response = await api.get("/social/tags/search", { params: { query } });
      return response.data;
    } catch (error: any) {
      console.error("Failed to search tags:", error);
      throw new Error(error.response?.data?.message || "خطا در جستجوی تگ‌ها");
    }
  }

  /**
   * دریافت نیازهای یک تگ
   */
  public async getNeedsByTag(tag: string, limit: number = 20): Promise<{ data: any[] }> {
    try {
      const response = await api.get(`/social/tags/${tag}/needs`, { params: { limit } });
      return response.data;
    } catch (error: any) {
      console.error("Failed to get needs by tag:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت نیازهای تگ");
    }
  }

  // ==================== SHARE ====================

  /**
   * ثبت اشتراک‌گذاری
   */
  public async logShare(data: {
    itemType: string;
    itemId: string;
    platform?: string;
  }): Promise<{ data: IShareLog }> {
    try {
      const response = await api.post("/social/share", data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to log share:", error);
      throw new Error(error.response?.data?.message || "خطا در ثبت اشتراک‌گذاری");
    }
  }

  /**
   * دریافت آیتم‌های پراشتراک
   */
  public async getTopSharedItems(limit: number = 10): Promise<{ data: any[] }> {
    try {
      const response = await api.get("/social/share/top", { params: { limit } });
      return response.data;
    } catch (error: any) {
      console.error("Failed to get top shared items:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت پراشتراک‌ترین‌ها");
    }
  }

  /**
   * دریافت آمار اشتراک‌گذاری یک آیتم
   */
  public async getItemShareStats(itemId: string): Promise<{ data: { totalShares: number; platforms: any } }> {
    try {
      const response = await api.get(`/social/share/${itemId}/stats`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get share stats:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت آمار اشتراک‌گذاری");
    }
  }

  /**
   * دریافت متادیتای OG برای اشتراک‌گذاری
   */
  public async getOGMetadata(needId: string): Promise<{ data: any }> {
    try {
      const response = await api.get(`/social/share/${needId}/og-metadata`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get OG metadata:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت متادیتا");
    }
  }

  /**
   * دریافت URL اشتراک‌گذاری
   */
  public async getShareUrl(needId: string): Promise<{ data: { url: string } }> {
    try {
      const response = await api.get(`/social/share/${needId}/url`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get share URL:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت لینک اشتراک‌گذاری");
    }
  }
}

export const socialService = new SocialService();
