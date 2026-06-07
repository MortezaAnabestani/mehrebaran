import React from "react";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { INeed } from "common-types";

interface InstagramProfileGridProps {
  needs: INeed[];
  isLoading?: boolean;
  emptyMessage?: string;
}

// Format number for display
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/**
 * InstagramProfileGrid - Skeuomorphic & Modern Grid Layout
 * بازطراحی شده با استایل اسکیومورفیسم مدرن و عمق‌دهی بصری
 */
const InstagramProfileGrid: React.FC<InstagramProfileGridProps> = ({
  needs,
  isLoading = false,
  emptyMessage = "هنوز پستی وجود ندارد",
}) => {
  // Loading State: Inset Skeuomorphic Effect (حالت فرورفته)
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 p-1 sm:p-1.5 md:p-2">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg sm:rounded-xl md:rounded-2xl bg-gray-100 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] animate-pulse border border-gray-200/50"
          />
        ))}
      </div>
    );
  }

  // Empty State: Soft UI Card (حالت برجسته نرم)
  if (needs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-24 px-3 sm:px-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-gray-100 flex items-center justify-center shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] mb-4 sm:mb-5 md:mb-6">
          <span className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow-sm grayscale opacity-50">📭</span>
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-1.5 sm:mb-2 drop-shadow-sm">پستی یافت نشد</h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-500 font-medium text-center max-w-xs mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 p-1 sm:p-1.5 md:p-2 lg:p-4 bg-gray-50/50 rounded-xl sm:rounded-2xl md:rounded-3xl">
      {needs.map((need) => {
        const image = need.images?.[0];
        const hasMultipleImages = need.images && need.images.length > 1;

        return (
          <Link
            key={need._id}
            href={`/network/needs/${need._id}`}
            className="group relative aspect-square rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_#ffffff] hover:shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_#ffffff] transition-all duration-300 transform hover:-translate-y-1 border border-white ring-1 ring-gray-100"
          >
            {/* Image Container with Inner Shadow for Depth */}
            <div className="w-full h-full relative">
              {image ? (
                <>
                  <OptimizedImage
                    src={image}
                    alt={need.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle Inner Bezel/Shadow */}
                  <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none rounded-lg sm:rounded-xl md:rounded-2xl z-10" />
                </>
              ) : (
                // Placeholder: Textured Gradient
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  <div className="text-center p-2 sm:p-3 md:p-4 z-10">
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-1.5 md:mb-2 drop-shadow-md">📝</div>
                    <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-500 line-clamp-2 drop-shadow-sm">
                      {need.title}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Multiple Images Indicator - 3D Badge Style */}
            {hasMultipleImages && (
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 z-20">
                <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-md sm:rounded-lg p-1 sm:p-1.5 shadow-lg">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Hover Overlay - Glassmorphism */}
            <div className="absolute inset-0 bg-[#007acc]/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 z-30">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                {/* Likes */}
                <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 fill-current drop-shadow-lg filter" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="font-bold text-xs sm:text-sm md:text-lg drop-shadow-md">
                    {formatNumber(need.upvotes?.length || 0)}
                  </span>
                </div>

                {/* Comments */}
                <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 fill-current drop-shadow-lg filter" viewBox="0 0 24 24">
                    <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
                  </svg>
                  <span className="font-bold text-xs sm:text-sm md:text-lg drop-shadow-md">
                    {formatNumber(need.commentsCount || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badge - 3D Pill Style */}
            {need.status && need.status !== "approved" && (
              <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 md:bottom-3 md:left-3 z-20">
                <div
                  className={`
                    flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full shadow-lg border border-white/20 backdrop-blur-sm
                    ${
                      need.status === "completed"
                        ? "bg-gradient-to-b from-green-400 to-green-600"
                        : need.status === "in_progress"
                        ? "bg-gradient-to-b from-[#007acc] to-[#005fa3]" // Brand Color Gradient
                        : "bg-gradient-to-b from-yellow-400 to-yellow-600"
                    }
                  `}
                >
                  <span className="text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider drop-shadow-sm">
                    {need.status === "completed"
                      ? "تکمیل شده"
                      : need.status === "in_progress"
                      ? "در حال انجام"
                      : "بررسی"}
                  </span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white shadow-inner animate-pulse" />
                </div>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default InstagramProfileGrid;
