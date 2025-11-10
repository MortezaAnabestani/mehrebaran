"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";

interface NavItem {
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

/**
 * Instagram-Style Left Sidebar Navigation
 */
const LeftSidebar: React.FC = () => {
  const pathname = usePathname();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navItems: NavItem[] = [
    {
      label: "نیازها",
      icon: "🏠",
      href: "/network",
    },
    {
      label: "کاوش",
      icon: "🔍",
      href: "/network/explore",
    },
    {
      label: "استوری‌ها",
      icon: "📖",
      href: "/network/stories",
    },
    {
      label: "تیم‌ها",
      icon: "👥",
      href: "/network/teams",
    },
    {
      label: "ترندینگ",
      icon: "🔥",
      href: "/network/trending",
    },
    {
      label: "لیدربورد",
      icon: "🏆",
      href: "/network/leaderboard",
    },
    {
      label: "پروفایل",
      icon: "👤",
      href: "/network/profile",
    },
  ];

  return (
    <div className="pr-3">
      {/* Logo */}
      <div className="mb-8 px-3">
        <Link href="/network">
          <Logo variant="full" size="md" />
        </Link>
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
                ${
                  isActive
                    ? "bg-gray-100 font-bold"
                    : "hover:bg-gray-50 font-normal"
                }
              `}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Create Button */}
      <div className="mt-6 px-3">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full bg-mblue hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>ایجاد نیاز</span>
        </button>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-6 px-3 border-t border-gray-200">
        <Link
          href="/settings"
          className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          <span className="text-2xl">⚙️</span>
          <span className="text-base">تنظیمات</span>
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;
