"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { needService } from "@/services/need.service";
import { useAuth } from "@/contexts/AuthContext";
import { INeed } from "common-types";

const NeedDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const needId = params.id as string;

  // State
  const [need, setNeed] = useState<INeed | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction states
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // Comment form
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  // دریافت اطلاعات نیاز
  const fetchNeed = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedNeed = await needService.getNeedById(needId);
      setNeed(fetchedNeed);
      setLikesCount(fetchedNeed.upvotes?.length || 0);

      // Check if user has liked/followed this need
      if (user) {
        setIsLiked(fetchedNeed.upvotes?.includes(user._id) || false);
        setIsFollowing(fetchedNeed.supporters?.includes(user._id) || false);
      }
    } catch (err: any) {
      console.error("Failed to fetch need:", err);
      setError(err.message || "خطا در دریافت اطلاعات نیاز");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (needId) {
      fetchNeed();
    }
  }, [needId]);

  // محاسبه درصد پیشرفت
  const getProgressPercentage = (): number => {
    if (!need?.targetAmount) return 0;
    return Math.min((need.currentAmount / need.targetAmount) * 100, 100);
  };

  // فرمت اعداد
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString("fa-IR");
  };

  // محاسبه روزهای باقی‌مانده
  const getDaysRemaining = (): string => {
    if (!need?.deadline) return "";
    const now = new Date();
    const deadline = new Date(need.deadline);
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return "منقضی شده";
    if (days === 0) return "امروز";
    return `${days} روز مانده`;
  };

  // لایک کردن (toggle upvote)
  const handleLike = async () => {
    try {
      // Both like and unlike use the same endpoint (toggle)
      await needService.likeNeed(needId);
      // Optimistic update
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      // Refresh to get accurate data
      await fetchNeed();
    } catch (error) {
      console.error("Like error:", error);
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(need?.upvotes?.length || 0);
    }
  };

  // دنبال کردن (toggle support)
  const handleFollow = async () => {
    try {
      // Both follow and unfollow use the same endpoint (toggle)
      await needService.followNeed(needId);
      // Optimistic update
      setIsFollowing(!isFollowing);
      // Refresh to get accurate data
      await fetchNeed();
    } catch (error) {
      console.error("Follow error:", error);
      // Revert on error
      setIsFollowing(isFollowing);
    }
  };

  // ارسال کامنت
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      // TODO: Add comment API integration
      alert("قابلیت ثبت نظر به زودی فعال خواهد شد.");
      setCommentText("");
    } catch (error) {
      console.error("Comment error:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // دریافت نام کاربر
  const getCreatorName = (): string => {
    if (!need?.createdBy) return "کاربر";
    if (typeof need.createdBy === "string") return "کاربر";
    return need.createdBy.name || "کاربر";
  };

  // دریافت آواتار کاربر
  const getCreatorAvatar = (): string => {
    if (!need?.createdBy) return "/images/default-avatar.png";
    if (typeof need.createdBy === "string") return "/images/default-avatar.png";
    return need.createdBy.avatar || "/images/default-avatar.png";
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mblue mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !need) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || "نیاز یافت نشد"}</p>
            <SmartButton variant="mblue" size="sm" onClick={() => router.push("/network")}>
              بازگشت به شبکه
            </SmartButton>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-mgray/5 pb-10">
        {/* Header */}
        <div className="bg-white border-b border-mgray/20 py-4">
          <div className="w-9/10 md:w-8/10 mx-auto">
            <Link href="/network" className="text-mblue hover:underline text-sm">
              ← بازگشت به شبکه
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-9/10 md:w-8/10 mx-auto mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Need Card */}
              <div className="bg-white rounded-md shadow-sm border border-mgray/20 overflow-hidden">
                {/* Creator Info */}
                <div className="flex items-center justify-between p-6 border-b border-mgray/20">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <OptimizedImage
                        src={getCreatorAvatar()}
                        alt={getCreatorName()}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{getCreatorName()}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(need.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleFollow}
                    className={`text-xs font-bold px-4 py-2 rounded-full ${
                      isFollowing ? "bg-mgray text-gray-700" : "bg-mblue text-white hover:bg-mblue/80"
                    } transition-colors`}
                  >
                    {isFollowing ? "دنبال‌شده ✓" : "دنبال کردن"}
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h1 className="text-2xl font-extrabold mb-4">{need.title}</h1>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        need.status === "active"
                          ? "bg-green-100 text-green-700"
                          : need.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {need.status === "active"
                        ? "فعال"
                        : need.status === "completed"
                        ? "تکمیل شده"
                        : need.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed mb-6">{need.description}</p>

                  {/* Tags */}
                  {need.tags && need.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {need.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-mblue/10 text-mblue px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Images */}
                  {need.images && need.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {need.images.map((image, index) => (
                        <div key={index} className="relative w-full h-48 rounded-md overflow-hidden">
                          <OptimizedImage src={image} alt={`تصویر ${index + 1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Progress Section */}
                  {need.targetAmount && (
                    <div className="bg-mgray/10 rounded-md p-6 mb-6">
                      <h3 className="font-bold text-lg mb-4">پیشرفت پروژه</h3>
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-gray-700">میزان پیشرفت:</span>
                          <span className="text-sm font-bold text-morange">
                            {getProgressPercentage().toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-mgray/30 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-morange h-full rounded-full transition-all"
                            style={{ width: `${getProgressPercentage()}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">مبلغ جمع‌آوری شده:</p>
                          <p className="text-lg font-bold text-mblue">
                            {formatNumber(need.currentAmount)} ریال
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">هدف مالی:</p>
                          <p className="text-lg font-bold text-gray-700">
                            {formatNumber(need.targetAmount)} ریال
                          </p>
                        </div>
                      </div>
                      {need.deadline && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-600 mb-1">مهلت زمانی:</p>
                          <p className="text-sm font-bold text-morange">⏰ {getDaysRemaining()}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Team Info */}
                  {need.team && (
                    <div className="bg-mblue/5 rounded-md p-4 mb-6">
                      <h3 className="font-bold mb-2">👥 اطلاعات تیم</h3>
                      <p className="text-sm text-gray-700">
                        {typeof need.team === "string"
                          ? "تیم موجود"
                          : `تعداد اعضا: ${need.team.members?.length || 0} نفر`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between p-6 border-t border-mgray/20">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 ${
                        isLiked ? "text-morange" : "text-gray-600"
                      } hover:text-morange transition-colors`}
                    >
                      <span className="text-xl">{isLiked ? "👍" : "👍"}</span>
                      <span className="font-bold">{formatNumber(likesCount)}</span>
                    </button>

                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-xl">💬</span>
                      <span className="font-bold">{formatNumber(need.commentsCount || 0)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-xl">🔁</span>
                      <span className="font-bold">{formatNumber(need.sharesCount || 0)}</span>
                    </div>
                  </div>

                  <SmartButton variant="morange" size="md">
                    حمایت کنید
                  </SmartButton>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-md shadow-sm border border-mgray/20 p-6">
                <h3 className="font-bold text-lg mb-4">نظرات ({need.commentsCount || 0})</h3>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="نظر خود را بنویسید..."
                    className="w-full p-4 border border-mgray/30 rounded-md focus:outline-mblue/50 mb-3"
                    rows={3}
                    disabled={isSubmittingComment}
                  />
                  <SmartButton
                    type="submit"
                    variant="mblue"
                    size="sm"
                    disabled={isSubmittingComment || !commentText.trim()}
                  >
                    {isSubmittingComment ? "در حال ارسال..." : "ارسال نظر"}
                  </SmartButton>
                </form>

                {/* Comments List */}
                <div className="text-center text-gray-500 text-sm py-8">هنوز نظری ثبت نشده است.</div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Support Card */}
              <div className="bg-white rounded-md shadow-sm border border-mgray/20 p-6">
                <h3 className="font-bold text-lg mb-4">حمایت از این نیاز</h3>
                <p className="text-sm text-gray-700 mb-4">
                  با حمایت مالی خود، به تحقق این نیاز کمک کنید و در ساخت آینده بهتر سهیم شوید.
                </p>
                <SmartButton variant="morange" size="md" className="w-full">
                  حمایت مالی
                </SmartButton>
              </div>

              {/* Category Card */}
              <div className="bg-white rounded-md shadow-sm border border-mgray/20 p-6">
                <h3 className="font-bold text-lg mb-4">دسته‌بندی</h3>
                <p className="text-sm bg-mblue/10 text-mblue px-3 py-2 rounded-md inline-block">
                  {need.category === "educational"
                    ? "آموزشی"
                    : need.category === "health"
                    ? "بهداشت و سلامت"
                    : need.category === "infrastructure"
                    ? "زیرساخت"
                    : need.category === "social"
                    ? "اجتماعی"
                    : need.category === "cultural"
                    ? "فرهنگی"
                    : "عمومی"}
                </p>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-md shadow-sm border border-mgray/20 p-6">
                <h3 className="font-bold text-lg mb-4">آمار</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">بازدید:</span>
                    <span className="font-bold">{formatNumber(need.viewsCount || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">لایک:</span>
                    <span className="font-bold">{formatNumber(likesCount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">نظرات:</span>
                    <span className="font-bold">{formatNumber(need.commentsCount || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">اشتراک:</span>
                    <span className="font-bold">{formatNumber(need.sharesCount || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NeedDetailPage;
