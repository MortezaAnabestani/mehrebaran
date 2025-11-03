"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import LeaderboardTable from "@/components/gamification/LeaderboardTable";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { gamificationService, ILeaderboardResponse } from "@/services/gamification.service";

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();

  // State
  const [leaderboard, setLeaderboard] = useState<ILeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [category, setCategory] = useState<"points" | "needs_created" | "needs_supported" | "tasks_completed">(
    "points"
  );
  const [period, setPeriod] = useState<"all_time" | "monthly" | "weekly" | "daily">("all_time");

  // دریافت لیدربورد
  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await gamificationService.getLeaderboard(category, period, 100);
      setLeaderboard(response.data);
    } catch (err: any) {
      console.error("Failed to fetch leaderboard:", err);
      setError(err.message || "خطا در دریافت جدول امتیازات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [category, period]);

  // ترجمه category
  const getCategoryLabel = (cat: string): string => {
    const labels: Record<string, string> = {
      points: "امتیازات",
      needs_created: "نیازهای ایجاد شده",
      needs_supported: "نیازهای پشتیبانی شده",
      tasks_completed: "تسک‌های تکمیل شده",
    };
    return labels[cat] || cat;
  };

  // ترجمه period
  const getPeriodLabel = (per: string): string => {
    const labels: Record<string, string> = {
      all_time: "همه زمان‌ها",
      monthly: "ماهانه",
      weekly: "هفتگی",
      daily: "روزانه",
    };
    return labels[per] || per;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-mgray/5">
        {/* Header */}
        <header className="relative w-full py-15 bg-gradient-to-r from-yellow-400 to-orange-500 text-white overflow-hidden">
          <div
            className="absolute left-0 inset-0 bg-no-repeat bg-center pointer-events-none"
            style={{
              backgroundImage: "url('/images/patternMain.webp')",
              backgroundSize: "700px",
              opacity: 0.2,
              backgroundPosition: "left",
            }}
          ></div>
          <div className="relative z-10 flex items-center justify-between w-9/10 md:w-8/10 mx-auto gap-10">
            <div>
              <h1 className="text-lg md:text-3xl font-extrabold mb-5 flex items-center gap-3">
                <span className="text-4xl">🏆</span>
                جدول امتیازات
              </h1>
              <p className="font-bold text-xs md:text-base/loose opacity-90">
                با کسب امتیاز از طریق انجام فعالیت‌ها، در جدول رتبه‌بندی پیشرفت کنید و به بهترین‌های جامعه
                ملحق شوید. هر کاری که انجام می‌دهید، شما را به اهداف خیرخواهانه نزدیک‌تر می‌کند!
              </p>
            </div>
            <div className="hidden md:block text-6xl">🥇🥈🥉</div>
          </div>
        </header>

        {/* Main Content */}
        <div className="w-9/10 md:w-8/10 mx-auto my-10">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm">
            <Link href="/network" className="text-mblue hover:underline">
              شبکه نیازسنجی
            </Link>
            <span className="mx-2 text-gray-500">←</span>
            <span className="text-gray-700">جدول امتیازات</span>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">دسته‌بندی:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCategory("points")}
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${
                      category === "points"
                        ? "bg-morange text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ⭐ امتیازات
                  </button>
                  <button
                    onClick={() => setCategory("needs_created")}
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${
                      category === "needs_created"
                        ? "bg-morange text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    📝 نیازهای ایجاد شده
                  </button>
                  <button
                    onClick={() => setCategory("needs_supported")}
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${
                      category === "needs_supported"
                        ? "bg-morange text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    🤝 نیازهای پشتیبانی شده
                  </button>
                  <button
                    onClick={() => setCategory("tasks_completed")}
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${
                      category === "tasks_completed"
                        ? "bg-morange text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ✅ تسک‌های تکمیل شده
                  </button>
                </div>
              </div>

              {/* Period Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">دوره زمانی:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPeriod("all_time")}
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${
                      period === "all_time"
                        ? "bg-mblue text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    همه زمان‌ها
                  </button>
                  <button
                    onClick={() => setPeriod("monthly")}
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${
                      period === "monthly"
                        ? "bg-mblue text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ماهانه
                  </button>
                  <button
                    onClick={() => setPeriod("weekly")}
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${
                      period === "weekly"
                        ? "bg-mblue text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    هفتگی
                  </button>
                  <button
                    onClick={() => setPeriod("daily")}
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${
                      period === "daily"
                        ? "bg-mblue text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    روزانه
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-700">
                <span className="font-bold">در حال نمایش:</span> {getCategoryLabel(category)} -{" "}
                {getPeriodLabel(period)}
              </p>
            </div>
          </div>

          {/* User's Position (if found) */}
          {leaderboard?.userEntry && (
            <div className="bg-gradient-to-r from-morange/20 to-morange/10 border-2 border-morange rounded-lg p-6 mb-8">
              <h3 className="font-bold text-lg mb-3">موقعیت شما:</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-extrabold text-morange">
                    #{leaderboard.userEntry.rank}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{user?.name}</p>
                    <p className="text-sm text-gray-600">سطح {leaderboard.userEntry.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">{getCategoryLabel(category)}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-morange text-2xl">⭐</span>
                    <span className="text-2xl font-extrabold text-morange">
                      {leaderboard.userEntry.score.toLocaleString("fa-IR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mblue mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <SmartButton variant="mblue" size="sm" onClick={fetchLeaderboard}>
                  تلاش مجدد
                </SmartButton>
              </div>
            </div>
          ) : leaderboard && leaderboard.entries.length > 0 ? (
            <>
              <LeaderboardTable
                entries={leaderboard.entries}
                currentUserId={user?._id}
                variant="default"
                showLevel={true}
                showBadge={false}
              />

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  تعداد کل شرکت‌کنندگان:{" "}
                  <span className="font-bold">{leaderboard.totalParticipants.toLocaleString("fa-IR")}</span>
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-600">اطلاعاتی برای نمایش وجود ندارد.</p>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>💡</span>
              راهنمای کسب امتیاز
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold text-gray-700 mb-2">فعالیت‌های امتیازی:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• ایجاد نیاز: <span className="font-bold">100 امتیاز</span></li>
                  <li>• تکمیل تسک: <span className="font-bold">30 امتیاز</span></li>
                  <li>• پیوستن به تیم: <span className="font-bold">25 امتیاز</span></li>
                  <li>• حمایت از نیاز: <span className="font-bold">50 امتیاز</span></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">نکات مهم:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• هر روز وارد شوید و پاداش روزانه دریافت کنید</li>
                  <li>• با تکمیل نشان‌ها، امتیاز بیشتری کسب کنید</li>
                  <li>• تسک‌های خود را به موقع تکمیل کنید</li>
                  <li>• در تیم‌ها فعال باشید و به همکاری ادامه دهید</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default LeaderboardPage;
