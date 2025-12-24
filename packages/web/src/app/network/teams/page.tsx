"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import TeamCard from "@/components/network/TeamCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { teamService, GetTeamsParams } from "@/services/team.service";
import { ITeam } from "common-types";

// آیکون‌های ساده برای بهبود بصری (می‌توانید با آیکون‌های پروژه خود جایگزین کنید)
const ChevronDownIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const TeamsPage: React.FC = () => {
  const router = useRouter();

  // --- State Management ---
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [myTeams, setMyTeams] = useState<ITeam[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");

  // --- Filters State ---
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedFocusArea, setSelectedFocusArea] = useState<string>("");

  // --- Data Fetching ---
  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: GetTeamsParams = {
        limit: 50,
        skip: 0,
      };

      if (selectedStatus) params.status = selectedStatus as any;
      if (selectedFocusArea) params.focusArea = selectedFocusArea;

      if (activeTab === "all") {
        const response = await teamService.getTeams(params);
        setTeams(response.data);
      } else {
        const response = await teamService.getMyTeams();
        setMyTeams(response.data);
      }
    } catch (err: any) {
      console.error("🔴 Failed to fetch teams:", err);
      setError(err.message || "خطا در دریافت اطلاعات تیم‌ها");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedStatus, selectedFocusArea]);

  const currentTeams = activeTab === "all" ? teams : myTeams;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f0f2f5] text-gray-800 font-sans">
        {/* --- Hero Header Section --- */}
        <header className="relative w-full bg-gradient-to-b from-white to-[#f0f2f5] border-b border-gray-200 shadow-sm overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply"
            style={{
              backgroundImage: "url('/images/patternMain.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16 flex items-center justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                <span className="text-[#007acc]">تیم‌های</span> نیازسنجی
              </h1>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                به شبکه‌ای از تیم‌های فعال بپیوندید، مهارت‌های خود را به اشتراک بگذارید و در پروژه‌های
                خیرخواهانه تأثیرگذار باشید.
              </p>
            </div>

            {/* 3D/Skeuomorphic Icon Container */}
            <div className="hidden md:flex items-center justify-center w-32 h-32 bg-white rounded-3xl shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
              <OptimizedImage
                src="/icons/needsNetwork_blue.svg"
                alt="Teams Network Icon"
                width={80}
                height={80}
                priority="up"
                className="drop-shadow-md"
              />
            </div>
          </div>
        </header>

        {/* --- Main Content Area --- */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
              <li>
                <Link href="/network" className="hover:text-[#007acc] transition-colors font-medium">
                  شبکه نیازسنجی
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-800 font-bold" aria-current="page">
                تیم‌ها
              </li>
            </ol>
          </nav>

          {/* --- Controls: Tabs & Actions --- */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            {/* Skeuomorphic Tabs (Segmented Control) */}
            <div className="bg-[#e6e9ef] p-1.5 rounded-xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] flex items-center gap-1 w-full md:w-auto">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ease-out ${
                  activeTab === "all"
                    ? "bg-white text-[#007acc] shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,1)] transform scale-[1.02]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                همه تیم‌ها
              </button>
              <button
                onClick={() => setActiveTab("my")}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ease-out ${
                  activeTab === "my"
                    ? "bg-white text-[#007acc] shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,1)] transform scale-[1.02]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                تیم‌های من
              </button>
            </div>

            {/* Action Button */}
            <div className="w-full md:w-auto shadow-lg shadow-[#007acc]/20 rounded-lg">
              <SmartButton
                variant="morange"
                size="md"
                onClick={() => router.push("/network/teams/create")}
                className="w-full md:w-auto font-bold"
              >
                + ایجاد تیم جدید
              </SmartButton>
            </div>
          </section>

          {/* --- Filters Section --- */}
          <section className="bg-white rounded-2xl p-6 mb-10 shadow-[4px_4px_10px_rgba(0,0,0,0.03),-4px_-4px_10px_rgba(255,255,255,0.8)] border border-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Filter */}
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 mb-2 mr-1 uppercase tracking-wider">
                  وضعیت تیم
                </label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full appearance-none bg-[#f0f2f5] text-gray-700 px-4 py-3 pr-10 rounded-xl border-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] focus:ring-2 focus:ring-[#007acc]/30 focus:outline-none transition-shadow cursor-pointer"
                  >
                    <option value="">نمایش همه</option>
                    <option value="active">فعال</option>
                    <option value="paused">متوقف شده</option>
                    <option value="completed">تکمیل شده</option>
                    <option value="disbanded">منحل شده</option>
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              {/* Focus Area Filter */}
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 mb-2 mr-1 uppercase tracking-wider">
                  حوزه فعالیت
                </label>
                <div className="relative">
                  <select
                    value={selectedFocusArea}
                    onChange={(e) => setSelectedFocusArea(e.target.value)}
                    className="w-full appearance-none bg-[#f0f2f5] text-gray-700 px-4 py-3 pr-10 rounded-xl border-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] focus:ring-2 focus:ring-[#007acc]/30 focus:outline-none transition-shadow cursor-pointer"
                  >
                    <option value="">نمایش همه</option>
                    <option value="fundraising">جمع‌آوری کمک (Fundraising)</option>
                    <option value="logistics">لجستیک و پشتیبانی</option>
                    <option value="communication">ارتباطات و رسانه</option>
                    <option value="technical">فنی و مهندسی</option>
                    <option value="volunteer">نیروی داوطلب</option>
                    <option value="coordination">هماهنگی و مدیریت</option>
                    <option value="documentation">مستندسازی</option>
                    <option value="general">عمومی</option>
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- Content Grid --- */}
          <section aria-live="polite" className="min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-[#007acc]/20 border-t-[#007acc] rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium animate-pulse">در حال بارگذاری اطلاعات...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center shadow-sm">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <SmartButton variant="mblue" size="sm" onClick={fetchTeams}>
                  تلاش مجدد
                </SmartButton>
              </div>
            ) : currentTeams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium text-lg mb-2">
                  {activeTab === "all" ? "تیمی یافت نشد." : "شما هنوز عضو هیچ تیمی نیستید."}
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  {activeTab === "all"
                    ? "با تغییر فیلترها دوباره تلاش کنید."
                    : "همین حالا اولین تیم خود را بسازید یا به تیمی بپیوندید."}
                </p>
                {activeTab === "my" && (
                  <SmartButton variant="outline" size="sm" onClick={() => setActiveTab("all")}>
                    مشاهده همه تیم‌ها
                  </SmartButton>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentTeams.map((team) => (
                  <div key={team._id} className="transform transition-all duration-300 hover:-translate-y-1">
                    <TeamCard team={team} variant="card" onUpdate={fetchTeams} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default TeamsPage;
