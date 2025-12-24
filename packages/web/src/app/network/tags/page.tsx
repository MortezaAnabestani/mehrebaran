"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SmartButton from "@/components/ui/SmartButton"; // فرض بر این است که این دکمه استایل‌پذیر است
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { socialService, ITag } from "@/services/social.service";

// --- Sub-components for cleaner code ---

/**
 * کامپوننت کارت تگ با استایل Skeuomorphic/Tactile
 */
const TagCard: React.FC<{ tag: ITag }> = ({ tag }) => (
  <Link
    href={`/network/tags/${encodeURIComponent(tag.name)}`}
    className="group relative flex flex-col items-center justify-center p-6 
               bg-white rounded-2xl border border-gray-100
               shadow-[0_8px_20px_rgba(0,0,0,0.04)] 
               hover:shadow-[0_12px_24px_rgba(0,122,204,0.15)] 
               hover:-translate-y-1 transition-all duration-300 ease-out"
  >
    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </div>

    <div className="w-12 h-12 mb-3 rounded-full bg-blue-50 flex items-center justify-center text-[#007acc] shadow-inner">
      <span className="text-2xl font-black">#</span>
    </div>

    <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#007acc] transition-colors text-center">
      {tag.name}
    </h3>

    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
      <span className="font-semibold text-gray-700">{tag.usage.toLocaleString("fa-IR")}</span>
      <span>استفاده</span>
    </div>

    {tag.category && (
      <span className="mt-2 text-xs font-medium text-gray-400 uppercase tracking-wider">{tag.category}</span>
    )}
  </Link>
);

/**
 * اسکلتون لودینگ برای نمایش زیباتر در زمان بارگذاری
 */
const TagsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse border border-gray-200"></div>
    ))}
  </div>
);

// --- Main Page Component ---

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

  // Fetch Data
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

  // Search Handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true); // Show loading during search
      const response = await socialService.searchTags(searchQuery);
      setSearchResults(response.data);
    } catch (error: any) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTags = activeTab === "popular" ? popularTags : trendingTags;
  const displayTags = searchQuery ? searchResults : currentTags;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f4f7fa] font-sans text-gray-800">
        {/* Header Section with Brand Gradient & Depth */}
        <header className="relative w-full py-20 overflow-hidden bg-gradient-to-br from-[#007acc] to-[#005fa3] shadow-lg">
          {/* Decorative Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: "url('/images/patternMain.webp')", backgroundSize: "cover" }}
          />

          <div className="relative z-10 container mx-auto px-6 md:px-12 text-center md:text-right">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-md flex items-center justify-center md:justify-start gap-3">
              <span className="text-blue-200 opacity-80">#</span>
              کاوش تگ‌ها
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              موضوعات داغ را کشف کنید و به شبکه نیازهای مرتبط متصل شوید.
            </p>
          </div>

          {/* Curved Bottom Shape (Optional for modern feel) */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#f4f7fa] rounded-t-[2rem] translate-y-1/2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"></div>
        </header>

        {/* Content Container */}
        <div className="container mx-auto px-6 md:px-12 py-12 max-w-7xl">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <li>
                <Link href="/network" className="hover:text-[#007acc] transition-colors">
                  شبکه نیازسنجی
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="text-[#007acc]" aria-current="page">
                تگ‌ها
              </li>
            </ol>
          </nav>

          {/* Controls Section: Search & Tabs */}
          <section className="mb-12 space-y-8">
            {/* Search Bar - Tactile Inset Style */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto md:mx-0">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی هوشمند تگ..."
                  className="w-full pl-4 pr-12 py-4 rounded-2xl bg-gray-100 border-2 border-transparent 
                             text-gray-700 placeholder-gray-400 font-medium
                             shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] 
                             focus:bg-white focus:border-[#007acc]/30 focus:shadow-[0_0_0_4px_rgba(0,122,204,0.1)] 
                             focus:outline-none transition-all duration-300"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#007acc] transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 text-gray-400 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </form>

            {/* Tabs - 3D Button Style */}
            {!searchQuery && (
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab("popular")}
                  className={`
                    px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 transform active:scale-95
                    ${
                      activeTab === "popular"
                        ? "bg-[#007acc] text-white shadow-[0_4px_0_#005fa3] translate-y-[-2px]"
                        : "bg-white text-gray-600 border border-gray-200 shadow-[0_2px_0_#e5e7eb] hover:bg-gray-50 hover:text-[#007acc]"
                    }
                  `}
                >
                  🔥 محبوب‌ترین‌ها
                </button>
                <button
                  onClick={() => setActiveTab("trending")}
                  className={`
                    px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 transform active:scale-95
                    ${
                      activeTab === "trending"
                        ? "bg-[#007acc] text-white shadow-[0_4px_0_#005fa3] translate-y-[-2px]"
                        : "bg-white text-gray-600 border border-gray-200 shadow-[0_2px_0_#e5e7eb] hover:bg-gray-50 hover:text-[#007acc]"
                    }
                  `}
                >
                  📈 در حال رشد
                </button>
              </div>
            )}
          </section>

          {/* Results Section */}
          <section aria-live="polite" className="min-h-[300px]">
            {isLoading ? (
              <TagsSkeleton />
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
                <div className="text-red-500 bg-red-50 p-4 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-800 font-bold mb-4">{error}</p>
                <SmartButton variant="mblue" size="md" onClick={fetchTags}>
                  تلاش مجدد
                </SmartButton>
              </div>
            ) : displayTags.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-gray-300 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                </div>
                <p className="text-xl font-bold text-gray-600">
                  {searchQuery ? "نتیجه‌ای برای جستجوی شما یافت نشد." : "هنوز تگی ثبت نشده است."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="mt-4 text-[#007acc] hover:underline font-medium"
                  >
                    پاک کردن جستجو
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayTags.map((tag) => (
                  <article key={tag.name}>
                    <TagCard tag={tag} />
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default TagsPage;
