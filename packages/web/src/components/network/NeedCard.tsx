"use client";

import React, { useState } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { INeed } from "common-types";
import { needService } from "@/services/need.service";
import { useAuth } from "@/contexts/AuthContext";

interface NeedCardProps {
  need: INeed;
  variant?: "feed" | "compact";
  onUpdate?: () => void;
}

/**
 * NeedCard - کارت نمایش نیاز در فید
 */
const NeedCard: React.FC<NeedCardProps> = ({ need, variant = "feed", onUpdate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(need.likesCount || 0);
  const [isFollowing, setIsFollowing] = useState(false);

  // محاسبه درصد پیشرفت
  const progressPercentage = need.targetAmount
    ? Math.min((need.currentAmount / need.targetAmount) * 100, 100)
    : 0;

  // فرمت اعداد به فارسی
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // محاسبه روزهای باقی‌مانده
  const getDaysRemaining = (): string => {
    if (!need.deadline) return "";
    const now = new Date();
    const deadline = new Date(need.deadline);
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return "منقضی شده";
    if (days === 0) return "امروز";
    return `${days} روز مانده`;
  };

  // محاسبه زمان گذشته
  const getTimeAgo = (): string => {
    const now = new Date();
    const created = new Date(need.createdAt);
    const diff = now.getTime() - created.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "چند دقیقه پیش";
    if (hours < 24) return `${hours} ساعت پیش`;
    const days = Math.floor(hours / 24);
    return `${days} روز پیش`;
  };

  // لایک کردن نیاز
  // لایک کردن نیاز
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isLiked) {
        // ✅ استفاده از متد صحیح برای حذف لایک
        await needService.unvoteNeed(need._id);
        setLikesCount((prev) => prev - 1);
      } else {
        // ✅ استفاده از متد صحیح برای لایک کردن
        await needService.upvoteNeed(need._id);
        setLikesCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
      // onUpdate?.(); // این خط را می‌توان موقتاً کامنت کرد تا از رفرش کل لیست جلوگیری شود
    } catch (error) {
      console.error("Upvote error:", error);
      // در صورت خطا، وضعیت را به حالت قبل برمی‌گردانیم تا UI با واقعیت هماهنگ باشد
      if (isLiked) {
        setLikesCount((prev) => prev + 1);
      } else {
        setLikesCount((prev) => prev - 1);
      }
    }
  };

  // حمایت (دنبال) کردن نیاز
  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isFollowing) {
        // ✅ استفاده از متد صحیح برای لغو حمایت
        await needService.unsupportNeed(need._id);
      } else {
        // ✅ استفاده از متد صحیح برای حمایت
        await needService.supportNeed(need._id);
      }
      setIsFollowing(!isFollowing);
      // onUpdate?.();
    } catch (error) {
      console.error("Support error:", error);
    }
  };

  // دریافت نام کاربر
  const getCreatorName = (): string => {
    if (!need.createdBy) return "کاربر";
    if (typeof need.createdBy === "string") return "کاربر";
    return need.createdBy.name || "کاربر";
  };

  // دریافت آواتار کاربر
  const getCreatorAvatar = (): string => {
    if (!need.createdBy) return "/images/default-avatar.png";
    if (typeof need.createdBy === "string") return "/images/default-avatar.png";
    return need.createdBy.avatar || "/images/default-avatar.png";
  };

  if (variant === "compact") {
    return (
      <Link href={`/network/needs/${need._id}`}>
        <div className="bg-white rounded-md p-4 shadow-sm hover:shadow-md transition-shadow border border-mgray/20">
          <h3 className="font-bold text-sm line-clamp-2">{need.title}</h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
            <span>👍 {formatNumber(likesCount)}</span>
            <span>💬 {formatNumber(need.commentsCount || 0)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/network/needs/${need._id}`}>
      <div className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow border border-mgray/20 overflow-hidden">
        {/* Header - User Info */}
        <div className="flex items-center justify-between p-4 border-b border-mgray/20">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <OptimizedImage src={getCreatorAvatar()} alt={getCreatorName()} fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-sm">{getCreatorName()}</h4>
              <p className="text-xs text-gray-500">{getTimeAgo()}</p>
            </div>
          </div>
          <button className="text-gray-500 hover:text-mblue">⋯</button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h2 className="font-extrabold text-lg mb-2 line-clamp-2">{need.title}</h2>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-3 line-clamp-3">{need.description}</p>

          {/* Tags */}
          {need.tags && need.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {need.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs bg-mblue/10 text-mblue px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Image */}
          {need.images && need.images.length > 0 && (
            <div className="relative w-full h-48 rounded-md overflow-hidden mb-3">
              <OptimizedImage src={need.images[0]} alt={need.title} fill className="object-cover" />
            </div>
          )}

          {/* Progress Bar */}
          {need.targetAmount && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-700">پیشرفت:</span>
                <span className="text-xs font-bold text-morange">{progressPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-mgray/30 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-morange h-full rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-600">
                  💰 {formatNumber(need.currentAmount)} / {formatNumber(need.targetAmount)} ریال
                </span>
                {need.deadline && <span className="text-xs text-gray-600">⏰ {getDaysRemaining()}</span>}
              </div>
            </div>
          )}

          {/* Team Info */}
          {need.team && (
            <div className="bg-mgray/10 rounded-md p-2 mb-3 text-xs">
              <span className="font-bold">👥 تیم: </span>
              {typeof need.team === "string" ? "تیم موجود" : `${need.team.members?.length || 0} نفر`}
            </div>
          )}
        </div>

        {/* Footer - Actions */}
        <div className="flex items-center justify-between p-4 border-t border-mgray/20">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm ${
                isLiked ? "text-morange" : "text-gray-600"
              } hover:text-morange transition-colors`}
            >
              <span>{isLiked ? "👍" : "👍"}</span>
              <span className="font-bold">{formatNumber(likesCount)}</span>
            </button>

            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-mblue transition-colors">
              <span>💬</span>
              <span className="font-bold">{formatNumber(need.commentsCount || 0)}</span>
            </button>

            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-mblue transition-colors">
              <span>🔁</span>
              <span className="font-bold">{formatNumber(need.sharesCount || 0)}</span>
            </button>
          </div>

          <button
            onClick={handleFollow}
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isFollowing ? "bg-mgray text-gray-700" : "bg-mblue text-white hover:bg-mblue/80"
            } transition-colors`}
          >
            {isFollowing ? "دنبال‌شده ✓" : "دنبال کردن"}
          </button>
        </div>

        {/* Trending Badge */}
        {need.isTrending && (
          <div className="absolute top-2 left-2 bg-morange text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            🔥 Trending
          </div>
        )}
      </div>
    </Link>
  );
};

export default NeedCard;
