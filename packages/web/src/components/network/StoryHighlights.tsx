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
 * StoryHighlights - Skeuomorphic Design
 * A high-end, realistic looking story highlight section.
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
    <div className="w-full bg-gray-50/50 border-b border-white/50 backdrop-blur-sm py-6 relative overflow-hidden">
      {/* Background Texture/Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100/80 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 w-full overflow-hidden">
        {/* Scroll Container with Fade Masks */}
        <div className="relative group/scroll w-full">
          {/* Left Fade Mask */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-20 pointer-events-none md:hidden" />

          <div className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden pb-4 pt-2 px-4 md:px-12 scrollbar-hide snap-x snap-mandatory touch-pan-x overscroll-x-contain w-full">
            {/* Add New Highlight Button (Skeuomorphic Style) */}
            {isOwnProfile && (
              <button
                onClick={onAddHighlight}
                className="flex flex-col items-center gap-3 flex-shrink-0 group snap-start transition-all duration-200 active:scale-95"
              >
                <div className="relative w-[84px] h-[84px] flex items-center justify-center">
                  {/* Outer Ring (Metallic/Glass feel) */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.8)] border border-white/60" />

                  {/* Inner Recessed Circle */}
                  <div className="relative w-[76px] h-[76px] rounded-full bg-gray-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,1)] flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                    <svg
                      className="w-8 h-8 text-[#007acc] drop-shadow-sm transition-transform group-hover:rotate-90 duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-600 tracking-wide drop-shadow-[0_1px_0_rgba(255,255,255,1)]">
                  جدید
                </span>
              </button>
            )}

            {/* Existing Highlights */}
            {highlights.map((highlight) => (
              <button
                key={highlight.id}
                onClick={() => onHighlightClick?.(highlight.id)}
                className="flex flex-col items-center gap-3 flex-shrink-0 group snap-start transition-all duration-200 active:scale-95"
              >
                <div className="relative w-[84px] h-[84px] flex items-center justify-center">
                  {/* Outer Ring - Active/Brand Color Gradient */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#007acc] via-[#4db8ff] to-[#005c99] shadow-[0_4px_12px_rgba(0,122,204,0.3)] p-[3px]">
                    {/* Inner White Border to separate image from ring */}
                    <div className="w-full h-full rounded-full bg-white p-[3px] shadow-inner">
                      {/* Image Container */}
                      <div className="w-full h-full rounded-full overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                        {highlight.coverImage ? (
                          <OptimizedImage
                            src={highlight.coverImage}
                            alt={highlight.title}
                            width={76}
                            height={76}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                            <span className="text-2xl filter drop-shadow-md">📖</span>
                          </div>
                        )}
                        {/* Glossy Overlay on Image */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-full pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold text-gray-700 max-w-[80px] truncate drop-shadow-[0_1px_0_rgba(255,255,255,1)] group-hover:text-[#007acc] transition-colors">
                  {highlight.title}
                </span>
              </button>
            ))}
          </div>

          {/* Right Fade Mask */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent z-20 pointer-events-none md:hidden" />
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
        `}</style>
      </div>
    </div>
  );
};

export default StoryHighlights;
