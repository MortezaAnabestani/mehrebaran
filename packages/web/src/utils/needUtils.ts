import { INeed } from "common-types";

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString("fa-IR");
};

export const getDaysRemaining = (deadline?: Date | string): string => {
  if (!deadline) return "";
  const now = new Date();
  const d = new Date(deadline);
  const diff = d.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return "منقضی شده";
  if (days === 0) return "امروز";
  return `${days} روز مانده`;
};

export const getUrgencyInfo = (urgency: string = "medium") => {
  const urgencyMap: any = {
    low: { label: "عادی", color: "bg-gray-100 text-gray-700", icon: "⚪" },
    medium: { label: "متوسط", color: "bg-blue-100 text-blue-700", icon: "🔵" },
    high: { label: "فوری", color: "bg-orange-100 text-orange-700", icon: "🟠" },
    critical: { label: "بحرانی", color: "bg-red-100 text-red-700", icon: "🔴" },
  };
  return urgencyMap[urgency] || urgencyMap.medium;
};

export const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: "پیش‌نویس",
    pending: "در انتظار بررسی",
    under_review: "در حال بررسی",
    approved: "تایید شده",
    in_progress: "در حال اجرا",
    completed: "تکمیل شده",
    rejected: "رد شده",
    archived: "آرشیو شده",
    cancelled: "لغو شده",
  };
  return statusMap[status] || status;
};

export const getCreatorName = (need: INeed | null): string => {
  if (!need?.createdBy) return "کاربر";
  if (typeof need.createdBy === "string") return "کاربر";
  return need.createdBy.name || "کاربر";
};

export const getCreatorAvatar = (need: INeed | null): string => {
  if (!need?.createdBy) return "/images/default-avatar.png";
  if (typeof need.createdBy === "string") return "/images/default-avatar.png";
  const avatar = need.createdBy.avatar;
  return avatar && avatar.trim() !== "" ? avatar : "/images/default-avatar.png";
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getFileInfo = (url: string, fileName?: string) => {
  const name = fileName || url.split("/").pop() || "فایل";
  const extension = name.split(".").pop()?.toLowerCase() || "";
  let icon = "📄";
  let color = "bg-gray-100 text-gray-700";

  if (["pdf"].includes(extension)) {
    icon = "📕";
    color = "bg-red-100 text-red-700";
  } else if (["doc", "docx"].includes(extension)) {
    icon = "📘";
    color = "bg-blue-100 text-blue-700";
  } else if (["xls", "xlsx", "csv"].includes(extension)) {
    icon = "📗";
    color = "bg-green-100 text-green-700";
  } else if (["ppt", "pptx"].includes(extension)) {
    icon = "📙";
    color = "bg-orange-100 text-orange-700";
  } else if (["zip", "rar", "7z"].includes(extension)) {
    icon = "🗜️";
    color = "bg-purple-100 text-purple-700";
  }

  return { name, extension: extension.toUpperCase(), icon, color };
};
