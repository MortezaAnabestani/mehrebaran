"use client";

import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import StoriesCarousel from "@/components/network/StoriesCarousel";
import InstagramNeedCard from "@/components/network/InstagramNeedCard";
import { needService } from "@/services/need.service";
import { useAuth } from "@/contexts/AuthContext";

// Lazy load story modal
const CreateStoryModal = lazy(() => import("@/components/network/CreateStoryModal"));

/**
 * Network Feed Page - Main feed with stories and needs
 * This page content will be displayed within the InstagramLayout from layout.tsx
 */
const NetworkPage: React.FC = () => {
  // State
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateStory, setShowCreateStory] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite query for needs
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

  // Flatten all pages into a single array of needs
  const needs = data?.pages.flatMap((page) => page.data) ?? [];

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Mock Stories Data - Will be replaced with API call
  const mockStoryGroups = [
    {
      userId: "1",
      userName: "علی محمدی",
      userAvatar: undefined,
      hasNew: true,
      stories: [
        {
          id: "1",
          userId: "1",
          userName: "علی محمدی",
          userAvatar: undefined,
          mediaUrl: "https://picsum.photos/500/800?random=1",
          mediaType: "image" as const,
          createdAt: new Date().toISOString(),
          duration: 5,
        },
        {
          id: "2",
          userId: "1",
          userName: "علی محمدی",
          userAvatar: undefined,
          mediaUrl: "https://picsum.photos/500/800?random=2",
          mediaType: "image" as const,
          createdAt: new Date().toISOString(),
          duration: 5,
        },
      ],
    },
    {
      userId: "2",
      userName: "زهرا احمدی",
      userAvatar: undefined,
      hasNew: true,
      stories: [
        {
          id: "3",
          userId: "2",
          userName: "زهرا احمدی",
          userAvatar: undefined,
          mediaUrl: "https://picsum.photos/500/800?random=3",
          mediaType: "image" as const,
          createdAt: new Date().toISOString(),
          duration: 5,
        },
      ],
    },
    {
      userId: "3",
      userName: "محمد رضایی",
      userAvatar: undefined,
      hasNew: false,
      stories: [
        {
          id: "4",
          userId: "3",
          userName: "محمد رضایی",
          userAvatar: undefined,
          mediaUrl: "https://picsum.photos/500/800?random=4",
          mediaType: "image" as const,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          duration: 5,
        },
      ],
    },
  ];

  // Handle story creation
  const handleCreateStory = async (file: File) => {
    try {
      // TODO: Implement API call to upload story
      console.log("Creating story with file:", file);

      // Mock success for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowCreateStory(false);
      // Refresh stories list
      // await fetchStories();
    } catch (err) {
      console.error("Failed to create story:", err);
      throw err;
    }
  };

  // Handle need update (for like, support actions)
  const handleNeedUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["needs"] });
  };

  return (
    <>
      {/* Stories Section */}
      <div className="mb-6">
        <StoriesCarousel
          storyGroups={mockStoryGroups}
          currentUserId={user?._id}
          onCreateStory={() => setShowCreateStory(true)}
        />
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {isLoading ? (
          // Initial Loading State
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 border-4 border-mblue border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500">در حال بارگذاری...</p>
            </div>
          </div>
        ) : isError ? (
          // Error State
          <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error?.message || "خطا در دریافت نیازها"}</p>
          </div>
        ) : needs.length === 0 ? (
          // Empty State
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold mb-2">هیچ نیازی یافت نشد</h3>
            <p className="text-gray-500">اولین نیاز را شما ایجاد کنید!</p>
          </div>
        ) : (
          <>
            {/* Needs List */}
            {needs.map((need) => (
              <InstagramNeedCard key={need._id} need={need} onUpdate={handleNeedUpdate} />
            ))}

            {/* Infinite Scroll Trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex items-center justify-center py-8">
                {isFetchingNextPage ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 border-4 border-mblue border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500">در حال بارگذاری بیشتر...</p>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">اسکرول کنید برای بارگذاری بیشتر</div>
                )}
              </div>
            )}

            {/* End of Feed */}
            {!hasNextPage && needs.length > 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">همه نیازها نمایش داده شدند</div>
            )}
          </>
        )}
      </div>

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
    </>
  );
};

export default NetworkPage;
