"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { socialService, ITag } from "@/services/social.service";

const TagsPage: React.FC = () => {
  const router = useRouter();

  // State
  const [popularTags, setPopularTags] = useState<ITag[]>([]);
  const [trendingTags, setTrendingTags] = useState<ITag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"popular" | "trending">("popular");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ITag[]>([]);

  // دریافت تگ‌ها
  const fetchTags = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [popularRes, trendingRes] = await Promise.all([
        socialService.getPopularTags(50),
        socialService.getTrendingTags(50),
      ]);

      setPopularTags(popularRes.data);
      setTrendingTags(trendingRes.data);
    } catch (err: any) {
      console.error("Failed to fetch tags:", err);
      setError(err.message || "خطا در دریافت تگ‌ها");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // جستجو در تگ‌ها
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await socialService.searchTags(searchQuery);
      setSearchResults(response.data);
    } catch (error: any) {
      console.error("Search error:", error);
    }
  };

  const currentTags = activeTab === "popular" ? popularTags : trendingTags;
  const displayTags = searchQuery ? searchResults : currentTags;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-mgray/5">
        {/* Header */}
        <header className="relative w-full py-15 bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden">
          <div
            className="absolute left-0 inset-0 bg-no-repeat bg-center pointer-events-none"
            style={{
              backgroundImage: "url('/images/patternMain.webp')",
              backgroundSize: "700px",
              opacity: 0.2,
              backgroundPosition: "left",
            }}
          ></div>
          <div className="relative z-10 flex items-center justify-between w-9/10 md:w-8/10 mx-auto gap-10">
            <div>
              <h1 className="text-lg md:text-3xl font-extrabold mb-5 flex items-center gap-3">
                <span className="text-4xl">#</span>
                تگ‌های محبوب
              </h1>
              <p className="font-bold text-xs md:text-base/loose opacity-90">
                نیازها را بر اساس تگ‌ها پیدا کنید و به موضوعات مورد علاقه‌تان دسترسی داشته باشید.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="w-9/10 md:w-8/10 mx-auto my-10">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm">
            <Link href="/network" className="text-mblue hover:underline">
              شبکه نیازسنجی
            </Link>
            <span className="mx-2 text-gray-500">←</span>
            <span className="text-gray-700">تگ‌ها</span>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی تگ..."
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-mblue/50"
              />
              <SmartButton type="submit" variant="mblue" size="md">
                جستجو
              </SmartButton>
              {searchQuery && (
                <SmartButton
                  type="button"
                  variant="mgray"
                  size="md"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  پاک کردن
                </SmartButton>
              )}
            </div>
          </form>

          {/* Tabs */}
          {!searchQuery && (
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setActiveTab("popular")}
                className={`flex-1 px-6 py-3 rounded-md font-bold transition-colors ${
                  activeTab === "popular"
                    ? "bg-purple-500 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                🔥 محبوب‌ترین
              </button>
              <button
                onClick={() => setActiveTab("trending")}
                className={`flex-1 px-6 py-3 rounded-md font-bold transition-colors ${
                  activeTab === "trending"
                    ? "bg-purple-500 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                📈 پرطرفدار
              </button>
            </div>
          )}

          {/* Tags Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mblue mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <SmartButton variant="mblue" size="sm" onClick={fetchTags}>
                  تلاش مجدد
                </SmartButton>
              </div>
            </div>
          ) : displayTags.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-600">
                {searchQuery ? "نتیجه‌ای یافت نشد." : "تگی وجود ندارد."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayTags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/network/tags/${encodeURIComponent(tag.name)}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-purple-300 transition-all group"
                >
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-purple-600 mb-2 group-hover:text-purple-700">
                      #{tag.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {tag.usage.toLocaleString("fa-IR")} استفاده
                    </p>
                    {tag.category && (
                      <p className="text-xs text-gray-500 mt-2">{tag.category}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TagsPage;
