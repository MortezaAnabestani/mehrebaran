"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
 * آیکون‌های SVG داخلی برای پرهیز از وابستگی‌های خارجی و حفظ پرفورمنس
 */
const Icons = {
  Heart: ({ filled }: { filled: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
        filled ? "scale-110" : "scale-100"
      }`}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Message: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 sm:w-5 sm:h-5"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Share: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 sm:w-5 sm:h-5"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  ),
  Clock: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Users: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  More: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 sm:w-5 sm:h-5"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
};

/**
 * NeedCard - کارت نمایش نیاز با طراحی Skeuomorphic مدرن و ریسپانسیو
 */
const NeedCard: React.FC<NeedCardProps> = ({ need, variant = "feed", onUpdate }) => {
  const { user } = useAuth();
  const router = useRouter();

  // State Logic
  const userHasLiked = user && need.upvotes ? need.upvotes.includes(user._id) : false;
  const userIsFollowing = user && need.supporters ? need.supporters.includes(user._id) : false;

  const [isLiked, setIsLiked] = useState(userHasLiked);
  const [likesCount, setLikesCount] = useState(need.upvotes?.length || 0);
  const [isFollowing, setIsFollowing] = useState(userIsFollowing);

  React.useEffect(() => {
    setIsLiked(userHasLiked);
    setLikesCount(need.upvotes?.length || 0);
    setIsFollowing(userIsFollowing);
  }, [need, userHasLiked, userIsFollowing]);

  // Helpers
  const progressPercentage = need.targetAmount
    ? Math.min((need.currentAmount / need.targetAmount) * 100, 100)
    : 0;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString("fa-IR");
  };

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

  const getTimeAgo = (): string => {
    const now = new Date();
    const created = new Date(need.createdAt);
    const diff = now.getTime() - created.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "لحظاتی پیش";
    if (hours < 24) return `${hours} ساعت پیش`;
    const days = Math.floor(hours / 24);
    return `${days} روز پیش`;
  };

  // Handlers
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("لطفاً ابتدا وارد حساب کاربری خود شوید");

    const previousLiked = isLiked;
    const previousCount = likesCount;

    try {
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      await needService.upvoteNeed(need._id);
    } catch (error) {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
    }
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("لطفاً ابتدا وارد حساب کاربری خود شوید");

    const previousFollowing = isFollowing;
    try {
      setIsFollowing(!isFollowing);
      await needService.supportNeed(need._id);
    } catch (error) {
      setIsFollowing(previousFollowing);
    }
  };

  const handleViewDetails = () => router.push(`/network/needs/${need._id}`);

  const getCreatorName = (): string => {
    if (!need.createdBy) return "کاربر ناشناس";
    return typeof need.createdBy === "string" ? "کاربر" : need.createdBy.name || "کاربر";
  };

  const getCreatorAvatar = (): string => {
    if (!need.createdBy) return "/images/default-avatar.png";
    return typeof need.createdBy === "string"
      ? "/images/default-avatar.png"
      : need.createdBy.avatar || "/images/default-avatar.png";
  };

  // --- COMPACT VARIANT ---
  if (variant === "compact") {
    return (
      <Link href={`/network/needs/${need._id}`}>
        <div className="group bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,122,204,0.1)] transition-all duration-300 transform hover:-translate-y-1">
          <h3 className="font-bold text-gray-800 text-xs sm:text-sm line-clamp-2 group-hover:text-[#007acc] transition-colors">
            {need.title}
          </h3>
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Icons.Heart filled={false} /> {formatNumber(likesCount)}
            </span>
            <span className="flex items-center gap-1">
              <Icons.Message /> {formatNumber(need.commentsCount || 0)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // --- FEED VARIANT (FULL DESIGN) ---
  return (
    <div className="relative h-100 flex flex-col justify-between bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,122,204,0.15)]">
      {/* Trending Badge - Glassmorphism */}
      {need.isTrending && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
          <div className="bg-morange/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg shadow-morange/30 flex items-center gap-1 animate-pulse">
            <OptimizedImage src="/icons/need.svg" width={18} height={18} alt="need icon" />
            <span>ترند</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 pb-2 sm:pb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#007acc] to-transparent shadow-sm">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-gray-100">
              <OptimizedImage src={getCreatorAvatar()} alt={getCreatorName()} fill className="object-cover" />
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm hover:text-[#007acc] cursor-pointer transition-colors">
              {getCreatorName()}
            </h4>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
              <Icons.Clock />
              <span>{getTimeAgo()}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-[#007acc] p-1.5 sm:p-2 rounded-full hover:bg-blue-50 transition-all">
          <Icons.More />
        </button>
      </div>

      {/* Content Body */}
      <div className="px-3 sm:px-4 md:px-5 py-1 sm:py-2">
        <Link href={`/network/needs/${need._id}`}>
          <h2 className="font-extrabold text-sm sm:text-base md:text-lg text-gray-800 mb-1.5 sm:mb-2 leading-snug hover:text-[#007acc] transition-colors cursor-pointer">
            {need.title}
          </h2>
        </Link>

        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-3">
          {need.description}
        </p>

        {/* Tags - Soft UI Pills */}
        {need.tags && need.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {need.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-[10px] sm:text-[11px] font-medium text-[#007acc] bg-blue-50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg border border-blue-100/50 shadow-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Image - With subtle depth */}
        {need.images && need.images.length > 0 && (
          <div className="relative w-full h-40 sm:h-48 md:h-56 rounded-lg md:rounded-xl overflow-hidden mb-3 sm:mb-4 md:mb-5 shadow-inner bg-gray-50 border border-gray-100">
            <OptimizedImage
              src={need.images[0]}
              alt={need.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        )}

        {/* Progress Section - Skeuomorphic Bar */}
        {need.targetAmount && (
          <div className="mb-3 sm:mb-4 md:mb-5 bg-gray-50 p-3 sm:p-4 rounded-lg md:rounded-xl border border-gray-100/80">
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs text-gray-500 mb-1">مبلغ جمع‌آوری شده</span>
                <span className="text-xs sm:text-sm font-bold text-gray-800">
                  {formatNumber(need.currentAmount)}{" "}
                  <span className="text-[9px] sm:text-[10px] font-normal text-gray-400">ریال</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] sm:text-xs font-bold text-[#007acc] bg-blue-100 px-1.5 py-0.5 sm:px-2 rounded-md">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* The Bar: Inner Shadow for track, Gradient + Drop Shadow for fill */}
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 md:h-3 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{
                  width: `${progressPercentage}%`,
                  background: "linear-gradient(90deg, #007acc 0%, #4fc3f7 100%)",
                  boxShadow: "0 2px 4px rgba(0, 122, 204, 0.3)",
                }}
              >
                {/* Shine effect on bar */}
                <div className="absolute top-0 left-0 w-full h-[50%] bg-white/20 rounded-t-full"></div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
              <span>هدف: {formatNumber(need.targetAmount)} ریال</span>
              {need.deadline && (
                <span
                  className={`flex items-center gap-1 ${
                    getDaysRemaining() === "منقضی شده" ? "text-red-500" : "text-morange"
                  }`}
                >
                  <Icons.Clock /> {getDaysRemaining()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Team Info */}
        {need.team && (
          <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-[10px] sm:text-xs text-gray-500 bg-gray-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg w-fit">
            <Icons.Users />
            <span>
              تیم:{" "}
              {typeof need.team === "string" ? "تیم موجود" : `${need.team.members?.length || 0} عضو فعال`}
            </span>
          </div>
        )}
      </div>

      {/* Footer - Actions Area */}
      <div className="p-3 sm:p-4 bg-gray-50/50 border-t border-gray-100">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Social Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all active:scale-95 ${
                isLiked
                  ? "text-red-500 bg-red-50 shadow-inner"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <Icons.Heart filled={isLiked} />
              <span className="text-[10px] sm:text-xs font-bold">{formatNumber(likesCount)}</span>
            </button>

            <button className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#007acc] transition-all active:scale-95">
              <Icons.Message />
              <span className="text-[10px] sm:text-xs font-bold">
                {formatNumber(need.commentsCount || 0)}
              </span>
            </button>

            <button className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all active:scale-95">
              <Icons.Share />
            </button>
          </div>
          {/* Main CTA Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end sm:justify-center">
            <button
              onClick={handleViewDetails}
              className="hidden sm:block px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 active:shadow-inner active:translate-y-[1px] transition-all"
            >
              جزئیات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeedCard;
