"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import TeamCard from "@/components/network/TeamCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { teamService, GetTeamsParams } from "@/services/team.service";
import { ITeam } from "common-types";
import Link from "next/link";

const TeamsPage: React.FC = () => {
  const router = useRouter();

  // State
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [myTeams, setMyTeams] = useState<ITeam[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedFocusArea, setSelectedFocusArea] = useState<string>("");

  // دریافت تیم‌ها
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

      console.log("🔵 Fetching teams - activeTab:", activeTab, "params:", params);

      if (activeTab === "all") {
        const response = await teamService.getTeams(params);
        console.log("🔵 Teams response:", response);
        console.log("🔵 Teams data:", response.data);
        console.log("🔵 Teams count:", response.data?.length);
        setTeams(response.data);
      } else {
        const response = await teamService.getMyTeams();
        console.log("🔵 My teams response:", response);
        console.log("🔵 My teams data:", response.data);
        console.log("🔵 My teams count:", response.data?.length);
        setMyTeams(response.data);
      }
    } catch (err: any) {
      console.error("🔴 Failed to fetch teams:", err);
      setError(err.message || "خطا در دریافت تیم‌ها");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [activeTab, selectedStatus, selectedFocusArea]);

  const currentTeams = activeTab === "all" ? teams : myTeams;
  console.log(teams);
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-mgray/5">
        {/* Header */}
        <header className="relative w-full py-15 bg-mgray/5 overflow-hidden">
          <div
            className="absolute left-0 inset-0 bg-no-repeat bg-center pointer-events-none"
            style={{
              backgroundImage: "url('/images/patternMain.webp')",
              backgroundSize: "700px",
              opacity: 0.5,
              backgroundPosition: "left",
            }}
          ></div>
          <div className="relative z-10 flex items-center justify-between w-9/10 md:w-8/10 mx-auto gap-10">
            <div>
              <h1 className="text-lg md:text-2xl font-extrabold mb-5">تیم‌های نیازسنجی</h1>
              <p className="font-bold text-xs md:text-base/loose">
                به تیم‌های فعال بپیوندید، مهارت‌های خود را به اشتراک بگذارید و در پروژه‌های خیرخواهانه مشارکت
                کنید. با همکاری و هماهنگی، می‌توانیم تغییرات مثبتی ایجاد کنیم.
              </p>
            </div>
            <OptimizedImage
              src="/icons/needsNetwork_blue.svg"
              alt="teams icon"
              width={110}
              height={110}
              priority="up"
              className="hidden md:block"
            />
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
            <span className="text-gray-700">تیم‌ها</span>
          </div>

          {/* Tabs and Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-md font-bold transition-colors ${
                  activeTab === "all"
                    ? "bg-mblue text-white"
                    : "bg-white text-gray-700 border border-mgray/30 hover:bg-mgray/10"
                }`}
              >
                همه تیم‌ها
              </button>
              <button
                onClick={() => setActiveTab("my")}
                className={`px-4 py-2 rounded-md font-bold transition-colors ${
                  activeTab === "my"
                    ? "bg-mblue text-white"
                    : "bg-white text-gray-700 border border-mgray/30 hover:bg-mgray/10"
                }`}
              >
                تیم‌های من
              </button>
            </div>

            {/* Create Team Button */}
            <SmartButton variant="morange" size="md" onClick={() => router.push("/network/teams/create")}>
              + ایجاد تیم جدید
            </SmartButton>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 p-4 bg-white rounded-md border border-mgray/20">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-1 block">وضعیت:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-mgray/30 focus:outline-mblue/50 bg-white"
              >
                <option value="">همه</option>
                <option value="active">فعال</option>
                <option value="paused">متوقف</option>
                <option value="completed">تکمیل شده</option>
                <option value="disbanded">منحل شده</option>
              </select>
            </div>

            {/* Focus Area Filter */}
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-1 block">حوزه فعالیت:</label>
              <select
                value={selectedFocusArea}
                onChange={(e) => setSelectedFocusArea(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-mgray/30 focus:outline-mblue/50 bg-white"
              >
                <option value="">همه</option>
                <option value="fundraising">جمع‌آوری کمک</option>
                <option value="logistics">لجستیک</option>
                <option value="communication">ارتباطات</option>
                <option value="technical">فنی</option>
                <option value="volunteer">داوطلب</option>
                <option value="coordination">هماهنگی</option>
                <option value="documentation">مستندسازی</option>
                <option value="general">عمومی</option>
              </select>
            </div>
          </div>

          {/* Teams Grid */}
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
                <SmartButton variant="mblue" size="sm" onClick={fetchTeams}>
                  تلاش مجدد
                </SmartButton>
              </div>
            </div>
          ) : currentTeams.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {activeTab === "all" ? "تیمی یافت نشد." : "شما هنوز عضو هیچ تیمی نیستید."}
                </p>
                {activeTab === "my" && (
                  <SmartButton variant="mblue" size="sm" onClick={() => setActiveTab("all")}>
                    مشاهده همه تیم‌ها
                  </SmartButton>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTeams.map((team) => (
                <TeamCard key={team._id} team={team} variant="card" onUpdate={fetchTeams} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TeamsPage;
