"use client";

import React, { useEffect, useState } from "react";
import notificationService from "@/services/notification.service";

// ===========================
// Types & Interfaces
// ===========================

export interface NotificationBadgeProps {
  /**
   * Refresh interval in milliseconds
   * Default: 30000 (30 seconds)
   */
  refreshInterval?: number;
  /**
   * Callback when count changes
   */
  onCountChange?: (count: number) => void;
  /**
   * Custom className for the badge
   */
  className?: string;
}

// ===========================
// NotificationBadge Component
// ===========================

/**
 * A badge component that displays the count of unread notifications
 * Auto-refreshes at a specified interval
 */
const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  refreshInterval = 30000,
  onCountChange,
  className = "",
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ===========================
  // Data Fetching
  // ===========================

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      const count = response.data.unreadCount;
      setUnreadCount(count);
      if (onCountChange) onCountChange(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();

    // Set up interval for auto-refresh
    const interval = setInterval(fetchUnreadCount, refreshInterval);

    // Cleanup
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // ===========================
  // Render
  // ===========================

  if (isLoading) {
    return (
      <div
        className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gray-200 ${className}`}
      >
        <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (unreadCount === 0) {
    return null;
  }

  // Format count (show 99+ if count > 99)
  const displayCount = unreadCount > 99 ? "99+" : unreadCount.toString();

  return (
    <div
      className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold ${className}`}
      title={`${unreadCount} اعلان خوانده نشده`}
    >
      {displayCount}
    </div>
  );
};

export default NotificationBadge;
