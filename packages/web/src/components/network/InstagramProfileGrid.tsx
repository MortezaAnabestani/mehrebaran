"use client";

import React from "react";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { INeed } from "common-types";

interface InstagramProfileGridProps {
  needs: INeed[];
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * InstagramProfileGrid - Grid layout for posts (needs) in profile
 */
const InstagramProfileGrid: React.FC<InstagramProfileGridProps> = ({
  needs,
  isLoading = false,
  emptyMessage = "هنوز پستی وجود ندارد",
}) => {
  // Format number for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (needs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-4">📭</div>
        <h3 className="text-xl font-semibold mb-2">هیچ پستی یافت نشد</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {needs.map((need) => {
        const image = need.images?.[0];
        const hasMultipleImages = need.images && need.images.length > 1;

        return (
          <Link
            key={need._id}
            href={`/network/needs/${need._id}`}
            className="relative aspect-square group overflow-hidden bg-gray-100"
          >
            {/* Image */}
            {image ? (
              <OptimizedImage
                src={image}
                alt={need.title}
                width={400}
                height={400}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              // Placeholder for needs without images
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-xs text-gray-600 line-clamp-2">{need.title}</p>
                </div>
              </div>
            )}

            {/* Multiple Images Indicator */}
            {hasMultipleImages && (
              <div className="absolute top-2 right-2 text-white">
                <svg className="w-5 h-5 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="12" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="12" width="7" height="7" rx="1" />
                  <rect x="12" y="12" width="7" height="7" rx="1" />
                </svg>
              </div>
            )}

            {/* Hover Overlay with Stats */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
              <div className="flex items-center gap-1">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="font-semibold">{formatNumber(need.upvotes?.length || 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
                </svg>
                <span className="font-semibold">{formatNumber(need.commentsCount || 0)}</span>
              </div>
            </div>

            {/* Status Badge */}
            {need.status && need.status !== "approved" && (
              <div className="absolute bottom-2 left-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    need.status === "completed"
                      ? "bg-green-500 text-white"
                      : need.status === "in_progress"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {need.status === "completed"
                    ? "✓"
                    : need.status === "in_progress"
                    ? "⏳"
                    : "⏸"}
                </span>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default InstagramProfileGrid;
