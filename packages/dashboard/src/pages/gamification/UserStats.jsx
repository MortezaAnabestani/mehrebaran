import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserStats, fetchMyBadges } from "../../features/gamificationSlice";
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  ChartBarIcon,
  CalendarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const UserStats = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { userStats, myBadges, loading } = useSelector((state) => state.gamification);

  // بارگذاری آمار کاربر
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        const result = await dispatch(fetchUserStats(userId)).unwrap();
        console.log("✅ User stats loaded:", result);
        if (!userId) {
          const badges = await dispatch(fetchMyBadges()).unwrap();
          console.log("✅ My badges loaded:", badges);
        }
      } catch (error) {
        console.error("❌ خطا در بارگذاری آمار کاربر:", error);
      }
    };

    loadUserStats();
  }, [dispatch, userId]);

  // تبدیل rarity به فارسی و رنگ‌بندی
  const getRarityConfig = (rarity) => {
    const config = {
      common: { label: "معمولی", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
      rare: { label: "نادر", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
      epic: { label: "حماسی", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
      legendary: {
        label: "افسانه‌ای",
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
      },
    };
    return config[rarity] || config.common;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full bg-slate-50 border border-slate-200 rounded-md">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#007acc]"></div>
          <span className="text-xs text-slate-500 font-mono">LOADING DATA...</span>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="p-4">
        <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded-md text-sm">
          آمار کاربر یافت نشد.
        </div>
      </div>
    );
  }

  const levelProgress = userStats.pointsToNextLevel
    ? ((userStats.currentLevelPoints / userStats.pointsToNextLevel) * 100).toFixed(0)
    : 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 font-sans text-slate-800" dir="rtl">
      <div className="grid grid-cols-12 gap-4">
        {/* --- Header Section: Profile & Main Stats --- */}
        <div className="col-span-12 lg:col-span-8 border border-slate-200 rounded-md bg-white overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              {userStats.user?.profilePicture ? (
                <img
                  src={userStats.user.profilePicture}
                  alt={userStats.user?.name}
                  className="w-16 h-16 rounded-md object-cover border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
                  <UserCircleIcon className="w-10 h-10 text-slate-400" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-[#007acc] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md border-2 border-white">
                LVL {userStats.level || 1}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{userStats.user?.name || "کاربر"}</h1>
                  <p className="text-xs text-slate-500 font-mono">
                    @{userStats.user?.username || "username"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                    XP Progress
                  </span>
                  <div className="text-xs font-mono text-slate-700">
                    {userStats.currentLevelPoints || 0} <span className="text-slate-400">/</span>{" "}
                    {userStats.pointsToNextLevel || 0}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#007acc] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 divide-x divide-x-reverse divide-slate-100 bg-slate-50/50">
            {[
              { icon: StarIcon, label: "امتیاز کل", value: userStats.totalPoints, color: "text-amber-500" },
              {
                icon: TrophyIcon,
                label: "نشان‌ها",
                value: userStats.badges?.length,
                color: "text-purple-500",
              },
              {
                icon: FireIcon,
                label: "روز پیاپی",
                value: userStats.currentStreak,
                color: "text-orange-500",
              },
              {
                icon: ChartBarIcon,
                label: "رتبه",
                value: `#${userStats.rank || "-"}`,
                color: "text-emerald-500",
              },
            ].map((stat, idx) => (
              <div key={idx} className="p-3 text-center hover:bg-slate-50 transition-colors">
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                <div className="text-sm font-bold text-slate-800 font-mono">{stat.value || 0}</div>
                <div className="text-[10px] text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Sidebar: Points Breakdown --- */}
        <div className="col-span-12 lg:col-span-4 border border-slate-200 rounded-md bg-white h-fit">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-sm font-semibold text-slate-700">تفکیک امتیازات</h3>
          </div>
          <div className="p-2">
            {userStats.pointsBreakdown && Object.entries(userStats.pointsBreakdown).length > 0 ? (
              <div className="space-y-1">
                {Object.entries(userStats.pointsBreakdown).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                  >
                    <span className="text-xs text-slate-600">
                      {key === "needsCreated" && "نیازهای ایجاد شده"}
                      {key === "needsSupported" && "نیازهای حمایت شده"}
                      {key === "teamsJoined" && "تیم‌های پیوسته"}
                      {key === "tasksCompleted" && "وظایف تکمیل شده"}
                      {key === "commentsPosted" && "نظرات ارسالی"}
                      {key === "storiesShared" && "داستان‌ها"}
                    </span>
                    <span className="text-xs font-mono font-medium text-[#007acc] bg-blue-50 px-1.5 py-0.5 rounded">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400">داده‌ای موجود نیست</div>
            )}
          </div>
        </div>

        {/* --- Badges Section --- */}
        <div className="col-span-12 border border-slate-200 rounded-md bg-white">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-sm font-semibold text-slate-700">نشان‌های کسب شده</h3>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {myBadges?.length || 0}
            </span>
          </div>

          <div className="p-4">
            {myBadges && Array.isArray(myBadges) && myBadges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {myBadges.map((userBadge) => {
                  const rarityConfig = getRarityConfig(userBadge.badge?.rarity);
                  return (
                    <div
                      key={userBadge._id}
                      className={`group relative flex flex-col items-center p-3 rounded-md border ${rarityConfig.border} ${rarityConfig.bg} bg-opacity-30 hover:bg-opacity-100 transition-all`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-2 shadow-sm"
                        style={{ backgroundColor: userBadge.badge?.color || "#e2e8f0", color: "#fff" }}
                      >
                        {userBadge.badge?.icon || "🏆"}
                      </div>
                      <span className="text-xs font-bold text-slate-700 text-center line-clamp-1">
                        {userBadge.badge?.name || "نشان"}
                      </span>
                      <span
                        className={`text-[10px] mt-1 px-1.5 rounded border ${rarityConfig.border} ${rarityConfig.text} bg-white`}
                      >
                        {rarityConfig.label}
                      </span>
                      {userBadge.earnedAt && (
                        <span className="text-[9px] text-slate-400 mt-2 font-mono">
                          {new Date(userBadge.earnedAt).toLocaleDateString("fa-IR")}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <TrophyIcon className="w-10 h-10 mb-2 opacity-20" />
                <span className="text-xs">هنوز نشانی کسب نشده است</span>
              </div>
            )}
          </div>
        </div>

        {/* --- Recent Activity --- */}
        {userStats.recentActivities && userStats.recentActivities.length > 0 && (
          <div className="col-span-12 border border-slate-200 rounded-md bg-white">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-sm font-semibold text-slate-700">فعالیت‌های اخیر</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {userStats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors">
                  <div className="p-1.5 bg-slate-100 rounded text-slate-500">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{activity.description}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {new Date(activity.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  {activity.points && (
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      +{activity.points}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStats;
