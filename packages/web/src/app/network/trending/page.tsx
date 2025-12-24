"use client";

import React, { useEffect, useState } from "react";
import NeedCard from "@/components/network/NeedCard";
import UserCard from "@/components/social/UserCard";
import discoveryService from "@/services/discovery.service";
import type { INeed } from "common-types";
import type { IUser } from "common-types";
import { clsx } from "clsx"; // Assuming clsx or similar utility exists, otherwise standard template literals work

// ===========================
// Types
// ===========================

type Period = "day" | "week" | "month" | "all";
type Category = "needs" | "users";

// ===========================
// Components
// ===========================

/**
 * Trending Page - Popular needs and users
 * Redesigned with Skeuomorphism and Semantic HTML
 */
const TrendingPage: React.FC = () => {
  // State
  const [activeCategory, setActiveCategory] = useState<Category>("needs");
  const [activePeriod, setActivePeriod] = useState<Period>("week");

  const [trendingNeeds, setTrendingNeeds] = useState<INeed[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<IUser[]>([]);

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

  const handleNeedUpdate = () => fetchTrendingContent();
  const handleUserFollowChange = () => fetchTrendingContent();

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

  // ===========================
  // Render Sub-components
  // ===========================

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-32 animate-pulse">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#007acc] border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-500 font-medium text-lg">در حال تحلیل داده‌های ترند...</p>
    </div>
  );

  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border border-gray-200 shadow-inner">
      <span className="text-6xl mb-4 opacity-50">📉</span>
      <p className="text-gray-500 text-lg font-medium">{message}</p>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return renderLoadingState();

    if (activeCategory === "needs") {
      if (trendingNeeds.length === 0) {
        return renderEmptyState("در حال حاضر نیازی در این بازه زمانی ترند نیست.");
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingNeeds.map((need, index) => (
            <article key={need._id} className="relative group perspective-1000">
              {/* Rank Badge - Skeuomorphic */}
              {index < 3 && (
                <div className="absolute -top-3 -right-3 z-20 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 text-white font-bold rounded-full shadow-[2px_4px_8px_rgba(0,0,0,0.3)] border-2 border-white">
                  {index + 1}
                </div>
              )}

              {/* Card Container with Depth */}
              <div className="h-full transition-transform duration-300 hover:-translate-y-1">
                <NeedCard need={need} variant="feed" onUpdate={handleNeedUpdate} />
              </div>
            </article>
          ))}
        </div>
      );
    }

    if (activeCategory === "users") {
      if (trendingUsers.length === 0) {
        return renderEmptyState("در حال حاضر کاربری در این بازه زمانی ترند نیست.");
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingUsers.map((user, index) => (
            <article key={user._id} className="relative">
              {/* Rank Badge */}
              {index < 3 && (
                <div className="absolute -top-3 -right-3 z-20 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-[2px_4px_8px_rgba(0,0,0,0.3)] border-2 border-white">
                  {index + 1}
                </div>
              )}

              <div className="h-full transition-transform duration-300 hover:-translate-y-1">
                <UserCard
                  user={user}
                  variant="card"
                  showFollowButton={true}
                  onFollowChange={handleUserFollowChange}
                />
              </div>
            </article>
          ))}
        </div>
      );
    }

    return null;
  };

  // ===========================
  // Main Render
  // ===========================

  return (
    <main className="min-h-screen bg-[#f4f6f9] pb-20">
      {/* Header Section with Soft Shadow */}
      <header className="bg-[#f4f6f9] pt-10 pb-6 px-4 md:px-8 sticky top-0 z-30 backdrop-blur-md bg-opacity-90 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">
              <span className="text-[#007acc]">اولویت‌های</span> فوری
            </h1>
            <p className="text-gray-500 mt-2 font-medium">برترین نیازها و کاربران تاثیرگذار شبکه</p>
          </div>

          {/* Skeuomorphic Stats Widget */}
          <div className="flex gap-4">
            <div className="bg-gray-100 rounded-2xl p-1 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,1)] flex items-center gap-6 px-6 py-2 border border-gray-200">
              <div className="text-center">
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">نیازها</span>
                <span className="block text-xl font-bold text-[#007acc]">{trendingNeeds.length}</span>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">
                  کاربران
                </span>
                <span className="block text-xl font-bold text-[#007acc]">{trendingUsers.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        {/* Controls Section: Tabs & Filters */}
        <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
          {/* Skeuomorphic Tabs (Segmented Control) */}
          <nav
            className="bg-gray-200 p-1.5 rounded-2xl flex shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]"
            role="tablist"
            aria-label="Category Selection"
          >
            {(["needs", "users"] as Category[]).map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    relative px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 ease-out
                    flex items-center gap-2
                    ${
                      isActive
                        ? "bg-[#f4f6f9] text-[#007acc] shadow-[3px_3px_6px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,1)] translate-y-0"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }
                  `}
                >
                  <span>{category === "needs" ? "🔥" : "⭐"}</span>
                  {category === "needs" ? "نیازها" : "کاربران"}
                </button>
              );
            })}
          </nav>

          {/* Period Filters - Raised Buttons */}
          <div className="flex flex-wrap items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-gray-400 text-sm font-medium ml-2">بازه زمانی:</span>
            {(["day", "week", "month", "all"] as Period[]).map((period) => {
              const isActive = activePeriod === period;
              return (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#007acc] text-white shadow-[0_4px_10px_rgba(0,122,204,0.4)] transform scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                    }
                    active:scale-95 active:shadow-inner
                  `}
                >
                  {getPeriodLabel(period)}
                </button>
              );
            })}
          </div>
        </section>

        {/* Main Content Grid */}
        <section aria-live="polite">{renderContent()}</section>
      </div>
    </main>
  );
};

export default TrendingPage;
