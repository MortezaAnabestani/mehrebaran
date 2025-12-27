import api from "@/lib/api";
import type { IUser } from "@/types/user";

// ===========================
// Types & Interfaces
// ===========================

export type NotificationType =
  | "like_need"
  | "follow_user"
  | "follow_need"
  | "comment"
  | "mention"
  | "team_invite"
  | "team_join"
  | "task_assigned"
  | "task_completed"
  | "badge_earned"
  | "level_up"
  | "daily_bonus";

export interface INotification {
  _id: string;
  recipient: string | IUser;
  sender?: string | IUser | null;
  type: NotificationType;
  relatedNeed?: string;
  relatedTeam?: string;
  relatedTask?: string;
  relatedComment?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface GetNotificationsParams {
  limit?: number;
  skip?: number;
  isRead?: boolean;
  type?: NotificationType;
}

export interface GetNotificationsResponse {
  success: boolean;
  data: INotification[];
  message: string;
  total?: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  data: INotification;
  message: string;
}

export interface MarkAllAsReadResponse {
  success: boolean;
  data: {
    modifiedCount: number;
  };
  message: string;
}

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

export interface GetUnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
  message: string;
}

// ===========================
// Notification Service Class
// ===========================

class NotificationService {
  // ===========================
  // Fetch Notifications
  // ===========================

  /**
   * Get all notifications for the current user
   */
  public async getNotifications(params?: GetNotificationsParams): Promise<GetNotificationsResponse> {
    const response = await api.get("/notifications", { params });
    return response.data;
  }

  /**
   * Get unread notifications only
   */
  public async getUnreadNotifications(limit: number = 20): Promise<GetNotificationsResponse> {
    const response = await api.get("/notifications", {
      params: { isRead: false, limit },
    });
    return response.data;
  }

  /**
   * Get read notifications only
   */
  public async getReadNotifications(limit: number = 20): Promise<GetNotificationsResponse> {
    const response = await api.get("/notifications", {
      params: { isRead: true, limit },
    });
    return response.data;
  }

  /**
   * Get notifications by type
   */
  public async getNotificationsByType(
    type: NotificationType,
    limit: number = 20
  ): Promise<GetNotificationsResponse> {
    const response = await api.get("/notifications", {
      params: { type, limit },
    });
    return response.data;
  }

  // ===========================
  // Mark as Read/Unread
  // ===========================

  /**
   * Mark a notification as read
   */
  public async markAsRead(id: string): Promise<MarkAsReadResponse> {
    const response = await api.post(`/notifications/${id}/read`);
    return response.data;
  }

  /**
   * Mark all notifications as read
   */
  public async markAllAsRead(): Promise<MarkAllAsReadResponse> {
    const response = await api.post("/notifications/mark-all-read");
    return response.data;
  }

  // ===========================
  // Delete Notifications
  // ===========================

  /**
   * Delete a specific notification
   */
  public async deleteNotification(id: string): Promise<DeleteNotificationResponse> {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }

  /**
   * Delete all notifications
   */
  public async deleteAllNotifications(): Promise<DeleteNotificationResponse> {
    const response = await api.delete("/notifications");
    return response.data;
  }

  // ===========================
  // Unread Count
  // ===========================

  /**
   * Get the count of unread notifications
   */
  public async getUnreadCount(): Promise<GetUnreadCountResponse> {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  }

  // ===========================
  // Advanced Features
  // ===========================

  /**
   * Get grouped notifications
   */
  public async getGroupedNotifications(params?: {
    groupBy?: string;
    limit?: number;
  }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.get("/notifications/grouped", { params });
    return response.data;
  }

