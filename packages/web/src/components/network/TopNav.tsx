"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { useAuth } from "@/contexts/AuthContext";
import { needService } from "@/services/need.service";
import { INeed } from "common-types";

/**
 * TopNav - Navigation bar for network page (Instagram-style)
 */
const TopNav: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<INeed[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Mock notification counts - will be replaced with API
  const [notificationCounts, setNotificationCounts] = useState({
    likes: 5,
    comments: 3,
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await needService.getNeeds({
          search: searchTerm,
          limit: 5,
        });
        setSearchResults(response.data);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const handleSearchSelect = (needId: string) => {
    setSearchTerm("");
    setShowSearchResults(false);
    router.push(`/network/needs/${needId}`);
  };

  const getUserAvatar = () => {
    return user?.avatar || "/images/default-avatar.png";
  };

  const getUserName = () => {
    return user?.name || "کاربر";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Home Link */}
          <div className="flex items-center gap-4">
            <Link href="/network" className="flex-shrink-0">
              <OptimizedImage
                src="/icons/logo.svg"
                alt="مهر باران"
                width={100}
                height={40}
                priority="up"
              />
            </Link>
            <Link
              href="/"
              className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-morange transition-colors px-3 py-1 rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="font-medium">صفحه اصلی</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-[600px] mx-8 relative" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="جستجوی نیازها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length >= 2 && setShowSearchResults(true)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-morange focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-morange rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50">
                  {searchResults.map((need) => (
                    <button
                      key={need._id}
                      onClick={() => handleSearchSelect(need._id)}
                      className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 text-right"
                    >
                      {need.images && need.images.length > 0 ? (
                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                          <OptimizedImage
                            src={need.images[0]}
                            alt={need.title}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">📋</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm line-clamp-1 text-gray-900">{need.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{need.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showSearchResults && searchResults.length === 0 && searchTerm.length >= 2 && !isSearching && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center text-gray-500 text-sm">
                  نتیجه‌ای یافت نشد
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Icons & User Menu */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Home Link (Mobile Only) */}
            <Link
              href="/"
              className="md:hidden text-gray-600 hover:text-morange transition-colors"
              title="صفحه اصلی"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>

            {/* Notifications */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Likes Notification */}
              <Link
                href="/network/notifications?type=likes"
                className="relative hover:opacity-70 transition-opacity"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {notificationCounts.likes > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCounts.likes > 9 ? "9+" : notificationCounts.likes}
                  </span>
                )}
              </Link>

              {/* Comments Notification */}
              <Link
                href="/network/notifications?type=comments"
                className="relative hover:opacity-70 transition-opacity"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {notificationCounts.comments > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCounts.comments > 9 ? "9+" : notificationCounts.comments}
                  </span>
                )}
              </Link>
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300">
                  <OptimizedImage
                    src={getUserAvatar()}
                    alt={getUserName()}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href={`/network/profile/${user?._id}`}
                    className="block px-4 py-2 hover:bg-gray-50 text-sm"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      پروفایل
                    </div>
                  </Link>

                  <Link
                    href="/network/settings"
                    className="block px-4 py-2 hover:bg-gray-50 text-sm"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      تنظیمات
                    </div>
                  </Link>

                  <Link
                    href="/network/saved"
                    className="block px-4 py-2 hover:bg-gray-50 text-sm"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                      ذخیره‌شده‌ها
                    </div>
                  </Link>

                  <hr className="my-2" />

                  <button
                    onClick={handleLogout}
                    className="block w-full text-right px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      خروج
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="جستجوی نیازها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setShowSearchResults(true)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-morange focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-morange rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>

          {/* Mobile Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50">
              {searchResults.map((need) => (
                <button
                  key={need._id}
                  onClick={() => handleSearchSelect(need._id)}
                  className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 text-right"
                >
                  {need.images && need.images.length > 0 ? (
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <OptimizedImage
                        src={need.images[0]}
                        alt={need.title}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📋</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm line-clamp-1 text-gray-900">{need.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{need.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
