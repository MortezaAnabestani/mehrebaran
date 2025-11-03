"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NeedCard from "@/components/network/NeedCard";
import UserCard from "@/components/social/UserCard";
import TeamCard from "@/components/network/TeamCard";
import { SmartButton } from "@/components/SmartButton";
import discoveryService from "@/services/discovery.service";
import type { INeed } from "@/types/need";
import type { IUser } from "@/types/user";
import type { ITeam } from "@/types/team";

// ===========================
// Types
// ===========================

type Period = "day" | "week" | "month" | "all";
type Category = "needs" | "users" | "teams";

// ===========================
// Trending Page Component
// ===========================

const TrendingPage: React.FC = () => {
  const router = useRouter();

  // State
  const [activeCategory, setActiveCategory] = useState<Category>("needs");
  const [activePeriod, setActivePeriod] = useState<Period>("week");

  const [trendingNeeds, setTrendingNeeds] = useState<INeed[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<IUser[]>([]);
  const [trendingTeams, setTrendingTeams] = useState<ITeam[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ===========================
  // Data Fetching
  // ===========================

  const fetchTrendingContent = async () => {
    try {
      setIsLoading(true);

      const data = await discoveryService.getAllTrending(activePeriod, 20);
      setTrendingNeeds(data.needs);
      setTrendingUsers(data.users);
      setTrendingTeams(data.teams);
    } catch (error) {
      console.error("Error fetching trending content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingContent();
  }, [activePeriod]);

  // ===========================
  // Event Handlers
  // ===========================

  const handleNeedUpdate = () => {
    fetchTrendingContent();
  };

  const handleUserFollowChange = () => {
    fetchTrendingContent();
  };

  // ===========================
  // Helper Functions
  // ===========================

  const getPeriodLabel = (period: Period): string => {
    const labels: Record<Period, string> = {
      day: "امروز",
      week: "این هفته",
      month: "این ماه",
      all: "همیشه",
    };
    return labels[period];
  };

  const getCategoryIcon = (category: Category): string => {
    const icons: Record<Category, string> = {
      needs: "🔥",
      users: "⭐",
      teams: "🏆",
    };
    return icons[category];
  };

  const getCategoryLabel = (category: Category): string => {
    const labels: Record<Category, string> = {
      needs: "نیازها",
      users: "کاربران",
      teams: "تیم‌ها",
    };
    return labels[category];
  };

  // ===========================
  // Render Content
  // ===========================

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 border-4 border-mblue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">در حال بارگذاری محتوای ترند...</p>
          </div>
        </div>
      );
    }

    if (activeCategory === "needs") {
      if (trendingNeeds.length === 0) {
        return (
          <div className="text-center py-20">
            <p className="text-gray-400 text-6xl mb-4">🔥</p>
            <p className="text-gray-500 text-lg">
              در حال حاضر نیازی در این بازه زمانی ترند نیست.
            </p>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingNeeds.map((need, index) => (
            <div key={need._id} className="relative">
              {/* Trending Badge */}
              {index < 3 && (
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-morange to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  🔥 #{index + 1}
                </div>
              )}
              <NeedCard need={need} variant="feed" onUpdate={handleNeedUpdate} />
            </div>
          ))}
        </div>
      );
    }

    if (activeCategory === "users") {
      if (trendingUsers.length === 0) {
        return (
          <div className="text-center py-20">
            <p className="text-gray-400 text-6xl mb-4">⭐</p>
            <p className="text-gray-500 text-lg">
              در حال حاضر کاربری در این بازه زمانی ترند نیست.
            </p>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingUsers.map((user, index) => (
            <div key={user._id} className="relative">
              {/* Trending Badge */}
              {index < 3 && (
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ #{index + 1}
                </div>
              )}
              <UserCard
                user={user}
                variant="card"
                showFollowButton={true}
                onFollowChange={handleUserFollowChange}
              />
            </div>
          ))}
        </div>
      );
    }

    if (activeCategory === "teams") {
      if (trendingTeams.length === 0) {
        return (
          <div className="text-center py-20">
            <p className="text-gray-400 text-6xl mb-4">🏆</p>
            <p className="text-gray-500 text-lg">
              در حال حاضر تیمی در این بازه زمانی ترند نیست.
            </p>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingTeams.map((team, index) => (
            <div key={team._id} className="relative">
              {/* Trending Badge */}
              {index < 3 && (
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  🏆 #{index + 1}
                </div>
              )}
              <TeamCard team={team} variant="card" />
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  // ===========================
  // Render
  // ===========================

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-4xl">📈</span>
              محتوای ترند
            </h1>
            <p className="text-gray-600">
              محبوب‌ترین نیازها، کاربران و تیم‌ها
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto pb-2">
            {(["needs", "users", "teams"] as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`pb-4 px-6 font-semibold transition-colors relative whitespace-nowrap ${
                  activeCategory === category
                    ? "text-mblue"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="mr-2">{getCategoryIcon(category)}</span>
                {getCategoryLabel(category)}
                {activeCategory === category && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mblue"></div>
                )}
              </button>
            ))}
          </div>

          {/* Period Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="text-gray-600 font-medium py-2">بازه زمانی:</span>
            {(["day", "week", "month", "all"] as Period[]).map((period) => (
              <SmartButton
                key={period}
                onClick={() => setActivePeriod(period)}
                variant={activePeriod === period ? "primary" : "outline"}
                size="sm"
              >
                {getPeriodLabel(period)}
              </SmartButton>
            ))}
          </div>

          {/* Stats Summary */}
          <div className="bg-gradient-to-r from-mblue to-cyan-500 rounded-lg p-6 mb-8 text-white shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {trendingNeeds.length}
                </div>
                <div className="text-sm opacity-90">نیاز ترند</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {trendingUsers.length}
                </div>
                <div className="text-sm opacity-90">کاربر ترند</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {trendingTeams.length}
                </div>
                <div className="text-sm opacity-90">تیم ترند</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>{renderContent()}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TrendingPage;
