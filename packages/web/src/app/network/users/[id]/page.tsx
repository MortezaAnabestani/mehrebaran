"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import SmartButton from "@/components/ui/SmartButton";
import UserCard from "@/components/social/UserCard";
import { socialService, IFollow, IFollowStats } from "@/services/social.service";

const UserFollowPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const userId = params.id as string;

  // State
  const [followers, setFollowers] = useState<IFollow[]>([]);
  const [following, setFollowing] = useState<IFollow[]>([]);
  const [stats, setStats] = useState<IFollowStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");

  // دریافت داده‌ها
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [followersRes, followingRes, statsRes] = await Promise.all([
        socialService.getUserFollowers(userId),
        socialService.getUserFollowing(userId),
        socialService.getUserFollowStats(userId),
      ]);

      setFollowers(followersRes.data);
      setFollowing(followingRes.data);
      setStats(statsRes.data);
    } catch (err: any) {
      console.error("Failed to fetch user follow data:", err);
      setError(err.message || "خطا در دریافت اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

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

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <SmartButton variant="mblue" size="sm" onClick={fetchData}>
              تلاش مجدد
            </SmartButton>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentList = activeTab === "followers" ? followers : following;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-mgray/5 pb-10">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="w-9/10 md:w-8/10 mx-auto">
            <div className="mb-4 text-sm">
              <Link href="/network" className="text-mblue hover:underline">
                شبکه نیازسنجی
              </Link>
              <span className="mx-2 text-gray-500">←</span>
              <span className="text-gray-700">کاربران</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-9/10 md:w-8/10 mx-auto mt-8">
          {/* Stats */}
          {stats && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-mblue">
                      {stats.followersCount.toLocaleString("fa-IR")}
                    </p>
                    <p className="text-sm text-gray-600">دنبال‌کننده</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-gray-700">
                      {stats.followingCount.toLocaleString("fa-IR")}
                    </p>
                    <p className="text-sm text-gray-600">دنبال‌شونده</p>
                  </div>
                </div>

                {currentUser?._id !== userId && stats.isFollowing !== undefined && (
                  <SmartButton
                    variant={stats.isFollowing ? "mgray" : "mblue"}
                    size="md"
                    onClick={async () => {
                      try {
                        if (stats.isFollowing) {
                          await socialService.unfollowUser(userId);
                        } else {
                          await socialService.followUser(userId);
                        }
                        fetchData();
                      } catch (error: any) {
                        alert(error.message || "خطا در عملیات");
                      }
                    }}
                  >
                    {stats.isFollowing ? "دنبال‌شده ✓" : "دنبال کردن"}
                  </SmartButton>
                )}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab("followers")}
              className={`flex-1 px-6 py-3 rounded-md font-bold transition-colors ${
                activeTab === "followers"
                  ? "bg-mblue text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              دنبال‌کنندگان ({followers.length.toLocaleString("fa-IR")})
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex-1 px-6 py-3 rounded-md font-bold transition-colors ${
                activeTab === "following"
                  ? "bg-mblue text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              دنبال‌شونده‌ها ({following.length.toLocaleString("fa-IR")})
            </button>
          </div>

          {/* Users List */}
          {currentList.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-600">
                {activeTab === "followers" ? "هیچ دنبال‌کننده‌ای وجود ندارد." : "هیچ دنبال‌شونده‌ای وجود ندارد."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentList.map((item) => {
                const userData =
                  activeTab === "followers"
                    ? item.follower
                    : item.following;

                if (!userData) return null;

                return (
                  <UserCard
                    key={item._id}
                    user={{
                      _id: userData._id,
                      name: userData.name,
                      avatar: userData.avatar,
                    }}
                    currentUserId={currentUser?._id}
                    variant="list"
                    onFollowChange={fetchData}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserFollowPage;
