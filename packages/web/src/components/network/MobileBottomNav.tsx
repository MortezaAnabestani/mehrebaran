"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import OptimizedImage from "../ui/OptimizedImage";

interface NavItem {
  label: string;
  icon: string;
  href: string;
  shortLabel?: string;
}

interface MobileBottomNavProps {
  onCreateClick?: () => void;
}

/**
 * Mobile Bottom Navigation Bar
 * Inspired by Instagram's mobile navigation pattern
 * Only visible on mobile/tablet screens (< lg breakpoint)
 */
const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onCreateClick }) => {
  const pathname = usePathname();

  // Primary navigation items for bottom bar (max 5 items recommended)
  const navItems: NavItem[] = [
    {
      label: "نیازها",
      shortLabel: "خانه",
      icon: "/icons/needs.svg",
      href: "/network",
    },
    {
      label: "جستجو",
      shortLabel: "جستجو",
      icon: "/icons/analysis.svg",
      href: "/network/explore",
    },
    {
      label: "تیم‌ها",
      shortLabel: "تیم‌ها",
      icon: "/icons/team.svg",
      href: "/network/teams",
    },
    {
      label: "اولویت‌ها",
      shortLabel: "ترند",
      icon: "/icons/increase.svg",
      href: "/network/trending",
    },
    {
      label: "پروفایل",
      shortLabel: "پروفایل",
      icon: "/icons/profile.svg",
      href: "/network/profile",
    },
  ];

  return (
    <>
      {/* Bottom Navigation - Fixed at bottom on mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
        {/* Skeuomorphic shadow effect */}
        <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

        <div className="flex items-center justify-around px-2 py-2 relative">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-300
                  outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]
                  ${isActive ? "text-[#007acc]" : "text-gray-500"}
                `}
              >
                {/* Active Background Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute inset-0 bg-blue-50 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Icon */}
                <div className={`relative z-10 transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                  <OptimizedImage
                    src={item.icon}
                    alt={item.label}
                    width={24}
                    height={24}
                    className={`transition-all duration-300 ${
                      isActive
                        ? "brightness-100 drop-shadow-[0_2px_4px_rgba(0,122,204,0.3)]"
                        : "grayscale-[0.3] opacity-60"
                    }`}
                  />
                </div>

                {/* Label - Hidden on very small screens */}
                <span className={`relative z-10 text-[10px] font-bold tracking-tight hidden xs:block ${
                  isActive ? "text-[#007acc]" : "text-gray-400"
                }`}>
                  {item.shortLabel || item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Action Button (FAB) for Create - Mobile Only */}
      {onCreateClick && (
        <button
          onClick={onCreateClick}
          className="
            lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-50
            w-14 h-14 rounded-full
            bg-gradient-to-b from-[#3399ff] to-[#007acc]
            text-white shadow-[0_8px_24px_rgba(0,122,204,0.4)]
            border-4 border-white
            flex items-center justify-center
            active:scale-95 transition-transform duration-200
            hover:shadow-[0_12px_32px_rgba(0,122,204,0.5)]
            outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] focus-visible:ring-offset-2
          "
          aria-label="ایجاد نیاز جدید"
        >
          <svg
            width="24"
            height="24"
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
        </button>
      )}
    </>
  );
};

export default MobileBottomNav;
