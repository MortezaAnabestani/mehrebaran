"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotificationItem from "@/components/notifications/NotificationItem";
import { SmartButton } from "@/components/SmartButton";
import notificationService, {
  type INotification,
  type NotificationType,
} from "@/services/notification.service";

// ===========================
// Types
// ===========================

type Filter = "all" | "unread" | "read";

// ===========================
// Notifications Page Component
// ===========================

const NotificationsPage: React.FC = () => {
  const router = useRouter();

  // State
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [selectedType, setSelectedType] = useState<NotificationType | "all">(
    "all"
  );
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // ===========================
  // Data Fetching
  // ===========================

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);

      let response;

      if (activeFilter === "unread") {
        response = await notificationService.getUnreadNotifications(50);
      } else if (activeFilter === "read") {
        response = await notificationService.getReadNotifications(50);
      } else {
        response = await notificationService.getNotifications({ limit: 50 });
      }

      let filteredNotifications = response.data;

      // Filter by type if selected
      if (selectedType !== "all") {
        filteredNotifications = filteredNotifications.filter(
          (n) => n.type === selectedType
        );
      }

      setNotifications(filteredNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [activeFilter, selectedType]);

  // ===========================
  // Event Handlers
  // ===========================

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteAll = async () => {
    if (
      !confirm(
        "آیا مطمئن هستید که می‌خواهید همه اعلان‌ها را حذف کنید؟ این عمل قابل بازگشت نیست."
      )
    ) {
      return;
    }

    try {
      await notificationService.deleteAllNotifications();
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  const handleNotificationRead = () => {
    fetchNotifications();
    fetchUnreadCount();
  };

  const handleNotificationDelete = () => {
    fetchNotifications();
    fetchUnreadCount();
  };

  // ===========================
  // Helper Functions
  // ===========================

  const getFilterLabel = (filter: Filter): string => {
    const labels: Record<Filter, string> = {
      all: "همه",
      unread: "خوانده نشده",
      read: "خوانده شده",
    };
    return labels[filter];
  };

  const getTypeLabel = (type: NotificationType | "all"): string => {
    if (type === "all") return "همه انواع";
    return notificationService.getNotificationTitle(type);
  };

  // ===========================
  // Render
  // ===========================

  const notificationTypes: (NotificationType | "all")[] = [
    "all",
    "like_need",
    "follow_user",
    "follow_need",
    "comment",
    "mention",
    "team_invite",
    "team_join",
    "task_assigned",
    "task_completed",
    "badge_earned",
    "level_up",
    "daily_bonus",
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <span className="text-4xl">🔔</span>
                  اعلان‌ها
                </h1>
                <p className="text-gray-600">
                  {unreadCount > 0
                    ? `${unreadCount} اعلان خوانده نشده`
                    : "همه اعلان‌ها خوانده شده"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <SmartButton
                    onClick={handleMarkAllAsRead}
                    variant="outline"
                    size="sm"
                  >
                    ✓ علامت‌گذاری همه
                  </SmartButton>
                )}
                {notifications.length > 0 && (
                  <SmartButton
                    onClick={handleDeleteAll}
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    🗑️ حذف همه
                  </SmartButton>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {notifications.length}
                </div>
                <div className="text-sm text-gray-500">کل اعلان‌ها</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                <div className="text-2xl font-bold text-mblue">
                  {unreadCount}
                </div>
                <div className="text-sm text-gray-600">خوانده نشده</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {notifications.length - unreadCount}
                </div>
                <div className="text-sm text-gray-600">خوانده شده</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
            {/* Read Status Filter */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                وضعیت:
              </label>
              <div className="flex flex-wrap gap-2">
                {(["all", "unread", "read"] as Filter[]).map((filter) => (
                  <SmartButton
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    variant={activeFilter === filter ? "primary" : "outline"}
                    size="sm"
                  >
                    {getFilterLabel(filter)}
                    {filter === "unread" && unreadCount > 0 && (
                      <span className="mr-1 bg-white text-mblue rounded-full px-2 py-0.5 text-xs font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </SmartButton>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                نوع اعلان:
              </label>
              <div className="flex flex-wrap gap-2">
                {notificationTypes.map((type) => (
                  <SmartButton
                    key={type}
                    onClick={() => setSelectedType(type)}
                    variant={selectedType === type ? "primary" : "outline"}
                    size="sm"
                  >
                    {type !== "all" &&
                      notificationService.getNotificationIcon(
                        type as NotificationType
                      )}{" "}
                    {getTypeLabel(type)}
                  </SmartButton>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 border-4 border-mblue border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500">در حال بارگذاری اعلان‌ها...</p>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-400 text-6xl mb-4">🔔</p>
                <p className="text-gray-500 text-lg mb-2">
                  {activeFilter === "unread"
                    ? "اعلان خوانده نشده‌ای وجود ندارد"
                    : activeFilter === "read"
                    ? "اعلان خوانده شده‌ای وجود ندارد"
                    : "اعلانی وجود ندارد"}
                </p>
                <p className="text-gray-400 text-sm">
                  {activeFilter === "unread"
                    ? "همه اعلان‌های شما خوانده شده‌اند ✓"
                    : "وقتی اتفاقی بیفتد، اینجا مطلع می‌شوید"}
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onRead={handleNotificationRead}
                  onDelete={handleNotificationDelete}
                />
              ))
            )}
          </div>

          {/* Load More (if needed) */}
          {!isLoading && notifications.length >= 50 && (
            <div className="mt-6 text-center">
              <SmartButton variant="outline" size="lg">
                بارگذاری بیشتر
              </SmartButton>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NotificationsPage;
