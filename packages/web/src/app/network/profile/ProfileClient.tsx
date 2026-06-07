"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import InstagramLayout from "@/components/network/InstagramLayout";
import LeftSidebar from "@/components/network/LeftSidebar";
import RightSidebar from "@/components/network/RightSidebar";
import InstagramProfileHeader from "@/components/network/InstagramProfileHeader";
import StoryHighlights from "@/components/network/StoryHighlights";
import InstagramProfileTabs, { TabType } from "@/components/network/InstagramProfileTabs";
import InstagramProfileGrid from "@/components/network/InstagramProfileGrid";
import { needService } from "@/services/need.service";
import { INeed } from "common-types";

const SKEUO_CARD_CLASS =
  "bg-[#eef2f6] md:rounded-[2rem] md:shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] md:p-6 transition-all duration-300";

const ProfileClient: React.FC = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const tabParam = searchParams.get("tab") as TabType | null;
  const activeTab: TabType = tabParam && ["posts", "tagged", "saved"].includes(tabParam)
    ? tabParam
    : "posts";

  const setActiveTab = (tab: TabType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [needs, setNeeds] = useState<INeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize empty states to preserve reference equality
  const EMPTY_NEEDS: INeed[] = React.useMemo(() => [], []);

  // Mock stats - To be replaced with real API data
  const stats = React.useMemo(() => ({
    posts: needs.length,
    followers: 1234,
    following: 567,
  }), [needs.length]);

  // Mock highlights
  const highlights = React.useMemo(() => [
    { id: "1", title: "نیازهای اضطراری", coverImage: undefined, storiesCount: 5 },
    { id: "2", title: "تکمیل شده", coverImage: undefined, storiesCount: 12 },
    { id: "3", title: "همکاری‌ها", coverImage: undefined, storiesCount: 8 },
  ], []);

  // Fetch user's needs with cleanup
  useEffect(() => {
    let isMounted = true;

    const fetchNeeds = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await needService.getNeeds({ limit: 100 });

        if (isMounted) {
          const userNeeds = response.data.filter((need) => {
            const creator = need.submittedBy?.user;
            const creatorId = typeof creator === "string" ? creator : creator?._id;
            return creatorId === user._id;
          });
          setNeeds(userNeeds);
        }
      } catch (error) {
        console.error("Failed to fetch user needs:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchNeeds();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Filter logic
  const getTabNeeds = React.useCallback((): INeed[] => {
    switch (activeTab) {
      case "posts":
        return needs;
      case "tagged":
        return EMPTY_NEEDS; // TODO: Implement tagged logic
      case "saved":
        return EMPTY_NEEDS; // TODO: Implement saved logic
      default:
        return needs;
    }
  }, [activeTab, needs, EMPTY_NEEDS]);

  const handleEditProfile = React.useCallback(() => {
    console.log("Edit profile clicked");
    // TODO: Implement modal logic
  }, []);

  // --- Loading State (Skeuomorphic) ---
  if (!user || isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen bg-[#eef2f6]">
          <div className="flex flex-col items-center gap-4">
            {/* Skeuomorphic Spinner */}
            <div className="relative w-16 h-16 rounded-full bg-[#eef2f6] shadow-[6px_6px_10px_#d1d9e6,-6px_-6px_10px_#ffffff] flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-[#eef2f6] border-t-[#007acc] animate-spin shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff]"></div>
            </div>
            <p className="text-slate-500 font-medium text-sm animate-pulse">
              باران که می‌بارد، تو در راهی...
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <InstagramLayout
        leftSidebar={<LeftSidebar />}
        rightSidebar={<RightSidebar />}
        showLeftSidebar={false}
        showRightSidebar={false}
      >
        {/* Main Page Container - Soft Gray Background */}
        <main className="min-h-screen md:translate-x-31 md:mx-auto text-slate-700 font-sans pb-20">
          <div className="max-w-4xl mx-auto md:px-4 md:pt-8 space-y-4 md:space-y-8">
            {/* 1. Profile Header Section */}
            <section className={`${SKEUO_CARD_CLASS} relative overflow-hidden`}>
              <InstagramProfileHeader
                user={user}
                stats={stats}
                isOwnProfile={true}
                onEditProfile={handleEditProfile}
              />
            </section>

            <section className="py-2">
              <StoryHighlights
                highlights={highlights}
                isOwnProfile={true}
                onAddHighlight={() => console.log("Add highlight")}
                onHighlightClick={(id) => console.log("View highlight:", id)}
              />
            </section>

            {/* 3. Content Area (Tabs + Grid) */}
            <section className="flex flex-col gap-6 px-0 md:px-0">
              {/* Tabs Container - Neumorphic Bar */}
              <div className="md:rounded-2xl md:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] p-0 md:p-2 border-y md:border-y-0 border-gray-200">
                <InstagramProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isOwnProfile={true} />
              </div>

              {/* Grid Container */}
              <div className="min-h-[400px] animate-in fade-in duration-500 slide-in-from-bottom-4">
                <InstagramProfileGrid
                  needs={getTabNeeds()}
                  isLoading={isLoading}
                  emptyMessage={
                    activeTab === "posts"
                      ? "هنوز پستی ایجاد نکرده‌اید"
                      : activeTab === "tagged"
                      ? "هیچ پستی شما را تگ نکرده است"
                      : "هیچ پستی ذخیره نکرده‌اید"
                  }
                />
              </div>
            </section>
          </div>
        </main>
      </InstagramLayout>
    </ProtectedRoute>
  );
};

export default ProfileClient;
