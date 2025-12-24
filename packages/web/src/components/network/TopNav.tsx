"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { useAuth } from "@/contexts/AuthContext";
import { needService } from "@/services/need.service";
import { INeed } from "common-types";
import { Menu } from "lucide-react";

/**
 * TopNav - Professional Network Navigation
 * Style: Modern Skeuomorphism & Glassmorphism
 * Brand Color: #007acc
 */
interface TopNavProps {
  onMenuClick?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ onMenuClick }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<INeed[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Mock notification counts
  const [notificationCounts] = useState({
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
    router.push("/login");
  };

  const handleSearchSelect = (needId: string) => {
    setSearchTerm("");
    setShowSearchResults(false);
    router.push(`/network/needs/${needId}`);
  };

  const getUserAvatar = () => user?.avatar || "/images/default-avatar.png";
  const getUserName = () => user?.name || "کاربر";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200/60 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left Section - Menu Button (Mobile) & Logo */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Hamburger Menu Button - Mobile Only */}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-[#007acc] active:scale-95 transition-all"
                aria-label="منوی اصلی"
              >
                <Menu size={24} />
              </button>
            )}

            <Link
              href="/"
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-[#007acc] transition-colors group px-4 py-2 rounded-full hover:bg-blue-50/50"
            >
              <div className="p-1.5 bg-gray-100 rounded-full group-hover:bg-[#007acc] group-hover:text-white transition-all shadow-inner">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className="font-bold text-sm tracking-wide">صفحه اصلی</span>
            </Link>
          </div>

          {/* Search Bar - Skeuomorphic Style */}
          <div className="hidden md:flex flex-1 max-w-[500px] mx-8 relative z-50" ref={searchRef}>
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="جستجوی نیازها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length >= 2 && setShowSearchResults(true)}
                className="w-full bg-gray-100 text-gray-700 border-none rounded-full px-5 py-2.5 pr-12 
                           shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] 
                           focus:outline-none focus:ring-2 focus:ring-[#007acc]/50 focus:bg-white 
                           transition-all duration-300 placeholder-gray-400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#007acc] transition-colors">
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-[#007acc] rounded-full animate-spin"></div>
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
              {showSearchResults && (
                <div className="absolute top-full mt-3 w-full bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResults.length > 0 ? (
                    <div className="max-h-[350px] overflow-y-auto py-2">
                      {searchResults.map((need) => (
                        <button
                          key={need._id}
                          onClick={() => handleSearchSelect(need._id)}
                          className="w-full px-4 py-3 hover:bg-blue-50/50 flex items-center gap-4 border-b border-gray-50 last:border-b-0 text-right transition-colors group/item"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-100 group-hover/item:border-[#007acc]/30 transition-colors">
                            {need.images && need.images.length > 0 ? (
                              <OptimizedImage
                                src={need.images[0]}
                                alt={need.title}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-800 group-hover/item:text-[#007acc] transition-colors truncate">
                              {need.title}
                            </h4>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{need.description}</p>
                          </div>
                          <svg
                            className="w-4 h-4 text-gray-300 group-hover/item:text-[#007acc] -translate-x-2 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100 transition-all"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  ) : (
                    !isSearching &&
                    searchTerm.length >= 2 && (
                      <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 shadow-inner">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">نتیجه‌ای یافت نشد</span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Icons & User Menu */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Mobile Home Link */}
            <Link href="/" className="md:hidden p-2 text-gray-600 active:scale-95 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>

            {/* Notifications Group */}
            <div className="flex items-center gap-2 md:gap-3">
              {[
                {
                  type: "likes",
                  count: notificationCounts.likes,
                  icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                },
                {
                  type: "comments",
                  count: notificationCounts.comments,
                  icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                },
              ].map((item) => (
                <Link
                  key={item.type}
                  href={`/network/notifications?type=${item.type}`}
                  className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-[#007acc] transition-all duration-200 active:scale-95 group"
                >
                  <svg
                    className="w-6 h-6 drop-shadow-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.count > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-bold items-center justify-center border-2 border-white">
                        {item.count > 9 ? "9" : item.count}
                      </span>
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 p-1 rounded-full transition-all duration-200 ${
                  showUserMenu
                    ? "ring-2 ring-[#007acc] ring-offset-2"
                    : "hover:ring-2 hover:ring-gray-200 hover:ring-offset-1"
                }`}
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                  <OptimizedImage
                    src={getUserAvatar()}
                    alt={getUserName()}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute top-full left-0 mt-4 w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-800">{getUserName()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">کاربر فعال</p>
                  </div>

                  <div className="py-1">
                    {[
                      {
                        href: `/network/profile/${user?._id}`,
                        label: "پروفایل کاربری",
                        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                      },
                      {
                        href: "/network/settings",
                        label: "تنظیمات حساب",
                        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                      },
                      {
                        href: "/network/saved",
                        label: "ذخیره‌شده‌ها",
                        icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
                      },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-[#007acc] transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          className="w-5 h-5 opacity-70"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                        </svg>
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-right"
                    >
                      <svg
                        className="w-5 h-5 opacity-70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      خروج از حساب
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Refined */}
      <div className="md:hidden px-4 pb-4" ref={searchRef}>
        <div className="relative group">
          <input
            type="text"
            placeholder="جستجوی نیازها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setShowSearchResults(true)}
            className="w-full bg-gray-100 text-gray-700 border-none rounded-xl px-4 py-3 pr-11 
                       shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] 
                       focus:outline-none focus:ring-2 focus:ring-[#007acc]/50 focus:bg-white 
                       transition-all duration-300"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-gray-200 border-t-[#007acc] rounded-full animate-spin"></div>
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
            <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-[60vh] overflow-y-auto z-50">
              {searchResults.map((need) => (
                <button
                  key={need._id}
                  onClick={() => handleSearchSelect(need._id)}
                  className="w-full px-4 py-3 hover:bg-blue-50 flex items-center gap-3 border-b border-gray-50 last:border-b-0 text-right"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    {need.images && need.images.length > 0 ? (
                      <OptimizedImage
                        src={need.images[0]}
                        alt={need.title}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <span className="text-lg">📋</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{need.title}</h4>
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
