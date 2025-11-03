"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import SmartButton from "@/components/ui/SmartButton";
import LevelBadge from "@/components/gamification/LevelBadge";
import PointsDisplay from "@/components/gamification/PointsDisplay";
import AchievementCard from "@/components/gamification/AchievementCard";
import {
  gamificationService,
  IPointSummary,
  IUserStats,
  IUserBadge,
  IPointTransaction,
  getLevelByPoints,
} from "@/services/gamification.service";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  // State
  const [pointSummary, setPointSummary] = useState<IPointSummary | null>(null);
  const [userStats, setUserStats] = useState<IUserStats | null>(null);
  const [userBadges, setUserBadges] = useState<IUserBadge[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<IPointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingBonus, setClaimingBonus] = useState<boolean>(false);

  // دریافت اطلاعات
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [summaryRes, statsRes, badgesRes, transactionsRes] = await Promise.all([
        gamificationService.getPointSummary(),
        gamificationService.getUserStats(),
        gamificationService.getUserBadges(),
        gamificationService.getPointTransactions(10),
      ]);

      setPointSummary(summaryRes.data);
      setUserStats(statsRes.data);
      setUserBadges(badgesRes.data);
      setRecentTransactions(transactionsRes.data);
    } catch (err: any) {
      console.error("Failed to fetch profile data:", err);
      setError(err.message || "خطا در دریافت اطلاعات پروفایل");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // دریافت پاداش روزانه
  const handleClaimDailyBonus = async () => {
    try {
      setClaimingBonus(true);
      const response = await gamificationService.claimDailyBonus();
      alert(`🎉 ${response.data.message}\n+${response.data.pointsEarned} امتیاز!`);
      fetchData(); // رفرش داده‌ها
    } catch (err: any) {
      alert(err.message || "خطا در دریافت پاداش روزانه");
    } finally {
      setClaimingBonus(false);
    }
  };

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

  const currentLevel = pointSummary
    ? pointSummary.currentLevel
    : getLevelByPoints(userStats?.totalPoints || 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-mgray/5 pb-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-mblue to-cyan-600 text-white py-12">
          <div className="w-9/10 md:w-8/10 mx-auto">
            <div className="mb-4 text-sm opacity-90">
              <Link href="/network" className="hover:underline">
                شبکه نیازسنجی
              </Link>
              <span className="mx-2">←</span>
              <span>پروفایل من</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold shadow-xl">
                {user?.name.charAt(0)}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-right">
                <h1 className="text-3xl font-extrabold mb-2">{user?.name}</h1>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {pointSummary && (
                    <LevelBadge
                      currentLevel={currentLevel}
                      currentPoints={pointSummary.totalPoints}
                      size="md"
                      showProgress={false}
                      showTitle={true}
                    />
                  )}
                  {pointSummary && (
                    <div className="text-sm opacity-90">
                      رتبه {pointSummary.rank.toLocaleString("fa-IR")} در جدول امتیازات
                    </div>
                  )}
                </div>
              </div>

              {/* Daily Bonus Button */}
              <SmartButton
                variant="morange"
                size="md"
                onClick={handleClaimDailyBonus}
                disabled={claimingBonus}
              >
                {claimingBonus ? "در حال دریافت..." : "🎁 پاداش روزانه"}
              </SmartButton>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-9/10 md:w-8/10 mx-auto mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Points Card */}
              {pointSummary && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="font-bold text-xl mb-4">امتیازات من</h2>
                  <PointsDisplay
                    points={pointSummary.totalPoints}
                    size="lg"
                    variant="detailed"
                    changeAmount={pointSummary.pointsEarnedToday}
                  />

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-blue-50 rounded-md">
                      <p className="text-xs text-gray-600 mb-1">امروز</p>
                      <p className="font-bold text-mblue">
                        {pointSummary.pointsEarnedToday.toLocaleString("fa-IR")}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-md">
                      <p className="text-xs text-gray-600 mb-1">این هفته</p>
                      <p className="font-bold text-green-600">
                        {pointSummary.pointsEarnedThisWeek.toLocaleString("fa-IR")}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-md">
                      <p className="text-xs text-gray-600 mb-1">این ماه</p>
                      <p className="font-bold text-purple-600">
                        {pointSummary.pointsEarnedThisMonth.toLocaleString("fa-IR")}
                      </p>
                    </div>
                  </div>

                  {/* Level Progress */}
                  {pointSummary.nextLevel && (
                    <div className="mt-6 p-4 bg-mgray/10 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold">پیشرفت تا سطح بعد:</span>
                        <span className="text-sm font-bold text-mblue">
                          {pointSummary.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                        <div
                          className="bg-gradient-to-r from-mblue to-cyan-500 h-full rounded-full transition-all"
                          style={{ width: `${pointSummary.progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600">
                        {pointSummary.pointsToNextLevel.toLocaleString("fa-IR")} امتیاز تا{" "}
                        {pointSummary.nextLevel.title}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Recent Transactions */}
              {recentTransactions.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="font-bold text-xl mb-4">تراکنش‌های اخیر</h2>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-bold">{transaction.reason}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString("fa-IR")}
                          </p>
                        </div>
                        <span
                          className={`font-bold ${
                            transaction.points > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.points > 0 ? "+" : ""}
                          {transaction.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My Badges */}
              {userBadges.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-xl">نشان‌های من</h2>
                    <Link href="/network/achievements" className="text-sm text-mblue hover:underline">
                      مشاهده همه
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userBadges.slice(0, 6).map((userBadge) => (
                      <AchievementCard
                        key={userBadge.badge._id}
                        badge={userBadge}
                        earned={true}
                        variant="card"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              {userStats && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-lg mb-4">آمار فعالیت</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">نیازهای ایجاد شده:</span>
                      <span className="font-bold text-mblue">{userStats.needsCreated}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">نیازهای پشتیبانی شده:</span>
                      <span className="font-bold text-green-600">{userStats.needsSupported}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">تسک‌های تکمیل شده:</span>
                      <span className="font-bold text-purple-600">{userStats.tasksCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">تیم‌های عضو:</span>
                      <span className="font-bold text-orange-600">{userStats.teamsJoined}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">نظرات ارسالی:</span>
                      <span className="font-bold text-gray-600">{userStats.commentsPosted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">نشان‌های دریافتی:</span>
                      <span className="font-bold text-morange">{userStats.badgesEarned}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">استریک روزانه:</span>
                        <span className="font-bold text-red-600">🔥 {userStats.streak} روز</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-lg mb-4">دسترسی سریع</h3>
                <div className="space-y-2">
                  <Link
                    href="/network/leaderboard"
                    className="block p-3 bg-mblue/5 hover:bg-mblue/10 rounded-md text-sm font-bold text-mblue transition-colors"
                  >
                    🏆 جدول امتیازات
                  </Link>
                  <Link
                    href="/network/achievements"
                    className="block p-3 bg-morange/5 hover:bg-morange/10 rounded-md text-sm font-bold text-morange transition-colors"
                  >
                    🏅 نشان‌ها و دستاوردها
                  </Link>
                  <Link
                    href="/network/teams"
                    className="block p-3 bg-green-50 hover:bg-green-100 rounded-md text-sm font-bold text-green-600 transition-colors"
                  >
                    👥 تیم‌های من
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
