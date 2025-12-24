"use client";

import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import StoriesCarousel from "@/components/network/StoriesCarousel";
import InstagramNeedCard from "@/components/network/InstagramNeedCard";
import { needService } from "@/services/need.service";
import { useAuth } from "@/contexts/AuthContext";

// Lazy load story modal for performance optimization
const CreateStoryModal = lazy(() => import("@/components/network/CreateStoryModal"));

/**
 * Network Feed Page
 * Refactored for Skeuomorphic Design & High Performance
 */
const NetworkPage: React.FC = () => {
  // --- State & Hooks ---
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateStory, setShowCreateStory] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching ---
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useInfiniteQuery({
      queryKey: ["needs"],
      queryFn: ({ pageParam = 1 }) => needService.getNeeds({ page: pageParam, limit: 10 }),
      getNextPageParam: (lastPage) => {
        if (!lastPage.pagination) return undefined;
        const { page, pages } = lastPage.pagination;
        return page < pages ? page + 1 : undefined;
      },
      initialPageParam: 1,
    });

  const needs = data?.pages.flatMap((page) => page.data) ?? [];

  // --- Effects ---
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.5, rootMargin: "100px" } // Pre-fetch before hitting bottom
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // --- Handlers ---
  const handleCreateStory = async (file: File) => {
    try {
      // Mock API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowCreateStory(false);
      // In real app: queryClient.invalidateQueries({ queryKey: ['stories'] });
    } catch (err) {
      console.error("Failed to create story:", err);
    }
  };

  const handleNeedUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["needs"] });
  };

  // --- Mock Data (Keep existing) ---
  const mockStoryGroups = [
    {
      userId: "1",
      userName: "علی محمدی",
      hasNew: true,
      stories: [
        {
          id: "1",
          userId: "1",
          userName: "علی محمدی",
          mediaUrl: "https://picsum.photos/500/800?random=1",
          mediaType: "image" as const,
          createdAt: new Date().toISOString(),
          duration: 5,
        },
      ],
    },
    // ... other mocks
  ];

  // --- Render Helpers ---

  // Skeuomorphic Loading Skeleton
  const FeedSkeleton = () => (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-3 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-full h-64 bg-gray-100 rounded-xl animate-pulse mb-4" />
          <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );

  return (
    <main className="max-w-xl mx-auto pb-24 min-h-screen">
      {/* Stories Section */}
      <section
        aria-label="Stories"
        className="mb-4 pt-4 sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100/50 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:static"
      >
        <StoriesCarousel
          storyGroups={mockStoryGroups}
          currentUserId={user?._id}
          onCreateStory={() => setShowCreateStory(true)}
        />
      </section>

      {/* Feed Section */}
      <section aria-label="News Feed" className="space-y-8">
        {isLoading ? (
          <FeedSkeleton />
        ) : isError ? (
          <div role="alert" className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-red-600 font-medium">
              {error instanceof Error ? error.message : "خطا در دریافت اطلاعات"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-red-700 underline hover:text-red-800 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        ) : needs.length === 0 ? (
          // Empty State - Skeuomorphic Card
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
          >
            <div className="text-7xl mb-6 drop-shadow-md">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">هنوز خبری نیست!</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              به نظر می‌رسد هنوز نیازی ثبت نشده است. اولین نفر باشید که شبکه را فعال می‌کند.
            </p>
            <button className="bg-[#007acc] text-white px-6 py-3 rounded-xl shadow-[0_4px_14px_0_rgba(0,122,204,0.39)] hover:shadow-[0_6px_20px_rgba(0,122,204,0.23)] hover:-translate-y-0.5 transition-all duration-200 font-medium">
              ایجاد نیاز جدید
            </button>
          </motion.div>
        ) : (
          <>
            {/* Needs List with Animation */}
            <AnimatePresence mode="popLayout">
              {needs.map((need, index) => (
                <motion.article
                  key={need._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="mb-6"
                >
                  <InstagramNeedCard need={need} onUpdate={handleNeedUpdate} />
                </motion.article>
              ))}
            </AnimatePresence>

            {/* Infinite Scroll Trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex items-center justify-center py-8">
                {isFetchingNextPage ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-[#007acc]/30 border-t-[#007acc] rounded-full animate-spin"></div>
                    <span className="text-xs font-medium text-gray-400">در حال بارگذاری...</span>
                  </div>
                ) : (
                  <div className="h-10" /> // Spacer for trigger
                )}
              </div>
            )}

            {/* End of Feed Indicator */}
            {!hasNextPage && needs.length > 0 && (
              <div className="text-center py-12">
                <div className="inline-block px-4 py-2 bg-gray-50 rounded-full text-gray-400 text-xs font-medium border border-gray-100 shadow-sm">
                  شما همه مطالب را دیدید ✨
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Create Story Modal */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {showCreateStory && (
            <CreateStoryModal
              isOpen={showCreateStory}
              onClose={() => setShowCreateStory(false)}
              onSubmit={handleCreateStory}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </main>
  );
};

export default NetworkPage;
