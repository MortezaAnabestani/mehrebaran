"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { gamificationService, ILeaderboardResponse } from "@/services/gamification.service";
import {
  Trophy,
  Medal,
  TrendingUp,
  Target,
  Users,
  Star,
  Crown,
  Zap,
  ChevronUp,
  LayoutGrid,
  List,
} from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";

// --- Utility Components ---

// دکمه تب با استایل نئومورفیسم و انیمیشن
const NeumorphicTab = ({
  options,
  active,
  onChange,
}: {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  active: string;
  onChange: (val: any) => void;
}) => (
  <div className="bg-[#eef2f6] p-1 md:p-1.5 rounded-xl md:rounded-2xl shadow-inner flex items-center relative w-full overflow-hidden">
    {options.map((opt) => {
      const isActive = active === opt.value;
      return (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-bold rounded-lg md:rounded-xl transition-all duration-300 z-10 ${
            isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {isActive && (
            <motion.div
              layoutId="activeTabBackground"
              className="absolute inset-0 bg-white rounded-lg md:rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.8)]"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1 md:gap-2">
            {opt.icon && <span className="text-sm md:text-lg">{opt.icon}</span>}
            <span className="hidden xs:inline">{opt.label}</span>
          </span>
        </button>
      );
    })}
  </div>
);

// کامپوننت سکوی قهرمانی (Podium)
const Podium = ({ topThree }: { topThree: any[] }) => {
  if (topThree.length === 0) return null;

  const [second, first, third] = [topThree[1], topThree[0], topThree[2]];

  const PodiumStep = ({ entry, rank, color, height, delay }: any) => {
    if (!entry) return <div className="w-1/3"></div>;
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, type: "spring" }}
        className="flex flex-col items-center justify-end w-1/3 relative z-10"
      >
        {/* Avatar & Crown */}
        <div className="relative mb-4">
          {rank === 1 && (
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-18 left-1/2 -translate-x-1/2 drop-shadow-lg w-24 h-24 z-10"
            >
              <OptimizedImage src={"/icons/crown.svg"} alt="Avatar" width={100} height={100} />
            </motion.div>
          )}
          <div
            className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-4 ${color} shadow-xl overflow-hidden bg-white relative`}
          >
            {/* Placeholder Avatar if no image */}
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-2xl">
              {entry.user?.name?.charAt(0) || "?"}
            </div>
          </div>
          <div
            className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${color} flex items-center justify-center text-white font-bold shadow-md border-2 border-white`}
          >
            {rank}
          </div>
        </div>

        {/* Name & Score */}
        <div className="text-center mb-2">
          <h3 className="font-bold text-gray-800 text-sm md:text-base truncate max-w-[100px] md:max-w-[140px]">
            {entry.user?.name || "کاربر ناشناس"}
          </h3>
          <p className="text-xs font-bold text-mblue bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
            {entry.score.toLocaleString("fa-IR")} امتیاز
          </p>
        </div>

        {/* The Step Block */}
        <div
          className={`w-full rounded-t-2xl shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1)] bg-gradient-to-b from-white to-gray-50 border-t border-white/50 backdrop-blur-sm`}
          style={{ height: height }}
        >
          <div className={`w-full h-2 ${color} opacity-50 mt-0`}></div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex items-end justify-center gap-2 md:gap-4 h-[260px] md:h-[320px] mb-6 md:mb-8 px-2 md:px-4">
      <PodiumStep entry={second} rank={2} color="bg-gray-300 border-gray-300" height="100px md:140px" delay={0.2} />
      <PodiumStep entry={first} rank={1} color="bg-yellow-400 border-yellow-400" height="130px md:180px" delay={0.1} />
      <PodiumStep entry={third} rank={3} color="bg-orange-400 border-orange-400" height="70px md:100px" delay={0.3} />
    </div>
  );
};

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();

  // State
  const [leaderboard, setLeaderboard] = useState<ILeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("points");
  const [period, setPeriod] = useState<string>("all_time");

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      // شبیه‌سازی تاخیر برای دیدن لودینگ زیبا
      // await new Promise(r => setTimeout(r, 1000));
      const response = await gamificationService.getLeaderboard(category, period, 100);
      setLeaderboard(response.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [category, period]);

  // جدا کردن ۳ نفر اول برای نمایش در Podium
  const topThree = leaderboard?.entries.slice(0, 3) || [];
  const restOfList = leaderboard?.entries.slice(3) || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#eef2f6] text-gray-800 font-sans pb-24">
        {/* --- Header Background (Skeuomorphic Depth) --- */}
        <div className="bg-gradient-to-br from-[#007acc] to-[#005fa3] pb-20 md:pb-32 pt-6 md:pt-10 rounded-b-[30px] md:rounded-b-[50px] shadow-[0_20px_50px_rgba(0,122,204,0.3)] relative overflow-hidden">
          {/* Abstract Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl mix-blend-overlay"></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 md:px-4 py-1.5 rounded-full text-white text-xs md:text-sm font-medium mb-3 md:mb-4 shadow-lg"
            >
              <Trophy size={14} className="text-yellow-300 md:w-4 md:h-4" />
              <span>تالار افتخارات شبکه</span>
            </motion.div>
            <h1 className="text-2xl md:text-5xl font-black text-white mb-2 drop-shadow-md tracking-tight">
              برترین‌های جامعه
            </h1>
            <p className="text-blue-100 text-xs md:text-lg opacity-90 max-w-2xl mx-auto px-4">
              رقابت کنید، امتیاز بگیرید و جایگاه خود را در بین نخبگان شبکه تثبیت کنید.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-3 md:px-6 -mt-16 md:-mt-24 relative z-20 max-w-5xl">
          {/* --- User Stats Card (Glassmorphism + 3D Float) --- */}
          {leaderboard?.userEntry && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-6 md:mb-10"
            >
              <div className="bg-gradient-to-r from-white to-blue-50/50 rounded-[16px] md:rounded-[20px] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 border border-white/50">
                <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#007acc] to-[#005fa3] flex items-center justify-center text-white text-lg md:text-2xl font-black shadow-inner border-2 md:border-4 border-white relative z-10">
                      #{leaderboard.userEntry.rank}
                    </div>
                    <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-yellow-400 text-yellow-900 text-[10px] md:text-xs px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full font-bold border border-white md:border-2 shadow-sm z-20 flex items-center gap-0.5 md:gap-1">
                      <Zap size={10} fill="currentColor" className="md:w-3 md:h-3" />
                      Lvl {leaderboard.userEntry.level}
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <h3 className="text-base md:text-xl font-bold text-gray-800">{user?.name}</h3>
                    <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                      <div className="h-1.5 md:h-2 w-20 md:w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-400 w-[70%] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                      </div>
                      <span className="text-[10px] md:text-xs text-gray-400 font-bold">70% تا سطح بعد</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 md:gap-8 w-full md:w-auto justify-center">
                  <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-[4px_4px_10px_#eef2f6,-4px_-4px_10px_#ffffff] border border-gray-50 text-center min-w-[90px] md:min-w-[100px]">
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold mb-1">امتیاز کل</p>
                    <p className="text-base md:text-xl font-black text-[#007acc]">
                      {leaderboard.userEntry.score.toLocaleString("fa-IR")}
                    </p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-[4px_4px_10px_#eef2f6,-4px_-4px_10px_#ffffff] border border-gray-50 text-center min-w-[90px] md:min-w-[100px]">
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold mb-1">تغییر رتبه</p>
                    <p className="text-base md:text-xl font-black text-green-500 flex items-center justify-center gap-1">
                      <ChevronUp size={16} className="md:w-5 md:h-5" />
                      2+
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- Controls Section --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-10">
            <div className="space-y-2">
              <span className="text-[10px] md:text-xs font-bold text-gray-400 mr-2">دسته‌بندی</span>
              <NeumorphicTab
                active={category}
                onChange={setCategory}
                options={[
                  { value: "points", label: "امتیاز", icon: <Star size={12} className="md:w-3.5 md:h-3.5" /> },
                  { value: "needs_created", label: "نیازها", icon: <Target size={12} className="md:w-3.5 md:h-3.5" /> },
                  { value: "tasks_completed", label: "تسک‌ها", icon: <List size={12} className="md:w-3.5 md:h-3.5" /> },
                ]}
              />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] md:text-xs font-bold text-gray-400 mr-2">بازه زمانی</span>
              <NeumorphicTab
                active={period}
                onChange={setPeriod}
                options={[
                  { value: "all_time", label: "کل" },
                  { value: "monthly", label: "ماهانه" },
                  { value: "weekly", label: "هفتگی" },
                ]}
              />
            </div>
          </div>

          {/* --- Main Content Area --- */}
          <div className="bg-[#eef2f6] min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-[#007acc] rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-400 font-bold animate-pulse">در حال محاسبه رتبه‌ها...</p>
              </div>
            ) : (
              <>
                {/* 1. The Podium (Top 3) */}
                <Podium topThree={topThree} />

                {/* 2. The List (Rank 4+) */}
                <div className="bg-white rounded-2xl md:rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden p-2 md:p-6">
                  <div className="flex items-center justify-between px-2 md:px-4 py-2 md:py-3 mb-2 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <div className="w-10 md:w-12 text-center">رتبه</div>
                    <div className="flex-1 pr-2 md:pr-4">کاربر</div>
                    <div className="w-20 md:w-24 text-center hidden md:block">سطح</div>
                    <div className="w-16 md:w-24 text-center">امتیاز</div>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence mode="wait">
                      {restOfList.length > 0 ? (
                        restOfList.map((entry, index) => (
                          <motion.div
                            key={entry.user?._id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`group flex items-center justify-between p-2 md:p-3 rounded-xl md:rounded-2xl border border-transparent hover:border-blue-100 hover:bg-blue-50/50 transition-all duration-300 ${
                              entry.user?._id === user?._id
                                ? "bg-blue-50 border-blue-200 shadow-sm"
                                : "bg-white shadow-[2px_2px_8px_rgba(0,0,0,0.02)]"
                            }`}
                          >
                            {/* Rank */}
                            <div className="w-10 md:w-12 flex justify-center">
                              <span
                                className={`font-black text-sm md:text-lg ${
                                  entry.user?._id === user?._id ? "text-mblue" : "text-gray-400"
                                }`}
                              >
                                #{entry.rank}
                              </span>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 flex items-center gap-2 md:gap-3 pr-1 md:pr-2 min-w-0">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs md:text-sm shadow-inner flex-shrink-0">
                                {entry.user?.name?.charAt(0)}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span
                                  className={`font-bold text-xs md:text-sm truncate ${
                                    entry.user?._id === user?._id ? "text-mblue" : "text-gray-700"
                                  }`}
                                >
                                  {entry.user?.name}
                                </span>
                                {entry.user?._id === user?._id && (
                                  <span className="text-[9px] md:text-[10px] text-blue-400 font-medium">شما</span>
                                )}
                              </div>
                            </div>

                            {/* Level (Desktop) */}
                            <div className="w-20 md:w-24 text-center hidden md:block">
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg font-bold">
                                Lvl {entry.level}
                              </span>
                            </div>

                            {/* Score */}
                            <div className="w-16 md:w-24 text-center">
                              <span className="font-black text-xs md:text-base text-gray-800 group-hover:text-mblue transition-colors">
                                {entry.score.toLocaleString("fa-IR")}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-gray-400">داده‌ای برای نمایش وجود ندارد.</div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* --- Footer Info Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
            {[
              { title: "ایجاد نیاز", score: "+100", icon: "📢", color: "text-blue-500", bg: "bg-blue-50" },
              { title: "حمایت مالی", score: "+50", icon: "🤝", color: "text-green-500", bg: "bg-green-50" },
              {
                title: "تکمیل پروفایل",
                score: "+20",
                icon: "👤",
                color: "text-purple-500",
                bg: "bg-purple-50",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <span
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl ${item.bg} flex items-center justify-center text-base md:text-xl`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-xs md:text-sm font-bold text-gray-600">{item.title}</span>
                </div>
                <span className={`font-black text-sm md:text-base ${item.color}`}>{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default LeaderboardPage;
