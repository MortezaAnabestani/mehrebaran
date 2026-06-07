"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { needService } from "@/services/need.service";
import { useAuth } from "@/contexts/AuthContext";
import { INeed } from "common-types";

// Components
import NeedHeader from "@/components/network/needCard_DetailPage/NeedHeader";
import NeedInfo from "@/components/network/needCard_DetailPage/NeedInfo";
import NeedProjectDetails from "@/components/network/needCard_DetailPage/NeedProjectDetails";
import NeedActions from "@/components/network/needCard_DetailPage/NeedActions";
import NeedComments, { INeedComment } from "@/components/network/needCard_DetailPage/NeedComments";
import NeedSidebar from "@/components/network/needCard_DetailPage/NeedSidebar";

// Icons
import { ArrowRight } from "lucide-react";

const NeedDetailClient: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const needId = params.id as string;

  const [need, setNeed] = useState<INeed | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const [comments, setComments] = useState<INeedComment[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();

    if (needId) {
      const initData = async () => {
        setIsLoading(true);
        try {
          await Promise.all([
            needService.getNeedById(needId).then((fetchedNeed) => {
              if (controller.signal.aborted) return;
              setNeed(fetchedNeed);
              setLikesCount(fetchedNeed.upvotes?.length || 0);
            }),
            needService.getComments(needId).then((fetchedComments) => {
              if (controller.signal.aborted) return;
              setComments(fetchedComments);
            }),
          ]);
        } catch (err) {
          if (controller.signal.aborted) return;
          const errorMessage = err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات";
          setError(errorMessage);
        } finally {
          if (!controller.signal.aborted) {
            setIsLoading(false);
            setIsLoadingComments(false);
          }
        }
      };
      initData();
    }

    return () => controller.abort();
  }, [needId]);

  useEffect(() => {
    if (need && user) {
      setIsLiked(need.upvotes?.includes(user._id) || false);
      setIsFollowing(need.supporters?.includes(user._id) || false);
      setLikesCount(need.upvotes?.length || 0);
    }
  }, [need, user]);

  const handleLike = async () => {
    if (!user) return alert("لطفاً برای پسندیدن وارد شوید");
    const prevLiked = isLiked;

    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      if (isLiked) {
        await needService.unlikeNeed(needId);
      } else {
        await needService.likeNeed(needId);
      }
    } catch {
      setIsLiked(prevLiked); // Revert on error
      setLikesCount((prev) => (prevLiked ? prev + 1 : prev - 1));
    }
  };

  const handleFollow = async () => {
    if (!user) return alert("لطفاً برای دنبال کردن وارد شوید");
    const prevFollowing = isFollowing;

    setIsFollowing(!isFollowing);

    try {
      if (isFollowing) {
        await needService.unfollowNeed(needId);
      } else {
        await needService.followNeed(needId);
      }
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطا در ارسال نظر";
      alert(errorMessage);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) return <NeedSkeletonLoader />;
  if (error || !need) return <ErrorState error={error} onBack={() => router.push("/network")} />;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f0f2f5] text-slate-700 font-sans pb-16 sm:pb-20">
        <header className="sticky top-0 z-40 w-full bg-[#f0f2f5]/80 backdrop-blur-md border-b border-white/50 shadow-[0_4px_10px_rgba(0,0,0,0.02)] transition-all duration-300">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 flex items-center">
            <Link
              href="/network"
              className="group flex items-center gap-1.5 sm:gap-2 text-slate-500 hover:text-[#007acc] transition-colors duration-200"
            >
              <div className="p-1 sm:p-1.5 rounded-full bg-[#f0f2f5] shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] group-hover:shadow-[inset_2px_2px_5px_#c5c5c5,inset_-2px_-2px_5px_#ffffff] transition-all">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:scale-95 transition-transform" />
              </div>
              <span className="font-bold text-xs sm:text-sm">بازگشت به شبکه</span>
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 mt-3 sm:mt-6 md:mt-8 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 md:gap-8">
            <article className="lg:col-span-8 space-y-4 sm:space-y-6 md:space-y-8">
              <section className="bg-[#f0f2f5] rounded-none sm:rounded-2xl md:rounded-[2rem] shadow-[0_4px_8px_rgba(0,0,0,0.05)] sm:shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] md:shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] border-y sm:border-x border-white/40 overflow-hidden relative transition-all duration-300">
                <div className="p-0">
                  <NeedHeader need={need} isFollowing={isFollowing} onFollow={handleFollow} />

                  <div className="px-3 py-3 sm:px-6 sm:py-5 md:px-8 md:py-6">
                    <NeedInfo need={need} />
                  </div>

                  <div className="px-3 py-1 sm:px-6 sm:py-3 md:px-8 md:py-4">
                    <NeedProjectDetails need={need} />
                  </div>

                  <div className="px-3 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 bg-gray-50/20 border-t border-white/40">
                    <NeedActions
                      isLiked={isLiked}
                      likesCount={likesCount}
                      commentsCount={comments.length}
                      sharesCount={0}
                      onLike={handleLike}
                      onSupport={handleFollow}
                    />
                  </div>
                </div>
              </section>

              <section className="bg-[#f0f2f5] rounded-none sm:rounded-2xl md:rounded-[2rem] shadow-[0_4px_8px_rgba(0,0,0,0.05)] sm:shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] md:shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] border-y sm:border-x border-white/40 p-3 sm:p-6 md:p-8">
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

            <aside className="lg:col-span-4 space-y-4 sm:space-y-5 md:space-y-6">
              <div className="lg:sticky lg:top-20 space-y-4 sm:space-y-6">
                <div className="bg-[#f0f2f5] rounded-none sm:rounded-2xl md:rounded-3xl p-3 sm:p-5 shadow-[0_4px_8px_rgba(0,0,0,0.05)] sm:shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] md:shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] border-y sm:border-x border-white/40 overflow-hidden">
                  <NeedSidebar
                    need={need}
                    likesCount={likesCount}
                    commentsCount={comments.length}
                    onFinancialSupport={() => alert("به زودی...")}
                  />
                </div>

                <div className="bg-[#f0f2f5] rounded-none sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 shadow-[0_4px_8px_rgba(0,0,0,0.05)] sm:shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] md:shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] border-y sm:border-x border-white/40">
                  <h4 className="font-bold text-slate-700 text-base sm:text-lg mb-2">آیا می‌خواهید کمک کنید؟</h4>
                  <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-5 leading-relaxed font-medium">
                    با حمایت از این نیاز، شما مستقیماً در حل یک چالش واقعی مشارکت می‌کنید و به عنوان یک همیار ثبت می‌شوید.
                  </p>
                  <button
                    onClick={handleFollow}
                    className="relative overflow-hidden group w-full py-3 bg-gradient-to-r from-[#007acc] to-[#015ca8] hover:from-[#0069bd] hover:to-[#014c8a] text-white font-semibold text-sm sm:text-base rounded-xl border border-white/10 shadow-[0_4px_14px_rgba(0,122,204,0.3)] hover:shadow-[0_8px_25px_rgba(0,122,204,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.15)] transition-all duration-300 transform select-none"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isFollowing ? "در حال حمایت" : "حمایت از این نیاز"}
                    </span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
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

