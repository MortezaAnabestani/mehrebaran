"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import OptimizedImage from "../ui/OptimizedImage";

interface NavItem {
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

interface LeftSidebarProps {
  onCreateNeed?: () => void;
}

/**
 * Instagram-Style Left Sidebar Navigation
 */
const LeftSidebar: React.FC<LeftSidebarProps> = ({ onCreateNeed }) => {
  const pathname = usePathname();

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

  return (
    <div className="pr-3">
      <div className="mb-8 px-3 flex items-center gap-2 animate-pulse">
        <Link href="/network">
          <OptimizedImage
            src={"/icons/short_logo_mehrebaran.svg"}
            alt={"لوگوی مهرباران"}
            width={50}
            height={50}
          />
        </Link>
        <h1 className="text-xs font-bold translate-y-1 p-2 text-white bg-[#3b80c3]">
          شبکۀ نیازسنجی مهرباران
        </h1>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200
                ${isActive ? "bg-gray-100 font-bold" : "hover:bg-gray-50 font-normal"}
              `}
            >
              <OptimizedImage
                src={item.icon}
                alt={"آیکون" + item.label}
                width={30}
                height={30}
                className="hover:animate-bounce"
              />
              <span className="text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Create Button */}
      <div className="mt-6 px-3">
        <button
          onClick={onCreateNeed}
          className="w-full bg-mblue hover:bg-mblue/90 cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span>ایجاد نیاز</span>
          <span className="text-xl">+</span>
        </button>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-6 px-3 border-t border-gray-200">
        <Link
          href="/settings"
          className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          <OptimizedImage
            src={"/icons/settings.svg"}
            alt={"آیکون تنظیمات"}
            width={30}
            height={30}
            className="hover:animate-bounce"
          />{" "}
          <span className="text-base">تنظیمات</span>
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;
