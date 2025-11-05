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

  // Comment states
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);

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

  // دریافت نظرات
  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const fetchedComments = await needService.getComments(needId);
      setComments(fetchedComments);
    } catch (err: any) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (needId) {
      fetchNeed();
      fetchComments();
    }
  }, [needId]);

  // Sync state with need data when it changes
  useEffect(() => {
    if (need && user) {
      const userHasLiked = need.upvotes ? need.upvotes.includes(user._id) : false;
      const userIsFollowing = need.supporters ? need.supporters.includes(user._id) : false;
      setIsLiked(userHasLiked);
      setIsFollowing(userIsFollowing);
      setLikesCount(need.upvotes?.length || 0);
    }
  }, [need, user]);

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
    if (!user) {
      alert("لطفاً ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    try {
      // Store previous state for revert
      const previousLiked = isLiked;
      const previousCount = likesCount;

      // Optimistic update first (instant UI feedback)
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      // Call API
      await needService.likeNeed(needId);

      // No refetch needed - optimistic update is enough
    } catch (error) {
      console.error("Like error:", error);
      // Revert on error
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
    }
  };

  // دنبال کردن (toggle support)
  const handleFollow = async () => {
    if (!user) {
      alert("لطفاً ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    try {
      // Store previous state for revert
      const previousFollowing = isFollowing;

      // Optimistic update first (instant UI feedback)
      setIsFollowing(!isFollowing);

      // Call API
      await needService.followNeed(needId);

      // No refetch needed - optimistic update is enough
    } catch (error) {
      console.error("Follow error:", error);
      // Revert on error
      setIsFollowing(previousFollowing);
    }
  };

  // حمایت کردن (همان follow)
  const handleSupport = () => {
    handleFollow();
  };

  // حمایت مالی
  const handleFinancialSupport = () => {
    if (!user) {
      alert("لطفاً ابتدا وارد حساب کاربری خود شوید");
      return;
    }
    // TODO: Implement financial support modal/page
    alert("قابلیت حمایت مالی به زودی فعال خواهد شد. شما می‌توانید با دنبال کردن این نیاز، از آن حمایت کنید.");
  };

  // ارسال کامنت
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!user) {
      alert("لطفاً ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    try {
      setIsSubmittingComment(true);
      const newComment = await needService.createComment(needId, commentText);

      // Add new comment to the top of the list
      setComments([newComment, ...comments]);

      // Update comments count in need
      if (need) {
        setNeed({ ...need, commentsCount: (need.commentsCount || 0) + 1 });
      }

      setCommentText("");
    } catch (error: any) {
      console.error("Comment error:", error);
      alert(error.message || "خطا در ارسال نظر");
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

  // دریافت اطلاعات urgency level
  const getUrgencyInfo = () => {
    const urgency = need?.urgencyLevel || "medium";
    const urgencyMap = {
      low: { label: "عادی", color: "bg-gray-100 text-gray-700", icon: "⚪" },
      medium: { label: "متوسط", color: "bg-blue-100 text-blue-700", icon: "🔵" },
      high: { label: "فوری", color: "bg-orange-100 text-orange-700", icon: "🟠" },
      critical: { label: "بحرانی", color: "bg-red-100 text-red-700", icon: "🔴" },
    };
    return urgencyMap[urgency as keyof typeof urgencyMap] || urgencyMap.medium;
  };

  // دریافت نام وضعیت به فارسی
  const getStatusLabel = (status: string) => {
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

  // محاسبه بودجه کل از budgetItems
  const getTotalBudget = (): number => {
    if (!need?.budgetItems || need.budgetItems.length === 0) return 0;
    return need.budgetItems.reduce((sum: number, item: any) => sum + (item.estimatedCost || 0), 0);
  };

  // محاسبه مبلغ جمع‌آوری شده از budgetItems
  const getTotalRaised = (): number => {
    if (!need?.budgetItems || need.budgetItems.length === 0) return 0;
    return need.budgetItems.reduce((sum: number, item: any) => sum + (item.amountRaised || 0), 0);
  };

  // محاسبه درصد پیشرفت بودجه
  const getBudgetProgress = (): number => {
    const total = getTotalBudget();
    if (total === 0) return 0;
    const raised = getTotalRaised();
    return Math.min((raised / total) * 100, 100);
  };

  // دریافت آیکون و اطلاعات فایل
  const getFileInfo = (url: string, fileName?: string) => {
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
    } else if (["txt", "md"].includes(extension)) {
      icon = "📝";
      color = "bg-gray-100 text-gray-700";
    } else if (["zip", "rar", "7z"].includes(extension)) {
      icon = "🗜️";
      color = "bg-purple-100 text-purple-700";
    }

    return { name, extension: extension.toUpperCase(), icon, color };
  };

  // فرمت سایز فایل
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

                  {/* Status & Urgency Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        need.status === "approved" || need.status === "in_progress"
                          ? "bg-green-100 text-green-700"
                          : need.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : need.status === "pending" || need.status === "under_review"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {getStatusLabel(need.status)}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        getUrgencyInfo().color
                      }`}
                    >
                      {getUrgencyInfo().icon} {getUrgencyInfo().label}
                    </span>
                    {need.deadline && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-morange/10 text-morange">
                        ⏰ {getDaysRemaining()}
                      </span>
                    )}
                  </div>

                  {/* Submitted By */}
                  {need.submittedBy && (
                    <div className="mb-4 text-sm text-gray-600">
                      <span className="font-bold">ارسال‌کننده:</span>{" "}
                      {need.submittedBy.user
                        ? typeof need.submittedBy.user === "string"
                          ? "کاربر"
                          : need.submittedBy.user.name
                        : need.submittedBy.guestName || "مهمان"}
                    </div>
                  )}

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

                  {/* Additional Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Location */}
                    {need.location && (
                      <div className="bg-mgray/5 rounded-md p-4">
                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2">📍 موقعیت مکانی</h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          {need.location.address && <p>{need.location.address}</p>}
                          {(need.location.city || need.location.province) && (
                            <p>
                              {need.location.city}
                              {need.location.city && need.location.province && "، "}
                              {need.location.province}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Estimated Duration */}
                    {need.estimatedDuration && (
                      <div className="bg-mgray/5 rounded-md p-4">
                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2">⏱️ مدت زمان تخمینی</h4>
                        <p className="text-sm text-gray-700">{need.estimatedDuration}</p>
                      </div>
                    )}
                  </div>

                  {/* Required Skills */}
                  {need.requiredSkills && need.requiredSkills.length > 0 && (
                    <div className="bg-mblue/5 rounded-md p-4 mb-6">
                      <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                        🎯 مهارت‌های مورد نیاز
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {need.requiredSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs bg-white border border-mblue/20 text-mblue px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {need.attachments && need.attachments.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-base mb-3">
                        📎 فایل‌های پیوست ({need.attachments.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {need.attachments.map((attachment: any, index: number) => (
                          <div key={index}>
                            {attachment.fileType === "image" && (
                              <div className="relative w-full h-48 rounded-md overflow-hidden group cursor-pointer">
                                <OptimizedImage
                                  src={attachment.url}
                                  alt={attachment.fileName || `تصویر ${index + 1}`}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                              </div>
                            )}
                            {attachment.fileType === "video" && (
                              <div className="relative w-full h-48 rounded-md overflow-hidden bg-black">
                                <video src={attachment.url} controls className="w-full h-full object-contain">
                                  مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                                </video>
                                {attachment.fileName && (
                                  <p className="text-xs text-gray-500 mt-1 truncate">{attachment.fileName}</p>
                                )}
                              </div>
                            )}
                            {attachment.fileType === "audio" && (
                              <div className="bg-mgray/10 rounded-md p-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-2xl">🎵</span>
                                  <div className="flex-1 min-w-0">
                                    {attachment.fileName && (
                                      <p className="text-sm font-bold truncate">{attachment.fileName}</p>
                                    )}
                                    {attachment.fileSize && (
                                      <p className="text-xs text-gray-500">
                                        {formatFileSize(attachment.fileSize)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <audio src={attachment.url} controls className="w-full">
                                  مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
                                </audio>
                              </div>
                            )}
                            {attachment.fileType === "document" && (
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-mgray/10 rounded-md p-4 hover:bg-mgray/20 transition-colors border border-mgray/20"
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`text-3xl flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center ${
                                      getFileInfo(attachment.url, attachment.fileName).color
                                    }`}
                                  >
                                    {getFileInfo(attachment.url, attachment.fileName).icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">
                                      {getFileInfo(attachment.url, attachment.fileName).name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs font-bold text-mblue">
                                        {getFileInfo(attachment.url, attachment.fileName).extension}
                                      </span>
                                      {attachment.fileSize && (
                                        <>
                                          <span className="text-xs text-gray-400">•</span>
                                          <span className="text-xs text-gray-500">
                                            {formatFileSize(attachment.fileSize)}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-mblue">
                                      <span>دانلود</span>
                                      <span>↓</span>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Budget Section */}
                  {need.budgetItems && need.budgetItems.length > 0 && (
                    <div className="bg-mgray/10 rounded-md p-6 mb-6">
                      <h3 className="font-bold text-lg mb-4">💰 بودجه پروژه</h3>
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-gray-700">میزان پیشرفت:</span>
                          <span className="text-sm font-bold text-morange">
                            {getBudgetProgress().toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-mgray/30 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-morange h-full rounded-full transition-all"
                            style={{ width: `${getBudgetProgress()}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">مبلغ جمع‌آوری شده:</p>
                          <p className="text-lg font-bold text-mblue">
                            {formatNumber(getTotalRaised())} ریال
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">بودجه کل:</p>
                          <p className="text-lg font-bold text-gray-700">
                            {formatNumber(getTotalBudget())} ریال
                          </p>
                        </div>
                      </div>

                      {/* Budget Items List */}
                      <div className="mt-6 space-y-3">
                        <h4 className="font-bold text-sm mb-2">اقلام بودجه:</h4>
                        {need.budgetItems.map((item: any, index: number) => (
                          <div key={item._id || index} className="bg-white rounded-md p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h5 className="font-bold text-sm">{item.title}</h5>
                                {item.description && (
                                  <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                                )}
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  item.status === "fully_funded"
                                    ? "bg-green-100 text-green-700"
                                    : item.status === "partial"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {item.status === "fully_funded"
                                  ? "تامین شده"
                                  : item.status === "partial"
                                  ? "در حال تامین"
                                  : "در انتظار"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-600">{item.category}</span>
                              <span className="font-bold">
                                {formatNumber(item.amountRaised || 0)} / {formatNumber(item.estimatedCost)}{" "}
                                ریال
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                              <div
                                className="bg-mblue h-full rounded-full"
                                style={{
                                  width: `${Math.min(
                                    ((item.amountRaised || 0) / item.estimatedCost) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Milestones Section */}
                  {need.milestones && need.milestones.length > 0 && (
                    <div className="bg-mblue/5 rounded-md p-6 mb-6">
                      <h3 className="font-bold text-lg mb-4">🎯 نقاط عطف پروژه</h3>
                      <div className="space-y-4">
                        {need.milestones
                          .sort((a: any, b: any) => a.order - b.order)
                          .map((milestone: any, index: number) => (
                            <div key={milestone._id || index} className="bg-white rounded-md p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-sm">{milestone.title}</h4>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    milestone.status === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : milestone.status === "in_progress"
                                      ? "bg-blue-100 text-blue-700"
                                      : milestone.status === "delayed"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {milestone.status === "completed"
                                    ? "✓ تکمیل شده"
                                    : milestone.status === "in_progress"
                                    ? "در حال اجرا"
                                    : milestone.status === "delayed"
                                    ? "تاخیر"
                                    : "در انتظار"}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                <span>
                                  مهلت: {new Date(milestone.targetDate).toLocaleDateString("fa-IR")}
                                </span>
                                <span className="font-bold text-mblue">{milestone.progressPercentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-mblue h-full rounded-full"
                                  style={{ width: `${milestone.progressPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Updates/Timeline Section */}
                  {need.updates && need.updates.length > 0 && (
                    <div className="bg-morange/5 rounded-md p-6 mb-6">
                      <h3 className="font-bold text-lg mb-4">📰 به‌روزرسانی‌های پروژه</h3>
                      <div className="space-y-4">
                        {need.updates
                          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 5)
                          .map((update: any, index: number) => (
                            <div key={index} className="bg-white rounded-md p-4 border-r-4 border-morange">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-sm">{update.title}</h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(update.date).toLocaleDateString("fa-IR")}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{update.description}</p>
                            </div>
                          ))}
                      </div>
                      {need.updates.length > 5 && (
                        <p className="text-xs text-center text-gray-500 mt-4">
                          و {need.updates.length - 5} به‌روزرسانی دیگر...
                        </p>
                      )}
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
                      <span className="font-bold">{formatNumber(comments.length || 0)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-xl">🔁</span>
                      <span className="font-bold">{formatNumber(need.sharesCount || 0)}</span>
                    </div>
                  </div>

                  <SmartButton variant="morange" size="md" onClick={handleSupport}>
                    حمایت کنید
                  </SmartButton>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-md shadow-sm border border-mgray/20 p-6">
                <h3 className="font-bold text-lg mb-4">نظرات ({comments.length || 0})</h3>

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
                {isLoadingComments ? (
                  <div className="text-center text-gray-500 text-sm py-8">در حال بارگذاری نظرات...</div>
                ) : comments.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8">هنوز نظری ثبت نشده است.</div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment._id} className="border-b border-mgray/10 pb-4 last:border-b-0">
                        <div className="flex gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <OptimizedImage
                              src={comment.user?.avatar || "/images/default-avatar.png"}
                              alt={comment.user?.name || "کاربر"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-sm">{comment.user?.name || "کاربر"}</h4>
                              <p className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                              </p>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-3 mr-8 space-y-3">
                                {comment.replies.map((reply: any) => (
                                  <div key={reply._id} className="flex gap-2">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                      <OptimizedImage
                                        src={reply.user?.avatar || "/images/default-avatar.png"}
                                        alt={reply.user?.name || "کاربر"}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <h5 className="font-bold text-xs">{reply.user?.name || "کاربر"}</h5>
                                        <p className="text-xs text-gray-500">
                                          {new Date(reply.createdAt).toLocaleDateString("fa-IR")}
                                        </p>
                                      </div>
                                      <p className="text-xs text-gray-700">{reply.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                <SmartButton variant="morange" size="md" className="w-full" onClick={handleFinancialSupport}>
                  حمایت مالی
                </SmartButton>
              </div>

              {/* Category Card */}
              <div className="bg-white rounded-md shadow-sm border border-mgray/20 p-6">
                <h3 className="font-bold text-lg mb-4">دسته‌بندی</h3>
                <p className="text-sm bg-mblue/10 text-mblue px-3 py-2 rounded-md inline-block">
                  {typeof need.category === "string" ? need.category : need.category?.name || "عمومی"}
                </p>
              </div>

              {/* Supporters Card */}
              {need.supporters && need.supporters.length > 0 && (
                <div className="bg-white rounded-md shadow-sm border border-mgray/20 p-6">
                  <h3 className="font-bold text-lg mb-4">👥 حامیان ({need.supporters.length})</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {need.supporters.slice(0, 10).map((supporter: any, index: number) => (
                      <div key={supporter._id || index} className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <OptimizedImage
                            src={
                              typeof supporter === "string"
                                ? "/images/default-avatar.png"
                                : supporter.avatar || "/images/default-avatar.png"
                            }
                            alt={typeof supporter === "string" ? "حامی" : supporter.name || "حامی"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">
                            {typeof supporter === "string" ? "حامی" : supporter.name || "حامی"}
                          </p>
                        </div>
                      </div>
                    ))}
                    {need.supporters.length > 10 && (
                      <p className="text-xs text-center text-gray-500 pt-2">
                        و {need.supporters.length - 10} حامی دیگر...
                      </p>
                    )}
                  </div>
                </div>
              )}

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
                    <span className="font-bold">{formatNumber(comments.length || 0)}</span>
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
