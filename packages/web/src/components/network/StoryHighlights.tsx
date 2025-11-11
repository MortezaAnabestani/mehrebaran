"use client";

import React from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface Highlight {
  id: string;
  title: string;
  coverImage?: string;
  storiesCount: number;
}

interface StoryHighlightsProps {
  highlights: Highlight[];
  onHighlightClick?: (highlightId: string) => void;
  onAddHighlight?: () => void;
  isOwnProfile?: boolean;
}

/**
 * StoryHighlights - Instagram-style Story Highlights Section
 */
const StoryHighlights: React.FC<StoryHighlightsProps> = ({
  highlights,
  onHighlightClick,
  onAddHighlight,
  isOwnProfile = true,
}) => {
  if (highlights.length === 0 && !isOwnProfile) {
    return null;
  }

  return (
    <div className="px-4 md:px-12 py-4 border-t border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {/* Add New Highlight (Own Profile Only) */}
          {isOwnProfile && (
            <button
              onClick={onAddHighlight}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700 max-w-[80px] truncate">جدید</span>
            </button>
          )}

          {/* Existing Highlights */}
          {highlights.map((highlight) => (
            <button
              key={highlight.id}
              onClick={() => onHighlightClick?.(highlight.id)}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div className="w-20 h-20 rounded-full border-2 border-gray-300 p-0.5 hover:scale-105 transition-transform">
                {highlight.coverImage ? (
                  <OptimizedImage
                    src={highlight.coverImage}
                    alt={highlight.title}
                    width={76}
                    height={76}
                    className="rounded-full w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-2xl">
                    📖
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-gray-700 max-w-[80px] truncate">
                {highlight.title}
              </span>
            </button>
          ))}
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default StoryHighlights;
