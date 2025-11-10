"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { INeed } from "common-types";
import { needService } from "@/services/need.service";
import { useAuth } from "@/contexts/AuthContext";

interface InstagramNeedCardProps {
  need: INeed;
  onUpdate?: () => void;
}

/**
 * InstagramNeedCard - Instagram-style Need Card (Media-Centric)
 */
const InstagramNeedCard: React.FC<InstagramNeedCardProps> = ({ need, onUpdate }) => {
  const { user } = useAuth();
  const router = useRouter();

  // Check if user has liked/followed this need
  const userHasLiked = user && need.upvotes ? need.upvotes.includes(user._id) : false;
  const userIsFollowing = user && need.supporters ? need.supporters.includes(user._id) : false;

  const [isLiked, setIsLiked] = useState(userHasLiked);
  const [likesCount, setLikesCount] = useState(need.upvotes?.length || 0);
  const [isFollowing, setIsFollowing] = useState(userIsFollowing);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Update state when need changes
  React.useEffect(() => {
    setIsLiked(userHasLiked);
    setLikesCount(need.upvotes?.length || 0);
    setIsFollowing(userIsFollowing);
  }, [need, userHasLiked, userIsFollowing]);

  // محاسبه درصد پیشرفت
  const progressPercentage = need.targetAmount
    ? Math.min((need.currentAmount / need.targetAmount) * 100, 100)
    : 0;

  // فرمت اعداد
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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

  // لایک کردن
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("لطفاً ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    const previousLiked = isLiked;
    const previousCount = likesCount;

    try {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      await needService.upvoteNeed(need._id);
    } catch (error) {
      console.error("Like error:", error);
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
    }
  };

  // دابل کلیک برای لایک (مانند اینستاگرام)
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLiked) {
      handleLike(e);
    }
  };

  // ذخیره کردن
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    // TODO: API call to save/unsave
  };

  // دنبال کردن
  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("لطفاً ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    const previousFollowing = isFollowing;

    try {
      setIsFollowing(!isFollowing);
      await needService.supportNeed(need._id);
    } catch (error) {
      console.error("Follow error:", error);
      setIsFollowing(previousFollowing);
    }
  };

  // مشاهده جزئیات نیاز
  const handleViewDetails = () => {
    router.push(`/network/needs/${need._id}`);
  };

  // دریافت اطلاعات کاربر
  const getCreatorName = (): string => {
    if (!need.createdBy) return "کاربر";
    if (typeof need.createdBy === "string") return "کاربر";
    return need.createdBy.name || "کاربر";
  };

  const getCreatorAvatar = (): string => {
    if (!need.createdBy) return "/images/default-avatar.png";
    if (typeof need.createdBy === "string") return "/images/default-avatar.png";
    return need.createdBy.avatar || "/images/default-avatar.png";
  };

  // تعداد تصاویر
  const images = need.images || [];
  const hasMultipleImages = images.length > 1;

  // رفتن به عکس بعدی/قبلی
  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header - User Info */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Link href={`/network/profile/${need.createdBy}`} onClick={(e) => e.stopPropagation()}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <OptimizedImage
                  src={getCreatorAvatar()}
                  alt={getCreatorName()}
                  width={28}
                  height={28}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
            </div>
          </Link>
          <div>
            <Link
              href={`/network/profile/${need.createdBy}`}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-sm hover:text-gray-600"
            >
              {getCreatorName()}
            </Link>
            <p className="text-xs text-gray-500">{getTimeAgo()}</p>
          </div>
        </div>
        <button className="text-gray-700 hover:text-gray-900">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* Media Section - Images/Video Carousel */}
      {images.length > 0 ? (
        <div className="relative w-full aspect-square bg-black" onDoubleClick={handleDoubleClick}>
          <OptimizedImage
            src={images[currentImageIndex]}
            alt={need.title}
            width={600}
            height={600}
            className="w-full h-full object-contain"
          />

          {/* Image Navigation */}
          {hasMultipleImages && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {currentImageIndex < images.length - 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        // Placeholder if no image
        <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">📸</div>
            <p className="text-gray-400 text-sm">بدون تصویر</p>
          </div>
        </div>
      )}

      {/* Actions Section - Instagram Style */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button onClick={handleLike} className="hover:opacity-60 transition-opacity">
              {isLiked ? (
                <svg className="w-7 h-7 text-red-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
            </button>

            {/* Comment */}
            <Link href={`/network/needs/${need._id}#comments`} onClick={(e) => e.stopPropagation()}>
              <button className="hover:opacity-60 transition-opacity">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </Link>

            {/* Share */}
            <button className="hover:opacity-60 transition-opacity">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>

          {/* Save/Bookmark */}
          <button onClick={handleSave} className="hover:opacity-60 transition-opacity">
            {isSaved ? (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Likes Count */}
        {likesCount > 0 && (
          <div className="font-semibold text-sm mb-2">{formatNumber(likesCount)} پسندیدن</div>
        )}

        {/* Caption */}
        <div className="text-sm">
          <Link
            href={`/network/profile/${need.createdBy}`}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold hover:text-gray-600"
          >
            {getCreatorName()}
          </Link>{" "}
          <span className="text-gray-900">
            <span className="font-bold">{need.title}</span>
            {need.description && need.description.length > 100 ? (
              <>
                {" "}
                {need.description.substring(0, 100)}...{" "}
                <Link
                  href={`/network/needs/${need._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  بیشتر
                </Link>
              </>
            ) : (
              need.description && ` ${need.description}`
            )}
          </span>
        </div>

        {/* Tags */}
        {need.tags && need.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 text-sm text-mblue">
            {need.tags.slice(0, 3).map((tag, index) => (
              <span key={index}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Comments Preview */}
        {need.commentsCount && need.commentsCount > 0 && (
          <Link
            href={`/network/needs/${need._id}#comments`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-gray-500 hover:text-gray-700 mt-2 block"
          >
            مشاهده همه {formatNumber(need.commentsCount)} دیدگاه
          </Link>
        )}

        {/* Progress Bar - Compact Version */}
        {need.targetAmount && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">پیشرفت پروژه</span>
              <span className="text-xs font-bold text-morange">{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-morange to-orange-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>💰 {formatNumber(need.currentAmount)} تومان</span>
              <span>🎯 {formatNumber(need.targetAmount)} تومان</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleFollow}
            className={`flex-1 font-semibold py-2 px-4 rounded-lg transition-colors ${
              isFollowing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-mblue hover:bg-blue-600 text-white"
            }`}
          >
            {isFollowing ? "در حال حمایت ✓" : "حمایت از این نیاز"}
          </button>

          <button
            onClick={handleViewDetails}
            className="flex-1 bg-morange hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            مشاهده جزئیات
          </button>
        </div>
      </div>
    </article>
  );
};

export default InstagramNeedCard;
