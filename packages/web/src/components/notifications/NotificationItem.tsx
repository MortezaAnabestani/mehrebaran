"use client";

import React, { useState } from "react";
import Link from "next/link";
import notificationService, {
  type INotification,
} from "@/services/notification.service";
import type { IUser } from "@/types/user";

// ===========================
// Types & Interfaces
// ===========================

export interface NotificationItemProps {
  notification: INotification;
  onRead?: () => void;
  onDelete?: () => void;
}

// ===========================
// NotificationItem Component
// ===========================

/**
 * A single notification item component
 * Displays notification icon, message, time, and actions
 */
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // ===========================
  // Event Handlers
  // ===========================

  const handleClick = async () => {
    // Mark as read when clicked
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification._id);
        if (onRead) onRead();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await notificationService.deleteNotification(notification._id);
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting notification:", error);
      setIsDeleting(false);
    }
  };

  // ===========================
  // Helper Functions
  // ===========================

  const getSenderName = (): string => {
    if (!notification.sender) return "سیستم";
    if (typeof notification.sender === "string") return "کاربر";
    return (notification.sender as IUser).name || "کاربر";
  };

  const getSenderAvatar = (): string | null => {
    if (!notification.sender) return null;
    if (typeof notification.sender === "string") return null;
    return (notification.sender as IUser).avatar || null;
  };

  // ===========================
  // Render
  // ===========================

  const icon = notificationService.getNotificationIcon(notification.type);
  const color = notificationService.getNotificationColor(notification.type);
  const title = notificationService.getNotificationTitle(notification.type);
  const timeAgo = notificationService.getTimeAgo(notification.createdAt);
  const link = notificationService.getNotificationLink(notification);
  const senderName = getSenderName();
  const senderAvatar = getSenderAvatar();

  return (
    <Link href={link} onClick={handleClick}>
      <div
        className={`relative flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
          notification.isRead
            ? "bg-white border-gray-200"
            : "bg-blue-50 border-blue-200"
        } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Unread Indicator */}
        {!notification.isRead && (
          <div className="absolute top-4 right-4 w-2 h-2 bg-mblue rounded-full"></div>
        )}

        {/* Icon/Avatar */}
        <div className="flex-shrink-0">
          {senderAvatar ? (
            <img
              src={senderAvatar}
              alt={senderName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : notification.sender ? (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mblue to-cyan-500 flex items-center justify-center text-white font-bold">
              {senderName.charAt(0)}
            </div>
          ) : (
            <div
              className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl ${color}`}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-lg ${color}`}>{icon}</span>
            <span className="font-semibold text-gray-900 text-sm">
              {title}
            </span>
          </div>

          {/* Message */}
          <p className="text-gray-700 text-sm mb-2 line-clamp-2">
            {notification.message}
          </p>

          {/* Sender (if exists) */}
          {notification.sender && (
            <p className="text-xs text-gray-500 mb-1">از: {senderName}</p>
          )}

          {/* Time */}
          <p className="text-xs text-gray-400">{timeAgo}</p>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2"
          title="حذف اعلان"
        >
          {isDeleting ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>
      </div>
    </Link>
  );
};

export default NotificationItem;
