"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { INeed } from "common-types";
import { needService } from "@/services/need.service";
import { useAuth } from "@/contexts/AuthContext";

interface InstagramNeedCardProps {
  need: INeed;
  onUpdate?: () => void;
}

const InstagramNeedCard: React.FC<InstagramNeedCardProps> = ({ need }) => {
  const { user } = useAuth();
  const router = useRouter();
  const lastTap = useRef<number>(0);

  // --- Derived State & Logic ---
  const userHasLiked = useMemo(
    () => (user && need.upvotes ? need.upvotes.includes(user._id) : false),
    [user, need.upvotes],
  );

  const userIsFollowing = useMemo(
    () => (user && need.supporters ? need.supporters.includes(user._id) : false),
    [user, need.supporters],
  );

  // --- Local State ---
  const [isLiked, setIsLiked] = useState(userHasLiked);
  const [likesCount, setLikesCount] = useState(need.upvotes?.length || 0);
  const [isFollowing, setIsFollowing] = useState(userIsFollowing);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  const isLikingRef = useRef(false);
  const isFollowingRef = useRef(false);

  // Sync state with props
  React.useEffect(() => {
    setIsLiked(userHasLiked);
    setLikesCount(need.upvotes?.length || 0);
    setIsFollowing(userIsFollowing);
  }, [need, userHasLiked, userIsFollowing]);

  // --- Helpers ---
  const progressPercentage = need.targetAmount
    ? Math.min((need.currentAmount / need.targetAmount) * 100, 100)
    : 0;

  const formatNumber = (num: number) => new Intl.NumberFormat("fa-IR").format(num);

  const formatCompactNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR", {
      notation: "compact",
      compactDisplay: "short",
    }).format(num);
  };

  const getTimeAgo = () => {
    const diff = Date.now() - new Date(need.createdAt).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "لحظاتی پیش";
    if (hours < 24) return `${hours.toLocaleString("fa-IR")} ساعت پیش`;
    const days = Math.floor(hours / 24);
    return `${days.toLocaleString("fa-IR")} روز پیش`;
  };

  const creator = useMemo(() => {
    if (need.createdBy && typeof need.createdBy === "object") {
      return {
        name: need.createdBy.name || "کاربر",
        avatar: need.createdBy.avatar || "/images/default-avatar.png",
        id: need.createdBy._id || "",
      };
    }
    if (need.submittedBy?.user && typeof need.submittedBy.user === "object") {
      return {
        name: need.submittedBy.user.name || "کاربر",
        avatar: need.submittedBy.user.avatar || "/images/default-avatar.png",
        id: need.submittedBy.user._id || "",
      };
    }
    return {
      name: need.submittedBy?.guestName || "کاربر مهمان",
      avatar: "/images/default-avatar.png",
      id: "",
    };
  }, [need]);

  const images = need.images || [];

  // --- Handlers ---
  const handleLike = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!user) return alert("لطفاً ابتدا وارد حساب کاربری خود شوید");
    if (isLikingRef.current) return;
    
    isLikingRef.current = true;

    const prevLiked = isLiked;
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await needService.upvoteNeed(need._id);
    } catch {
      setIsLiked(prevLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    } finally {
      isLikingRef.current = false;
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!isLiked) handleLike();
      setShowHeartOverlay(true);
      setTimeout(() => setShowHeartOverlay(false), 1000);
    }
    lastTap.current = now;
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("لطفاً ابتدا وارد حساب کاربری خود شوید");
    if (isFollowingRef.current) return;
    
    isFollowingRef.current = true;

    const prevFollowing = isFollowing;
    setIsFollowing(!isFollowing);

    try {
      await needService.supportNeed(need._id);
    } catch {
      setIsFollowing(prevFollowing);
    } finally {
      isFollowingRef.current = false;
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-[#fdfdfd] rounded-lg mb-8 overflow-hidden relative border border-white"
      style={{
        // Modern Soft Shadow for depth
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.08), 0 0 2px rgba(0,0,0,0.05)",
      }}
    >
      {/* --- Header --- */}
      <header className="flex items-center justify-between px-5 py-4 bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100/50">
        <div className="flex items-center gap-3.5">
          <Link href={`/network/profile/${creator.id}`} className="relative group">
            {/* Skeuomorphic Avatar Ring */}
            <div className="w-[46px] h-[46px] rounded-full p-[3px] bg-gradient-to-tr from-gray-200 to-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_2px_5px_rgba(0,0,0,0.1)]">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100">
                <OptimizedImage
                  src={creator.avatar}
                  alt={creator.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Online/Status Indicator (Optional) */}
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
            </div>
          </Link>

          <div className="flex flex-col">
            <Link
              href={`/network/profile/${creator.id}`}
              className="font-bold text-gray-800 text-[15px] hover:text-[#007acc] transition-colors"
            >
              {creator.name}
            </Link>
            <time className="text-xs text-gray-400 font-medium mt-0.5">{getTimeAgo()}</time>
          </div>
        </div>

        <button
          aria-label="More options"
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </header>

      {/* --- Media Section --- */}
      <div
        className="relative w-full aspect-square bg-gray-100 cursor-pointer group overflow-hidden"
        onClick={handleDoubleTap}
      >
        {images.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <OptimizedImage
                  src={images[currentImageIndex]}
                  alt={need.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Heart Overlay Animation */}
            <AnimatePresence>
              {showHeartOverlay && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -50 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                >
                  <svg
                    className="w-28 h-28 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glassmorphic Navigation Controls */}
            {images.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => Math.max(0, prev - 1));
                    }}
                    disabled={currentImageIndex === 0}
                    className="pointer-events-auto p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-lg disabled:opacity-0 hover:bg-white/40 transition-all active:scale-90"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => Math.min(images.length - 1, prev + 1));
                    }}
                    disabled={currentImageIndex === images.length - 1}
                    className="pointer-events-auto p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-lg disabled:opacity-0 hover:bg-white/40 transition-all active:scale-90"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-black/10 backdrop-blur-md border border-white/10">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex
                          ? "w-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                          : "w-1.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 text-gray-400 inner-shadow">
            <svg className="w-16 h-16 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium opacity-60">بدون تصویر</span>
          </div>
        )}
      </div>

      {/* --- Action Bar --- */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-5">
            <motion.button
              onClick={handleLike}
              whileTap={{ scale: 0.85 }}
              className="focus:outline-none group"
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <svg
                className={`w-[28px] h-[28px] transition-all duration-300 ${
                  isLiked
                    ? "text-red-500 fill-red-500 drop-shadow-md"
                    : "text-gray-700 fill-transparent group-hover:text-gray-500"
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={isLiked ? 0 : 1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </motion.button>

            <Link href={`/network/needs/${need._id}#comments`} aria-label="Comments">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="focus:outline-none text-gray-700 hover:text-gray-500 transition-colors"
              >
                <svg
                  className="w-[28px] h-[28px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </motion.button>
            </Link>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="focus:outline-none text-gray-700 hover:text-gray-500 transition-colors -rotate-12 hover:rotate-0 duration-300"
              aria-label="Share"
            >
              <svg
                className="w-[28px] h-[28px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </motion.button>
          </div>

          <motion.button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            whileTap={{ scale: 0.9 }}
            className="focus:outline-none text-gray-700 hover:text-gray-900"
            aria-label="Save"
          >
            <svg
              className={`w-[28px] h-[28px] transition-colors ${
                isSaved ? "fill-gray-800 text-gray-800" : "fill-transparent"
              }`}
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </motion.button>
        </div>

        {/* --- Content Info --- */}
        <div className="space-y-2.5">
          {likesCount > 0 && (
            <div className="font-bold text-sm text-gray-900">{formatCompactNumber(likesCount)} پسندیدن</div>
          )}

          <div className="text-[15px] leading-7 text-gray-800">
            <span className="font-bold ml-2">{creator.name}</span>
            <span className="font-semibold text-gray-900">{need.title}</span>
            {need.description && (
              <span className="text-gray-600 font-light block mt-1">
                {need.description.length > 100 ? (
                  <>
                    {need.description.substring(0, 100)}...
                    <Link
                      href={`/network/needs/${need._id}`}
                      className="text-[#007acc] text-xs mr-1 font-medium hover:underline"
                    >
                      بیشتر بخوانید
                    </Link>
                  </>
                ) : (
                  need.description
                )}
              </span>
            )}
          </div>

          {/* Tags */}
          {need.tags && need.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {need.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium text-[#007acc] bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* --- Skeuomorphic Progress Section --- */}
        {need.targetAmount && (
          <div className="mt-6 mb-4 p-5 rounded-2xl bg-[#f5f7fa] border border-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.8)] relative">
            <div className="flex items-end justify-between mb-3">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 font-medium mb-1">جمع‌آوری شده</span>
                <span className="text-base font-bold text-gray-800 font-mono tracking-tight">
                  {formatNumber(need.currentAmount)}{" "}
                  <span className="text-[10px] text-gray-400 font-sans">تومان</span>
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[11px] text-gray-500 font-medium mb-1">هدف نهایی</span>
                <span className="text-base font-bold text-gray-800 font-mono tracking-tight">
                  {formatNumber(need.targetAmount)}{" "}
                  <span className="text-[10px] text-gray-400 font-sans">تومان</span>
                </span>
              </div>
            </div>

            {/* Realistic 3D Progress Bar */}
            <div className="h-4 w-full bg-gray-200 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.5)] relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full rounded-full relative"
                style={{
                  // Skeuomorphic Liquid Gradient
                  background: `linear-gradient(180deg, #66b3ff 0%, #007acc 50%, #005c99 100%)`,
                  boxShadow: "0 2px 5px rgba(0, 122, 204, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                {/* Shine/Gloss Effect */}
                <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/40 to-transparent rounded-t-full" />
                {/* Animated Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>

            <div className="mt-2 flex justify-end">
              <span className="text-[11px] font-bold text-[#007acc] bg-blue-50 px-2 py-0.5 rounded-md shadow-sm border border-blue-100">
                {progressPercentage.toFixed(0)}% تکمیل شده
              </span>
            </div>
          </div>
        )}

        {/* --- Footer Actions --- */}
        <footer className="mt-5 flex gap-4">
          {/* Primary Action: Skeuomorphic Button */}
          <motion.button
            onClick={handleFollow}
            whileHover={{ y: -1 }}
            whileTap={{ y: 1, scale: 0.98 }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all relative overflow-hidden group ${
              isFollowing ? "bg-gray-100 text-gray-600 border border-gray-200 shadow-inner" : "text-white"
            }`}
            style={
              !isFollowing
                ? {
                    background: "linear-gradient(180deg, #3399ff 0%, #007acc 100%)",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 122, 204, 0.3), 0 2px 4px -1px rgba(0, 122, 204, 0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
                    border: "1px solid rgba(0, 92, 153, 0.1)",
                  }
                : {}
            }
          >
            {!isFollowing && (
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            {isFollowing ? "دنبال می‌کنید" : "حمایت مالی"}
          </motion.button>

          {/* Secondary Action: Soft Button */}
          <motion.button
            onClick={() => router.push(`/network/needs/${need._id}`)}
            whileHover={{ y: -1, backgroundColor: "#f9fafb" }}
            whileTap={{ y: 1 }}
            className="flex-1 bg-white text-gray-700 font-semibold text-sm py-3 px-4 rounded-xl border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.03),0_1px_0_rgba(255,255,255,1)] hover:border-gray-300 transition-all"
          >
            جزئیات بیشتر
          </motion.button>
        </footer>

        {need.commentsCount && need.commentsCount > 0 ? (
          <Link
            href={`/network/needs/${need._id}#comments`}
            className="block mt-5 text-gray-400 text-xs hover:text-gray-600 transition-colors text-center"
          >
            مشاهده تمام {formatCompactNumber(need.commentsCount)} دیدگاه
          </Link>
        ) : null}
      </div>
    </motion.article>
  );
};

export default InstagramNeedCard;
