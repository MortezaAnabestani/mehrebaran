"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import OptimizedImage from "@/components/ui/OptimizedImage";

/**
 * Instagram-Style Right Sidebar
 * Shows: User Profile, Suggestions, Trending
 */
const RightSidebar: React.FC = () => {
  const { user } = useAuth();

  // Mock data - در آینده از API می‌گیریم
  const suggestedUsers = [
    { id: "1", name: "علی محمدی", avatar: null, mutual: 5 },
    { id: "2", name: "زهرا احمدی", avatar: null, mutual: 3 },
    { id: "3", name: "محمد رضایی", avatar: null, mutual: 8 },
  ];

  const trendingTags = [
    { tag: "کمک_به_زلزله_زدگان", count: 1234 },
    { tag: "آموزش_رایگان", count: 856 },
    { tag: "نیاز_فوری", count: 645 },
  ];

  return (
    <div className="pr-4">
      {/* Current User Profile */}
      {user && (
        <div className="mb-6">
          <Link
            href="/network/profile"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mblue to-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <p className="text-gray-500 text-xs truncate">
                {user.email || user.mobile}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Suggestions Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-500 font-semibold text-sm">
            پیشنهاد دنبال کردن
          </h3>
          <Link
            href="/network/users"
            className="text-xs text-mblue hover:text-blue-600 font-semibold"
          >
            مشاهده همه
          </Link>
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((suggestedUser) => (
            <div key={suggestedUser.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {suggestedUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {suggestedUser.name}
                </p>
                <p className="text-gray-500 text-xs">
                  {suggestedUser.mutual} دوست مشترک
                </p>
              </div>
              <button className="text-xs text-mblue hover:text-blue-600 font-semibold">
                دنبال کردن
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="mb-6">
        <h3 className="text-gray-500 font-semibold text-sm mb-3">
          تگ‌های محبوب
        </h3>
        <div className="space-y-3">
          {trendingTags.map((item, index) => (
            <Link
              key={index}
              href={`/network/tags/${item.tag}`}
              className="block hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <p className="font-semibold text-sm text-mblue">
                #{item.tag}
              </p>
              <p className="text-gray-500 text-xs">
                {item.count.toLocaleString("fa-IR")} نیاز
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-xs text-gray-400 space-y-2">
        <div className="flex flex-wrap gap-2">
          <Link href="/about" className="hover:underline">درباره ما</Link>
          <span>•</span>
          <Link href="/help" className="hover:underline">راهنما</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:underline">حریم خصوصی</Link>
        </div>
        <p>© 2024 مهرباران</p>
      </div>
    </div>
  );
};

export default RightSidebar;
