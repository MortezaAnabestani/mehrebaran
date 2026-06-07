"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OptimizedImage from "../ui/OptimizedImage";

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

interface LeftSidebarProps {
  onCreateNeed?: () => void;
}

const navItems: NavItem[] = [
  {
    label: "نیازها",
    icon: "/icons/needs.svg",
    href: "/network",
  },
  {
    label: "جستجوی مهر",
    icon: "/icons/analysis.svg",
    href: "/network/explore",
  },
  {
    label: "روایت مهر",
    icon: "/icons/storytelling.svg",
    href: "/network/stories",
  },
  {
    label: "تیم‌ها",
    icon: "/icons/team.svg",
    href: "/network/teams",
  },
  {
    label: "اولویت‌های فوری",
    icon: "/icons/increase.svg",
    href: "/network/trending",
  },
  {
    label: "پیشگامان مهر",
    icon: "/icons/leaderboard.svg",
    href: "/network/leaderboard",
  },
  {
    label: "کارنامۀ مهر",
    icon: "/icons/profile.svg",
    href: "/network/profile",
  },
];

/**
 * Modern Skeuomorphic Left Sidebar
 * Designed for High-End UI/UX Feel
 */
const LeftSidebar: React.FC<LeftSidebarProps> = ({ onCreateNeed }) => {
  const pathname = usePathname();

  return (
    <aside className="w-full h-full flex flex-col pr-4 py-6  text-slate-700 select-none">
      {/* --- Header & Logo Section --- */}
      <div className="mb-10 px-4 flex items-center gap-3">
        <Link href="/network" className="group relative outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] rounded-2xl block">
          {/* Logo Container with Soft Neumorphic Shadow */}
          <div className="p-2 rounded-2xl bg-[#eef2f6] shadow-[6px_6px_12px_#cad4e2,-6px_-6px_12px_#ffffff] transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
            <OptimizedImage
              src={"/icons/short_logo_mehrebaran.svg"}
              alt={"لوگوی مهرباران"}
              width={45}
              height={45}
              className="drop-shadow-md"
            />
          </div>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-sm font-extrabold text-[#007acc] tracking-tight">شبکۀ مهرباران</h1>
          <span className="text-[10px] text-slate-400 font-medium">سامانه هوشمند نیازسنجی</span>
        </div>
      </div>

      {/* --- Navigation Items --- */}
      <nav className="flex-1 space-y-3 px-2 ">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]
                ${
                  isActive
                    ? "text-[#007acc] font-bold shadow-[inset_3px_3px_6px_#cad4e2,inset_-3px_-3px_6px_#ffffff] bg-[#eef2f6]" // Pressed State (Inset Shadow)
                    : "text-slate-600 font-medium hover:bg-[#eef2f6] hover:shadow-[5px_5px_10px_#cad4e2,-5px_-5px_10px_#ffffff] hover:-translate-y-0.5" // Raised State on Hover
                }
              `}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#007acc] rounded-l-full shadow-[0_0_10px_#007acc]" />
              )}

              <div
                className={`relative transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              >
                <OptimizedImage
                  src={item.icon}
                  alt={item.label}
                  width={26}
                  height={26}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "brightness-100 drop-shadow-[0_2px_4px_rgba(0,122,204,0.3)]"
                      : "grayscale-[0.5] opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
                  }`}
                />
              </div>
              <span className="text-sm tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- Create Button (Primary Action) --- */}
      <div className="mt-6 px-4">
        <button
          onClick={onCreateNeed}
          className="
            w-full relative overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] focus-visible:ring-offset-2
            bg-gradient-to-b from-[#3399ff] to-[#007acc]
            text-white font-bold p-2 rounded-lg
            shadow-[6px_6px_12px_rgba(0,122,204,0.25),-2px_-2px_8px_rgba(255,255,255,0.5)]
            border-t border-[#66b3ff]
            transition-all duration-200
            active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2)] active:scale-[0.98] active:border-transparent
            hover:shadow-[0_8px_20px_rgba(0,122,204,0.4)] hover:-translate-y-0.5
          "
        >
          <div className="flex items-center justify-center gap-3 relative z-10">
            <span className="text-sm font-bold drop-shadow-md">ایجاد نیاز جدید</span>
            <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm shadow-inner">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          </div>

          {/* Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </button>
      </div>

      {/* --- Bottom Settings --- */}
      <div className="mt-4 pt-4 px-2 border-t border-slate-200/60">
        <Link
          href="/network/profile?tab=settings"
          className="
            flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]
            text-slate-500 hover:text-[#007acc]
            hover:shadow-[4px_4px_8px_#cad4e2,-4px_-4px_8px_#ffffff] hover:bg-[#eef2f6]
          "
        >
          <OptimizedImage
            src={"/icons/settings.svg"}
            alt={"تنظیمات"}
            width={24}
            height={24}
            className="opacity-60 hover:opacity-100 transition-opacity"
          />
          <span className="text-sm font-medium">تنظیمات سیستم</span>
        </Link>
      </div>
    </aside>
  );
};

export default LeftSidebar;
