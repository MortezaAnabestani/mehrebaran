"use client";

import React from "react";

export type TabType = "posts" | "tagged" | "saved";

interface InstagramProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isOwnProfile?: boolean;
}

/**
 * InstagramProfileTabs - Tab navigation for profile sections
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
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="13" y="3" width="7" height="7" />
          <rect x="3" y="13" width="7" height="7" />
          <rect x="13" y="13" width="7" height="7" />
        </svg>
      ),
      show: true,
    },
    {
      id: "tagged" as TabType,
      label: "تگ شده",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      ),
      show: isOwnProfile, // Only show for own profile
    },
  ];

  return (
    <div className="border-t border-gray-200">
      <div className="max-w-4xl mx-auto flex justify-center">
        {tabs
          .filter((tab) => tab.show)
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center gap-2 px-6 py-3 border-t-2 transition-colors ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className={activeTab === tab.id ? "text-gray-900" : "text-gray-400"}>
                {tab.icon}
              </span>
              <span className="text-xs font-semibold tracking-wide hidden sm:inline">
                {tab.label}
              </span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default InstagramProfileTabs;
