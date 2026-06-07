"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
// فرض بر این است که آیکون‌ها از کتابخانه‌ای مثل lucide-react یا heroicons ایمپورت می‌شوند
// اگر ندارید، می‌توانید با متن یا svg جایگزین کنید. در اینجا از svg های inline برای استقلال کد استفاده شده است.

/**
 * Skeuomorphic Right Sidebar
 * طراحی با الهام از متریال‌های واقعی، سایه‌های نرم و عمق میدان
 */
const RightSidebar: React.FC = () => {
  const { user } = useAuth();

  // Mock data
  const suggestedUsers = [
    { id: "1", name: "علی محمدی", avatar: null, mutual: 5, role: "توسعه‌دهنده" },
    { id: "2", name: "زهرا احمدی", avatar: null, mutual: 3, role: "طراح UI/UX" },
    { id: "3", name: "محمد رضایی", avatar: null, mutual: 8, role: "مدیر محصول" },
  ];

  const trendingTags = [
    { tag: "کمک_به_زلزله_زدگان", count: 1234, trend: "up" },
    { tag: "آموزش_رایگان", count: 856, trend: "stable" },
    { tag: "نیاز_فوری", count: 645, trend: "up" },
  ];

  return (
    <div className="pr-4 space-y-6">
      {/* --- User Profile Card (Skeuomorphic) --- */}
      {user && (
        <div className="relative overflow-hidden rounded-2xl bg-gray-100 p-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(0,0,0,0.05)] border border-gray-200/50">
          {/* Background Decor */}
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-[#007acc] to-[#005fa3] opacity-90"></div>

          <div className="relative z-10 flex flex-col items-center pt-8 pb-4 px-4 bg-white/40 backdrop-blur-sm rounded-xl mt-[1px] mx-[1px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
            <Link href="/network/profile" className="group flex flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] rounded-xl p-1">
              {/* Avatar Container with Ring */}
              <div className="relative p-1 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-[#007acc] font-bold text-2xl border-2 border-white shadow-inner">
                  {user.name?.charAt(0) || "U"}
                </div>
                {/* Online Status Indicator */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
              </div>

              <div className="mt-3 text-center">
                <h2 className="font-bold text-gray-800 text-base group-hover:text-[#007acc] transition-colors">
                  {user.name}
                </h2>
                <p className="text-gray-500 text-xs mt-0.5 font-medium">{user.email || user.mobile}</p>
              </div>
            </Link>

            {/* Stats Row */}
            <div className="flex justify-center gap-6 mt-4 w-full border-t border-gray-200/60 pt-3">
              <div className="text-center">
                <span className="block font-bold text-gray-800 text-sm">120</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">دنبال‌کننده</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-gray-800 text-sm">45</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">دنبال‌شونده</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Suggestions Section (Card Style) --- */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-gray-700 font-bold text-sm flex items-center gap-2">
            <span className="w-1 h-4 bg-[#007acc] rounded-full shadow-[0_0_8px_#007acc]"></span>
            پیشنهاد برای شما
          </h3>
          <Link
            href="/network/users"
            className="text-xs text-[#007acc] hover:text-[#005fa3] font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] rounded"
          >
            مشاهده همه
          </Link>
        </div>

        <div className="space-y-4">
          {suggestedUsers.map((suggestedUser) => (
            <div key={suggestedUser.id} className="flex items-center gap-3 group">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white shadow-[0_2px_5px_rgba(0,0,0,0.1)] flex items-center justify-center text-gray-600 font-bold text-sm flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {suggestedUser.name.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm truncate group-hover:text-[#007acc] transition-colors">
                  {suggestedUser.name}
                </p>
                <p className="text-gray-400 text-[11px] truncate">
                  {suggestedUser.role} • {suggestedUser.mutual} مشترک
                </p>
              </div>

              {/* Action Button (Skeuomorphic) */}
              <button 
                aria-label="دنبال کردن"
                className="w-8 h-8 rounded-full bg-[#f0f2f5] text-[#007acc] shadow-[3px_3px_6px_#d1d5db,-3px_-3px_6px_#ffffff] hover:shadow-[inset_2px_2px_5px_#d1d5db,inset_-2px_-2px_5px_#ffffff] active:scale-95 transition-all flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- Trending Tags (Inset Style) --- */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.04)] border border-gray-100">
        <h3 className="text-gray-700 font-bold text-sm mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#007acc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          تگ‌های داغ
        </h3>
        <div className="space-y-2">
          {trendingTags.map((item, index) => (
            <Link
              key={index}
              href={`/network/tags/${item.tag}`}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]"
            >
              <div className="flex flex-col">
                <span className="font-bold text-sm text-gray-700 group-hover:text-[#007acc] transition-colors">
                  #{item.tag.replace(/_/g, " ")}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {item.count.toLocaleString("fa-IR")} پست مرتبط
                </span>
              </div>
              {item.trend === "up" && (
                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 shadow-sm">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* --- Footer --- */}
      <div className="px-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400 font-medium">
          <Link href="/about" className="hover:text-[#007acc] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] rounded-sm">
            درباره ما
          </Link>
          <Link href="/help" className="hover:text-[#007acc] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] rounded-sm">
            راهنما
          </Link>
          <Link href="/privacy" className="hover:text-[#007acc] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] rounded-sm">
            حریم خصوصی
          </Link>
          <Link href="/terms" className="hover:text-[#007acc] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] rounded-sm">
            قوانین
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
