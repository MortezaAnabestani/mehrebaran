"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { globalSearch, SearchResult } from "@/services/search.service";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const getResultUrl = (result: SearchResult): string => {
  switch (result.type) {
    case "project":
      return `/projects/${result.slug}`;
    case "news":
      return `/news/${result.slug}`;
    case "article":
      return `/blog/articles/${result.slug}`;
    case "video":
      return `/blog/videos/${result.slug}`;
    case "gallery":
      return `/blog/gallery/${result.slug}`;
    case "focus-area":
      return `/focus`;
    default:
      return "#";
  }
};

const getResultTypeLabel = (type: SearchResult["type"]): string => {
  const labels = {
    project: "پروژه",
    news: "خبر",
    article: "مقاله",
    video: "ویدیو",
    gallery: "گالری",
    "focus-area": "حوزه فعالیت",
  };
  return labels[type] || type;
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div>باران که می‌بارد تو در راهی...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    let ignore = false;

    if (query) {
      setLoading(true);
      globalSearch(query).then((response) => {
        if (!ignore) {
          setResults(response.results);
          setTotalResults(response.totalResults);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [query]);

  if (!query) {
    return (
      <main className="w-9/10 md:w-8/10 mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">جستجو</h1>
        <p className="text-gray-600">لطفاً عبارت مورد نظر خود را در کادر جستجو وارد کنید.</p>
      </main>
    );
  }

  return (
    <main className="w-9/10 md:w-8/10 mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">نتایج جستجو</h1>
        <p className="text-gray-600">
          جستجو برای: <span className="font-bold text-blue-600">{query}</span>
        </p>
        {!loading && <p className="text-sm text-gray-500 mt-2">{totalResults} نتیجه یافت شد</p>}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">در حال جستجو...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={getResultUrl(result)}
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
              >
                <div className="flex gap-4">
                  {result.coverImage && (
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 relative">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${result.coverImage.desktop || result.coverImage}`}
                          alt={result.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 96px, 128px"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {getResultTypeLabel(result.type)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                      {result.title}
                    </h2>
                    {result.description && (
                      <p className="text-gray-600 line-clamp-2">
                        {result.description.replace(/<[^>]*>/g, "").substring(0, 200)}...
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">نتیجه‌ای یافت نشد</h2>
          <p className="text-gray-600 mb-6">متأسفانه نتیجه‌ای برای عبارت {query} یافت نشد.</p>
          <p className="text-gray-500 text-sm">
            پیشنهاد می‌کنیم:
            <br />
            • از کلمات دیگری استفاده کنید
            <br />
            • عبارت خود را ساده‌تر کنید
            <br />• املای کلمات را بررسی کنید
          </p>
        </div>
      )}
    </main>
  );
}