const NeedSkeletonLoader = () => (
  <div className="min-h-screen bg-[#f0f2f5] pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 px-3 sm:px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
      <div className="lg:col-span-8 space-y-4 sm:space-y-5 md:space-y-6">
        <div className="bg-[#f0f2f5] rounded-[2rem] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] h-64 sm:h-80 md:h-96 animate-pulse"></div>
        <div className="bg-[#f0f2f5] rounded-[2rem] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] h-32 sm:h-36 md:h-40 animate-pulse"></div>
      </div>
      <div className="lg:col-span-4">
        <div className="bg-[#f0f2f5] rounded-[2rem] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] h-60 sm:h-72 md:h-80 animate-pulse lg:sticky lg:top-20"></div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onBack }: { error: string | null; onBack: () => void }) => (
  <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5] px-3 sm:px-4">
    <div className="bg-[#f0f2f5] p-6 sm:p-7 md:p-8 rounded-[2rem] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] text-center max-w-md w-full border border-white/40">
      <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-[#f0f2f5] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
        <span className="text-2xl sm:text-3xl">⚠️</span>
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-slate-700 mb-1.5 sm:mb-2">مشکلی پیش آمده</h2>
      <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-7 md:mb-8">{error || "نیاز مورد نظر یافت نشد یا حذف شده است."}</p>
      <button
        onClick={onBack}
        className="relative overflow-hidden group w-full py-3.5 bg-gradient-to-r from-[#007acc] to-[#015ca8] hover:from-[#0069bd] hover:to-[#014c8a] text-white font-semibold rounded-xl border border-white/10 shadow-[0_4px_14px_rgba(0,122,204,0.3)] hover:shadow-[0_8px_25px_rgba(0,122,204,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.15)] transition-all duration-300 transform select-none"
      >
        <span className="relative z-10 flex items-center justify-center">بازگشت به شبکه</span>
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </button>
    </div>
  </div>
);

export default NeedDetailClient;
