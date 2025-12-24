"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { needService } from "@/services/need.service";
import { useAuth } from "@/contexts/AuthContext";
import { INeed } from "common-types";
import SmartButton from "@/components/ui/SmartButton";

// Components
import NeedHeader from "@/components/network/needCard_DetailPage/NeedHeader";
import NeedInfo from "@/components/network/needCard_DetailPage/NeedInfo";
import NeedProjectDetails from "@/components/network/needCard_DetailPage/NeedProjectDetails";
import NeedActions from "@/components/network/needCard_DetailPage/NeedActions";
import NeedComments from "@/components/network/needCard_DetailPage/NeedComments";
import NeedSidebar from "@/components/network/needCard_DetailPage/NeedSidebar";

// Icons
import { ArrowRight } from "lucide-react"; // فرض بر استفاده از lucide-react برای آیکون‌ها

const NeedDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const needId = params.id as string;

  // --- State Management ---
  const [need, setNeed] = useState<INeed | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction States
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // Comment States
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);

  // --- Effects ---
  useEffect(() => {
    if (needId) {
      const initData = async () => {
        setIsLoading(true);
        try {
          await Promise.all([fetchNeed(), fetchComments()]);
        } catch (err: any) {
          setError(err.message || "خطا در بارگذاری اطلاعات");
        } finally {
          setIsLoading(false);
        }
      };
      initData();
    }
  }, [needId]);

  useEffect(() => {
    if (need && user) {
      setIsLiked(need.upvotes?.includes(user._id) || false);
      setIsFollowing(need.supporters?.includes(user._id) || false);
      setLikesCount(need.upvotes?.length || 0);
    }
  }, [need, user]);

  // --- Data Fetching ---
  const fetchNeed = async () => {
    const fetchedNeed = await needService.getNeedById(needId);
    setNeed(fetchedNeed);
    setLikesCount(fetchedNeed.upvotes?.length || 0);
  };

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const fetchedComments = await needService.getComments(needId);
      setComments(fetchedComments);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // --- Handlers ---
  const handleLike = async () => {
    if (!user) return alert("لطفاً برای پسندیدن وارد شوید");
    const prevLiked = isLiked;

    // Optimistic UI Update
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await needService.upvoteNeed(needId);
    } catch {
      setIsLiked(prevLiked); // Revert on error
      setLikesCount((prev) => (prevLiked ? prev + 1 : prev - 1));
    }
  };

  const handleFollow = async () => {
    if (!user) return alert("لطفاً برای دنبال کردن وارد شوید");
    const prevFollowing = isFollowing;

    // Optimistic UI Update
    setIsFollowing(!isFollowing);

    try {
      await needService.supportNeed(needId);
    } catch {
      setIsFollowing(prevFollowing);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    try {
      setIsSubmittingComment(true);
      const newComment = await needService.createComment(needId, commentText);
      setComments([newComment, ...comments]);
      setCommentText("");
    } catch (error: any) {
      alert(error.message || "خطا در ارسال نظر");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // --- Render States ---
  if (isLoading) return <NeedSkeletonLoader />;
  if (error || !need) return <ErrorState error={error} onBack={() => router.push("/network")} />;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f2f4f8] text-gray-800 font-sans pb-16 sm:pb-20">
        {/* Sticky Header with Glassmorphism */}
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 flex items-center">
            <Link
              href="/network"
              className="group flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-[#007acc] transition-colors duration-200"
            >
              <div className="p-1 sm:p-1.5 rounded-full bg-gray-100 group-hover:bg-[#007acc]/10 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="font-bold text-xs sm:text-sm">بازگشت به شبکه</span>
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-6 md:mt-8 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
            {/* Main Content Column (Left/Center) */}
            <article className="lg:col-span-8 space-y-4 sm:space-y-6 md:space-y-8">
              {/* Main Card - Skeuomorphic Style */}
              <section className="bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden relative">
                {/* Decorative Top Gradient */}
                <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-[#007acc] to-[#005fa3]" />

                <div className="p-0">
                  <NeedHeader need={need} isFollowing={isFollowing} onFollow={handleFollow} />

                  <div className="px-3 py-3 sm:px-4 sm:py-3 md:px-6 md:py-4">
                    <NeedInfo need={need} />
                  </div>

                  <div className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2">
                    <NeedProjectDetails need={need} />
                  </div>

                  <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 bg-gray-50/50 border-t border-gray-100">
                    <NeedActions
                      isLiked={isLiked}
                      likesCount={likesCount}
                      commentsCount={comments.length}
                      sharesCount={need.sharesCount || 0}
                      onLike={handleLike}
                      onSupport={handleFollow}
                    />
                  </div>
                </div>
              </section>

              {/* Comments Section */}
              <section className="bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 border-r-2 sm:border-r-4 border-[#007acc] pr-2 sm:pr-3">
                  نظرات و گفتگوها
                </h3>
                <NeedComments
                  comments={comments}
                  commentText={commentText}
                  setCommentText={setCommentText}
                  onSubmit={handleSubmitComment}
                  isSubmitting={isSubmittingComment}
                  isLoading={isLoadingComments}
                />
              </section>
            </article>

            {/* Sidebar Column (Right) */}
            <aside className="lg:col-span-4 space-y-4 sm:space-y-5 md:space-y-6">
              <div className="lg:sticky lg:top-20">
                <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden">
                  <NeedSidebar
                    need={need}
                    likesCount={likesCount}
                    commentsCount={comments.length}
                    onFinancialSupport={() => alert("به زودی...")}
                  />
                </div>

                {/* Optional: Helper Card */}
                <div className="mt-4 sm:mt-5 md:mt-6 bg-gradient-to-br from-[#007acc] to-[#005fa3] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-lg shadow-blue-500/20">
                  <h4 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2">آیا می‌خواهید کمک کنید؟</h4>
                  <p className="text-blue-100 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                    با حمایت از این نیاز، شما مستقیماً در حل یک چالش واقعی مشارکت می‌کنید.
                  </p>
                  <button
                    onClick={handleFollow}
                    className="w-full py-2.5 sm:py-3 bg-white text-[#007acc] font-bold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-md active:scale-95 transition-transform duration-200"
                  >
                    {isFollowing ? "دنبال می‌کنید" : "حمایت از این نیاز"}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

// --- Sub-Components for UI States ---

const NeedSkeletonLoader = () => (
  <div className="min-h-screen bg-[#f2f4f8] pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 px-3 sm:px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
      <div className="lg:col-span-8 space-y-4 sm:space-y-5 md:space-y-6">
        <div className="bg-white rounded-xl sm:rounded-2xl h-64 sm:h-80 md:h-96 shadow-sm animate-pulse"></div>
        <div className="bg-white rounded-xl sm:rounded-2xl h-32 sm:h-36 md:h-40 shadow-sm animate-pulse"></div>
      </div>
      <div className="lg:col-span-4">
        <div className="bg-white rounded-xl sm:rounded-2xl h-60 sm:h-72 md:h-80 shadow-sm animate-pulse lg:sticky lg:top-20"></div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onBack }: { error: string | null; onBack: () => void }) => (
  <div className="flex items-center justify-center min-h-screen bg-[#f2f4f8] px-3 sm:px-4">
    <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] text-center max-w-md w-full border border-gray-100">
      <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
        <span className="text-2xl sm:text-3xl">⚠️</span>
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1.5 sm:mb-2">مشکلی پیش آمده</h2>
      <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-7 md:mb-8">{error || "نیاز مورد نظر یافت نشد یا حذف شده است."}</p>
      <SmartButton variant="mblue" size="lg" onClick={onBack} className="w-full shadow-lg shadow-blue-500/30">
        بازگشت به صفحه اصلی
      </SmartButton>
    </div>
  </div>
);

export default NeedDetailPage;
