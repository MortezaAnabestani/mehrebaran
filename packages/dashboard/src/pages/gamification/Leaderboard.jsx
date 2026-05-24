import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnhancedLeaderboard } from "../../features/gamificationSlice";
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  UserIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { leaderboard, loading } = useSelector((state) => state.gamification);

  const [timeframe, setTimeframe] = useState("allTime");

  useEffect(() => {
    loadData();
  }, [timeframe]);

  const loadData = async () => {
    try {
      const result = await dispatch(fetchEnhancedLeaderboard({ timeframe })).unwrap();
      console.log("✅ Leaderboard loaded:", result);
    } catch (error) {
      console.error("❌ Error loading leaderboard:", error);
    }
  };

  // آمار
  const stats = useMemo(() => {
    const total = leaderboard?.length || 0;
    const totalPoints = leaderboard?.reduce((sum, entry) => sum + (entry.totalPoints || 0), 0) || 0;
    const avgPoints = total > 0 ? Math.round(totalPoints / total) : 0;
    const topUser = leaderboard?.[0]?.user?.name || "N/A";

    return [
      { label: "TOTAL_USERS", value: total },
      { label: "TOTAL_POINTS", value: totalPoints },
      { label: "AVG_POINTS", value: avgPoints },
      { label: "TOP_USER", value: topUser },
    ];
  }, [leaderboard]);

  // تعیین رنگ مدال
  const getMedalColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-orange-700";
      default:
        return "text-slate-400";
    }
  };

  // آیکون مدال
  const getMedalIcon = (rank) => {
    if (rank <= 3) {
      return <TrophyIcon className={`w-6 h-6 ${getMedalColor(rank)}`} />;
    }
    return <span className="text-sm font-bold text-slate-500">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4">
      {/* --- HEADER & METRICS BAR --- */}
      <div className="bg-white border border-slate-200 rounded-md mb-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-3 gap-4">
          {/* Title & Breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#007acc]/10 flex items-center justify-center rounded-md border border-[#007acc]/20">
              <TrophyIcon className="w-4 h-4 text-[#007acc]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 uppercase tracking-wider">جدول امتیازات</h1>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span>ادمین</span>
                <span>/</span>
                <span>مدیریت گیمیفیکیشن شبکه</span>
              </div>
            </div>
          </div>

          {/* Metrics Strip */}
          <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}:</span>
                <span className="text-xs font-mono font-medium text-slate-700">{stat.value}</span>
                {index < stats.length - 1 && <div className="h-3 w-[1px] bg-slate-200 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar: Timeframe Selector */}
        <div className="border-t border-slate-100 p-2 flex items-center justify-between bg-slate-50/50">
          <div className="flex gap-2">
            <button
              onClick={() => setTimeframe("weekly")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                timeframe === "weekly"
                  ? "bg-[#007acc] text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-[#007acc]"
              }`}
            >
              هفتگی
            </button>
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                timeframe === "monthly"
                  ? "bg-[#007acc] text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-[#007acc]"
              }`}
            >
              ماهانه
            </button>
            <button
              onClick={() => setTimeframe("allTime")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                timeframe === "allTime"
                  ? "bg-[#007acc] text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-[#007acc]"
              }`}
            >
              همه زمان‌ها
            </button>
          </div>

          <button
            onClick={() => loadData()}
            className="p-1.5 text-slate-500 hover:text-[#007acc] hover:bg-[#007acc]/5 rounded border border-transparent hover:border-[#007acc]/20 transition-all"
            title="Refresh Data"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      {loading ? (
        <div className="flex justify-center items-center h-64 border border-dashed border-slate-300 rounded-md bg-slate-50/50">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-[#007acc] rounded-full"></div>
            <span className="text-xs text-slate-500 font-mono">LOADING_LEADERBOARD...</span>
          </div>
        </div>
      ) : leaderboard && leaderboard.length > 0 ? (
        <>
          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Second Place */}
              <div className="bg-white border border-slate-200 rounded-md p-4 text-center order-2 md:order-1">
                <div className="flex justify-center mb-3">
                  <TrophyIcon className="w-12 h-12 text-gray-400" />
                </div>
                {leaderboard[1]?.user?.profilePicture ? (
                  <img
                    src={leaderboard[1].user.profilePicture}
                    alt=""
                    className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-gray-300"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3 border-4 border-gray-300">
                    <UserIcon className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  {leaderboard[1]?.user?.name || "کاربر"}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mb-2">رتبه ۲</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                  <StarIcon className="w-3.5 h-3.5" />
                  {leaderboard[1]?.totalPoints || 0}
                </div>
              </div>

              {/* First Place */}
              <div className="bg-gradient-to-b from-yellow-50 to-white border border-yellow-300 rounded-md p-4 text-center transform md:scale-105 order-1 md:order-2">
                <div className="flex justify-center mb-3">
                  <TrophyIcon className="w-16 h-16 text-yellow-500" />
                </div>
                {leaderboard[0]?.user?.profilePicture ? (
                  <img
                    src={leaderboard[0].user.profilePicture}
                    alt=""
                    className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-yellow-500"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3 border-4 border-yellow-500">
                    <UserIcon className="w-10 h-10 text-slate-400" />
                  </div>
                )}
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  {leaderboard[0]?.user?.name || "کاربر"}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mb-2">رتبه ۱</p>
                <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                  <StarIcon className="w-4 h-4" />
                  {leaderboard[0]?.totalPoints || 0}
                </div>
              </div>

              {/* Third Place */}
              <div className="bg-white border border-slate-200 rounded-md p-4 text-center order-3">
                <div className="flex justify-center mb-3">
                  <TrophyIcon className="w-12 h-12 text-orange-700" />
                </div>
                {leaderboard[2]?.user?.profilePicture ? (
                  <img
                    src={leaderboard[2].user.profilePicture}
                    alt=""
                    className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-orange-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3 border-4 border-orange-700">
                    <UserIcon className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  {leaderboard[2]?.user?.name || "کاربر"}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mb-2">رتبه ۳</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  <StarIcon className="w-3.5 h-3.5" />
                  {leaderboard[2]?.totalPoints || 0}
                </div>
              </div>
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 bg-slate-100 border-b border-slate-200 p-2 text-[10px] font-bold text-slate-600 uppercase">
              <div className="col-span-1 text-center">رتبه</div>
              <div className="col-span-4">کاربر</div>
              <div className="col-span-2 text-center">امتیاز کل</div>
              <div className="col-span-2 text-center">سطح</div>
              <div className="col-span-3 text-center">نشان‌ها</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-100">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.user?._id || index}
                  className={`grid grid-cols-12 gap-2 p-2 hover:bg-slate-50 transition-colors text-xs ${
                    index < 3 ? "bg-blue-50/30" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center">
                    {getMedalIcon(index + 1)}
                  </div>

                  {/* User Info */}
                  <div className="col-span-4 flex items-center gap-2 min-w-0">
                    {entry.user?.profilePicture ? (
                      <img
                        src={entry.user.profilePicture}
                        className="w-8 h-8 rounded-full shrink-0"
                        alt=""
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                        <UserIcon className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-700 truncate">
                        {entry.user?.name || "کاربر"}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate font-mono">
                        @{entry.user?.username || "username"}
                      </p>
                    </div>
                  </div>

                  {/* Total Points */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded text-yellow-700 font-bold">
                      <StarIcon className="w-3.5 h-3.5" />
                      {entry.totalPoints || 0}
                    </div>
                  </div>

                  {/* Level */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-blue-700 font-bold">
                      <FireIcon className="w-3.5 h-3.5" />
                      {entry.level || 1}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="col-span-3 flex items-center justify-center">
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded text-purple-700 font-bold">
                      <TrophyIcon className="w-3.5 h-3.5" />
                      {entry.badges?.length || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border border-slate-200 rounded-md bg-white">
          <TrophyIcon className="w-10 h-10 text-slate-300 mb-2" />
          <p className="text-sm text-slate-500 font-medium">No Users in Leaderboard</p>
          <p className="text-xs text-slate-400 mt-1">Users will appear here as they earn points</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;