"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import SmartButton from "@/components/ui/SmartButton";
import UserCard from "@/components/social/UserCard";
import { socialService, IFollow, IFollowStats } from "@/services/social.service";

// --- Components: Skeleton Loader for Skeuomorphic Feel ---
const StatsSkeleton = () => (
  <div className="w-full bg-gray-100 rounded-2xl p-6 shadow-inner animate-pulse flex justify-between items-center h-32">
    <div className="flex gap-8">
      <div className="h-12 w-24 bg-gray-300 rounded-lg"></div>
      <div className="h-12 w-24 bg-gray-300 rounded-lg"></div>
    </div>
    <div className="h-10 w-32 bg-gray-300 rounded-xl"></div>
  </div>
);

const ListSkeleton = () => (
  <div className="space-y-4 mt-6">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="h-20 w-full bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse"
      ></div>
    ))}
  </div>
);

interface UserFollowClientProps {
  userId: string;
}

const UserFollowClientContent: React.FC<UserFollowClientProps> = ({ userId }) => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const activeTab = (searchParams.get("tab") as "followers" | "following") || "followers";
  const setActiveTab = (tab: "followers" | "following") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const [followers, setFollowers] = useState<IFollow[]>([]);
  const [following, setFollowing] = useState<IFollow[]>([]);
  const [stats, setStats] = useState<IFollowStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data Logic
  const fetchData = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);

      const [followersRes, followingRes, statsRes] = await Promise.all([
        socialService.getUserFollowers(userId),
        socialService.getUserFollowing(userId),
        socialService.getUserFollowStats(userId),
      ]);

      if (signal?.aborted) return;
      setFollowers(followersRes.data);
      setFollowing(followingRes.data);
      setStats(statsRes.data);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      console.error("Failed to fetch user follow data:", err);
      const errMsg = err instanceof Error ? err.message : "خطا در دریافت اطلاعات";
      setError(errMsg);
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const controller = new AbortController();
      fetchData(controller.signal);
      return () => controller.abort();
    }
  }, [userId, fetchData]);

  // Handle Follow/Unfollow Action
  const handleFollowAction = async () => {
    if (!stats) return;
    try {
      if (stats.isFollowing) {
        await socialService.unfollowUser(userId);
      } else {
        await socialService.followUser(userId);
      }
      fetchData(); // Refresh data to update UI
    } catch (err: unknown) {
      // In a real app, use a toast notification here
      const errMsg = err instanceof Error ? err.message : "خطا در عملیات";
      alert(errMsg);
    }
  };

  const currentList = activeTab === "followers" ? followers : following;

  // --- Render: Error State ---
  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
          <div className="text-center p-8 bg-white rounded-2xl shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
            <p className="text-red-500 mb-6 font-medium">{error}</p>
            <SmartButton variant="mblue" size="md" onClick={() => fetchData()}>
              تلاش مجدد
            </SmartButton>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f0f2f5] text-gray-800 pb-12 font-sans">
        {/* --- Header Section --- */}
        <header className="sticky top-0 z-20 bg-[#f0f2f5]/90 backdrop-blur-md border-b border-gray-200/50 py-4 transition-all duration-300">
          <div className="w-11/12 max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/network"
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-[#f0f2f5] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-gray-600 hover:text-[#007acc]"
                aria-label="بازگشت به شبکه"
              >
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    className="rotate-180 origin-center"
                  />
                </svg>
              </Link>
              <h1 className="text-lg font-bold text-gray-700">ارتباطات کاربر</h1>
            </div>
          </div>
        </header>

        <div className="w-11/12 max-w-4xl mx-auto mt-8 space-y-8">
          {/* --- Stats Section (Skeuomorphic Card) --- */}
          <section aria-label="آمار دنبال‌کنندگان">
            {isLoading || !stats ? (
              <StatsSkeleton />
            ) : (
              <div className="bg-[#f0f2f5] rounded-2xl p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] border border-white/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-10">
                  <div className="text-center group cursor-default">
                    <p className="text-3xl font-black text-[#007acc] drop-shadow-sm transition-transform group-hover:scale-110 duration-300">
                      {stats.followersCount.toLocaleString("fa-IR")}
                    </p>
                    <p className="text-sm font-medium text-gray-500 mt-1">دنبال‌کننده</p>
                  </div>
                  <div className="w-px h-12 bg-gray-300 rounded-full"></div>
                  <div className="text-center group cursor-default">
                    <p className="text-3xl font-black text-gray-700 drop-shadow-sm transition-transform group-hover:scale-110 duration-300">
                      {stats.followingCount.toLocaleString("fa-IR")}
                    </p>
                    <p className="text-sm font-medium text-gray-500 mt-1">دنبال‌شونده</p>
                  </div>
                </div>

                {currentUser?._id !== userId && stats.isFollowing !== undefined && (
                  <div className="w-full sm:w-auto">
                    <SmartButton
                      variant={stats.isFollowing ? "mgray" : "mblue"}
                      size="md"
                      className={`w-full sm:w-auto shadow-md hover:shadow-lg transition-all ${
                        stats.isFollowing
                          ? "bg-gray-200 text-gray-700 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]"
                          : "bg-gradient-to-br from-[#007acc] to-[#005fa3]"
                      }`}
                      onClick={handleFollowAction}
                    >
                      {stats.isFollowing ? "دنبال‌شده ✓" : "دنبال کردن"}
                    </SmartButton>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* --- Tabs Navigation (Segmented Control) --- */}
          <nav
            className="bg-[#e6e9ef] p-1.5 rounded-xl shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] flex items-center relative"
            role="tablist"
          >
            <button
              role="tab"
              aria-selected={activeTab === "followers"}
              onClick={() => setActiveTab("followers")}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ease-out relative z-10 ${
                activeTab === "followers"
                  ? "bg-[#f0f2f5] text-[#007acc] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              دنبال‌کنندگان
              {!isLoading && (
                <span className="mr-1 text-xs opacity-70">({followers.length.toLocaleString("fa-IR")})</span>
              )}
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "following"}
              onClick={() => setActiveTab("following")}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ease-out relative z-10 ${
                activeTab === "following"
                  ? "bg-[#f0f2f5] text-[#007acc] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              دنبال‌شونده‌ها
              {!isLoading && (
                <span className="mr-1 text-xs opacity-70">({following.length.toLocaleString("fa-IR")})</span>
              )}
            </button>
          </nav>

          {/* --- Users List --- */}
          <section aria-live="polite" className="min-h-[300px]">
            {isLoading ? (
              <ListSkeleton />
            ) : currentList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-[#f0f2f5] rounded-2xl border-2 border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400 shadow-inner">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  {activeTab === "followers"
                    ? "هنوز هیچ دنبال‌کننده‌ای وجود ندارد."
                    : "این کاربر کسی را دنبال نمی‌کند."}
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {currentList.map((item) => {
                  const userData = activeTab === "followers" ? item.follower : item.following;
                  if (!userData) return null;

                  return (
                    <li key={item._id} className="transform transition-all duration-200 hover:-translate-y-1">
                      {/* Assuming UserCard can accept className or is styled internally. 
                          If UserCard is rigid, wrap it in a styled div like this: */}
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden">
                        <UserCard
                          user={{
                            _id: userData._id,
                            name: userData.name,
                            avatar: userData.avatar,
                          }}
                          currentUserId={currentUser?._id}
                          variant="list"
                          onFollowChange={() => fetchData()}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
};

const UserFollowClient: React.FC<UserFollowClientProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen bg-[#f0f2f5]">
        <div className="animate-spin w-10 h-10 border-4 border-[#007acc] border-t-transparent rounded-full"></div>
      </div>
    }>
      <UserFollowClientContent {...props} />
    </Suspense>
  );
};

export default UserFollowClient;
