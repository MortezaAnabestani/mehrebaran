"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import NotificationItem from "@/components/notifications/NotificationItem";
import notificationService, {
  type INotification,
  type NotificationType,
} from "@/services/notification.service";

// ===========================
// Types & Constants
// ===========================

type Filter = "all" | "unread" | "read";

// Custom Neumorphic Styles (Tailwind Arbitrary Values helper)
const neumorphic = {
  raised: "bg-[#e0e5ec] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]",
  inset:
    "bg-[#e0e5ec] shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]",
  btnBase:
    "transition-all duration-300 ease-in-out rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95",
  card: "bg-[#e0e5ec] rounded-2xl p-6 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] border border-white/20",
};

// ===========================
// Notifications Content Component
// ===========================

const NotificationsContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type");
  const rawFilter = searchParams.get("filter");
  
  let selectedType: NotificationType | "all" = "all";
  if (rawType === "likes") {
    selectedType = "like_need";
  } else if (rawType && typeof rawType === "string") {
    selectedType = rawType as NotificationType;
  }
  
  const activeFilter: Filter = (rawFilter as Filter) || "all";

  // State
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const updateUrlParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // ===========================
  // Data Fetching
  // ===========================

  const fetchNotifications = async (abortSignal?: AbortSignal) => {
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
      
      if (abortSignal?.aborted) return;

      let filteredNotifications = response.data;

      if (selectedType !== "all") {
        filteredNotifications = filteredNotifications.filter((n) => n.type === selectedType);
      }

      setNotifications(filteredNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      if (!abortSignal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  const fetchUnreadCount = async (abortSignal?: AbortSignal) => {
    try {
      const response = await notificationService.getUnreadCount();
      if (abortSignal?.aborted) return;
      // Ensure unreadCount is a valid number to prevent NaN in React children
      const count = Number(response?.data?.unreadCount);
      setUnreadCount(isNaN(count) ? 0 : count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchNotifications(controller.signal);
    fetchUnreadCount(controller.signal);
    
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!confirm("آیا مطمئن هستید که می‌خواهید همه اعلان‌ها را حذف کنید؟")) return;
    try {
      await notificationService.deleteAllNotifications();
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  const handleNotificationUpdate = () => {
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
    if (type === "all") return "همه دسته‌ها";
    return notificationService.getNotificationTitle(type);
  };

  const notificationTypes: (NotificationType | "all")[] = [
    "all",
    "like_need",
    "follow_user",
    "comment",
    "mention",
    "team_invite",
    "task_assigned",
    "badge_earned",
    "level_up",
  ];

  // ===========================
  // Render
  // ===========================

  return (
    <ProtectedRoute>
      {/* Main Container with Neumorphic Base Color */}
      <main className="min-h-screen text-gray-700 py-10 font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3 drop-shadow-sm">
                <span className="text-[#007acc] text-4xl drop-shadow-md">🔔</span>
                مرکز اعلان‌ها
              </h1>
              <p className="text-gray-500 mt-2 text-sm font-medium">
                {unreadCount > 0
                  ? `شما ${unreadCount} اعلان جدید برای بررسی دارید`
                  : "همه چیز به‌روز است، اعلان جدیدی ندارید"}
              </p>
            </div>

            {/* Global Actions */}
            <div className="flex gap-4">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className={`${neumorphic.btnBase} ${neumorphic.raised} px-5 py-2.5 text-[#007acc] hover:text-blue-600`}
                  aria-label="Mark all as read"
                >
                  <span className="text-lg">✓</span>
                  <span className="text-sm">خوانده‌شدن همه</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className={`${neumorphic.btnBase} ${neumorphic.raised} px-5 py-2.5 text-red-500 hover:text-red-600`}
                  aria-label="Delete all notifications"
                >
                  <span className="text-lg">🗑️</span>
                  <span className="text-sm">حذف همه</span>
                </button>
              )}
            </div>
          </header>

          {/* Stats Widgets */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Stats */}
            <div className={`${neumorphic.card} flex flex-col items-center justify-center`}>
              <span className="text-3xl font-bold text-gray-700 mb-1">{notifications.length}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">کل اعلان‌ها</span>
            </div>

            {/* Unread Stats */}
            <div
              className={`${neumorphic.card} flex flex-col items-center justify-center relative overflow-hidden`}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[#007acc]"></div>
              <span className="text-3xl font-bold text-[#007acc] mb-1">{unreadCount}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">خوانده نشده</span>
            </div>

            {/* Read Stats */}
            <div className={`${neumorphic.card} flex flex-col items-center justify-center`}>
              <span className="text-3xl font-bold text-green-600 mb-1">
                {notifications.length - unreadCount}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">آرشیو شده</span>
            </div>
          </section>

          {/* Filters & Controls */}
          <nav className={`${neumorphic.card} mb-8 p-6 space-y-6`} aria-label="Notification Filters">
            {/* Status Filter (Segmented Control Look) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-sm font-bold text-gray-600 min-w-[60px]">وضعیت:</span>
              <div className={`flex-1 p-1.5 rounded-xl ${neumorphic.inset} flex flex-wrap gap-2`}>
                {(["all", "unread", "read"] as Filter[]).map((filter) => {
                  const isActive = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => updateUrlParams("filter", filter)}
                      className={`
                        flex-1 min-w-[100px] py-2 rounded-lg text-sm font-semibold transition-all duration-200
                        ${
                          isActive
                            ? `bg-[#007acc] text-white shadow-md transform scale-[1.02]`
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        }
                      `}
                    >
                      {getFilterLabel(filter)}
                      {filter === "unread" && unreadCount > 0 && (
                        <span
                          className={`mr-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                            isActive ? "bg-white text-[#007acc]" : "bg-[#007acc] text-white"
                          }`}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Type Filter (Chips) */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <span className="text-sm font-bold text-gray-600 min-w-[60px] pt-2">نوع:</span>
              <div className="flex flex-wrap gap-3">
                {notificationTypes.map((type) => {
                  const isActive = selectedType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => updateUrlParams("type", type)}
                      className={`
                        px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200
                        ${
                          isActive
                            ? `${neumorphic.inset} border-[#007acc]/30 text-[#007acc]`
                            : `${neumorphic.raised} border-transparent text-gray-500 hover:text-gray-700`
                        }
                      `}
                    >
                      {getTypeLabel(type)}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Notifications List */}
          <section aria-label="Notifications List" className="space-y-5 min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-60">
                <div className="w-12 h-12 border-4 border-[#007acc] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">در حال بارگذاری اعلان‌ها...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div
                className={`${neumorphic.inset} rounded-2xl flex flex-col items-center justify-center py-20 text-center`}
              >
                <div className="w-20 h-20 bg-[#e0e5ec] rounded-full flex items-center justify-center shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] mb-6">
                  <span className="text-4xl text-gray-400">📭</span>
                </div>
                <h3 className="text-lg font-bold text-gray-600 mb-2">لیست خالی است</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  {activeFilter === "unread"
                    ? "تبریک! شما همه اعلان‌های خود را بررسی کرده‌اید."
                    : "هنوز هیچ اعلانی در این بخش ثبت نشده است."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <article
                    key={notification._id}
                    className="transition-transform duration-300 hover:-translate-y-1"
                  >
                    <NotificationItem
                      notification={notification}
                      onRead={handleNotificationUpdate}
                      onDelete={handleNotificationUpdate}
                    />
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Load More Button */}
          {!isLoading && notifications.length >= 50 && (
            <div className="mt-10 text-center">
              <button
                className={`${neumorphic.btnBase} ${neumorphic.raised} px-8 py-3 text-gray-600 hover:text-[#007acc]`}
              >
                نمایش اعلان‌های قدیمی‌تر
              </button>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default function NotificationsClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>}>
      <NotificationsContent />
    </Suspense>
  );
}