  /**
   * Get notification stats
   */
  public async getNotificationStats(): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.get("/notifications/stats");
    return response.data;
  }

  /**
   * Delete all read notifications
   */
  public async deleteAllRead(): Promise<DeleteNotificationResponse> {
    const response = await api.delete("/notifications/read");
    return response.data;
  }

  // ===========================
  // Preferences
  // ===========================

  /**
   * Get notification preferences
   */
  public async getPreferences(): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.get("/notifications/preferences");
    return response.data;
  }

  /**
   * Update notification preferences
   */
  public async updatePreferences(data: any): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.put("/notifications/preferences", data);
    return response.data;
  }

  /**
   * Toggle notification channel
   */
  public async toggleChannel(
    channel: string,
    enabled: boolean
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post("/notifications/preferences/toggle-channel", {
      channel,
      enabled,
    });
    return response.data;
  }

  /**
   * Mute notification type
   */
  public async muteType(
    type: NotificationType,
    mutedUntil?: Date
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post("/notifications/preferences/mute-type", {
      type,
      mutedUntil,
    });
    return response.data;
  }

  /**
   * Toggle global mute
   */
  public async toggleGlobalMute(enabled: boolean): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post("/notifications/preferences/global-mute", {
      enabled,
    });
    return response.data;
  }

  // ===========================
  // Push Tokens
  // ===========================

  /**
   * Register push notification token
   */
  public async registerPushToken(
    token: string,
    platform: "web" | "ios" | "android"
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post("/notifications/push-token", {
      token,
      platform,
    });
    return response.data;
  }

  /**
   * Remove push notification token
   */
  public async removePushToken(token: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/notifications/push-token/${token}`);
    return response.data;
  }

  // ===========================
  // Helper Methods
  // ===========================

  /**
   * Get notification icon based on type
   */
  public getNotificationIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      like_need: "❤️",
      follow_user: "/icons/user.svg",
      follow_need: "🔔",
      comment: "💬",
      mention: "📢",
      team_invite: "📨",
      team_join: "🎉",
      task_assigned: "📋",
      task_completed: "✅",
      badge_earned: "🏅",
      level_up: "⬆️",
      daily_bonus: "🎁",
    };
    return icons[type] || "🔔";
  }

  /**
   * Get notification color based on type
   */
  public getNotificationColor(type: NotificationType): string {
    const colors: Record<NotificationType, string> = {
      like_need: "text-red-500",
      follow_user: "text-blue-500",
      follow_need: "text-mblue",
      comment: "text-green-500",
      mention: "text-purple-500",
      team_invite: "text-indigo-500",
      team_join: "text-teal-500",
      task_assigned: "text-orange-500",
      task_completed: "text-green-600",
      badge_earned: "text-yellow-500",
      level_up: "text-morange",
      daily_bonus: "text-pink-500",
    };
    return colors[type] || "text-gray-500";
  }

  /**
   * Get notification title based on type
   */
  public getNotificationTitle(type: NotificationType): string {
    const titles: Record<NotificationType, string> = {
      like_need: "لایک جدید",
      follow_user: "دنبال‌کننده جدید",
      follow_need: "دنبال‌کننده نیاز",
      comment: "کامنت جدید",
      mention: "منشن شدید",
      team_invite: "دعوت به تیم",
      team_join: "عضو جدید تیم",
      task_assigned: "وظیفه جدید",
      task_completed: "وظیفه تکمیل شد",
      badge_earned: "نشان جدید",
      level_up: "ارتقای سطح",
      daily_bonus: "جایزه روزانه",
    };
    return titles[type] || "اعلان جدید";
  }

  /**
   * Format time ago
   */
  public getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "لحظاتی پیش";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} دقیقه پیش`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ساعت پیش`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} روز پیش`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} هفته پیش`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} ماه پیش`;
    return `${Math.floor(seconds / 31536000)} سال پیش`;
  }

  /**
   * Get link for notification based on type and related entity
   */
  public getNotificationLink(notification: INotification): string {
    switch (notification.type) {
      case "like_need":
      case "follow_need":
      case "comment":
        return notification.relatedNeed ? `/network/needs/${notification.relatedNeed}` : "/network";

      case "follow_user":
        const senderId =
          typeof notification.sender === "string" ? notification.sender : notification.sender?._id;
        return senderId ? `/network/users/${senderId}` : "/network";

      case "team_invite":
      case "team_join":
        return notification.relatedTeam ? `/network/teams/${notification.relatedTeam}` : "/network/teams";

      case "task_assigned":
      case "task_completed":
        if (notification.relatedTeam && notification.relatedTask) {
          return `/network/teams/${notification.relatedTeam}`;
        }
        return "/network/teams";

      case "badge_earned":
      case "level_up":
      case "daily_bonus":
        return "/network/profile";

      case "mention":
        if (notification.relatedComment) {
          return notification.relatedNeed
            ? `/network/needs/${notification.relatedNeed}#comment-${notification.relatedComment}`
            : "/network";
        }
        return "/network";

      default:
        return "/network";
    }
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
