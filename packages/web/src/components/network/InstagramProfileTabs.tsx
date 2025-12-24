"use client";

import React from "react";

export type TabType = "posts" | "tagged" | "saved";

interface InstagramProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isOwnProfile?: boolean;
}

/**
 * InstagramProfileTabs - Skeuomorphic Tab navigation
 * طراحی شده با سبک اسکیومورفیسم (Soft UI) برای ایجاد حس عمق و تعامل واقعی
 */
const InstagramProfileTabs: React.FC<InstagramProfileTabsProps> = ({
  activeTab,
  onTabChange,
  isOwnProfile = true,
}) => {
  const tabs = [
    {
      id: "posts" as TabType,
      label: "پست‌ها",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="13" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="13" width="7" height="7" rx="1" />
          <rect x="13" y="13" width="7" height="7" rx="1" />
        </svg>
      ),
      show: true,
    },
    {
      id: "tagged" as TabType,
      label: "تگ شده",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      show: true,
    },
    {
      id: "saved" as TabType,
      label: "ذخیره‌شده",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      ),
      show: isOwnProfile,
    },
  ];

  return (
    <div className="w-full bg-gray-100 px-6 select-none">
      {/* Container for the tabs mimicking a control panel surface */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-5 py-4 rounded-3xl">
          {tabs
            .filter((tab) => tab.show)
            .map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    relative group flex items-center justify-center gap-3 
                    py-3 px-6 rounded-2xl transition-all duration-300 ease-out
                    outline-none focus:outline-none
                    ${
                      isActive
                        ? "shadow-[inset_6px_6px_12px_#b8b9be,inset_-6px_-6px_12px_#ffffff] text-[#007acc]"
                        : "shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] text-gray-500 hover:text-gray-700 hover:-translate-y-0.5 active:shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] active:translate-y-0"
                    }
                  `}
                  aria-label={tab.label}
                  aria-pressed={isActive}
                >
                  {/* Icon Wrapper */}
                  <span
                    className={`transition-transform duration-300 ${
                      isActive ? "scale-110 drop-shadow-sm" : "group-hover:scale-105"
                    }`}
                  >
                    {tab.icon}
                  </span>

                  {/* Label */}
                  <span
                    className={`
                      text-sm font-bold tracking-wide hidden sm:inline-block transition-colors duration-300
                      ${isActive ? "text-[#007acc]" : "text-gray-500"}
                    `}
                  >
                    {tab.label}
                  </span>

                  {/* Active Indicator Dot (Optional aesthetic touch) */}
                  {isActive && (
                    <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-[#007acc] shadow-[0_0_5px_#007acc] opacity-80 sm:hidden" />
                  )}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default InstagramProfileTabs;
