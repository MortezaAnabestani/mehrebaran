"use client";

import React, { useState } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import StoryViewer from "./StoryViewer";

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
  duration?: number;
}

interface StoryGroup {
  userId: string;
  userName: string;
  userAvatar?: string;
  stories: Story[];
  hasNew: boolean;
}

interface StoriesCarouselProps {
  storyGroups: StoryGroup[];
  currentUserId?: string;
  onCreateStory?: () => void;
}

const StoriesCarousel: React.FC<StoriesCarouselProps> = ({ storyGroups, currentUserId, onCreateStory }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

  const handleStoryClick = (groupIndex: number) => {
    setSelectedGroupIndex(groupIndex);
    setViewerOpen(true);
  };

  const currentUserHasStory = storyGroups.some((group) => group.userId === currentUserId);

  return (
    // Container: Skeuomorphic Card Style (Soft shadows, rounded corners)
    <div className="bg-[#f0f2f5] border border-white/50 shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] rounded-xl md:rounded-2xl mt-3 md:mt-4 w-full overflow-hidden">
      <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto overflow-y-hidden scrollbar-hide py-3 md:py-4 px-3 sm:px-4 touch-pan-x overscroll-x-contain w-full">
        {/* --- Add Story Button --- */}
        <div
          role="button"
          tabIndex={0}
          onClick={onCreateStory}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onCreateStory?.();
            }
          }}
          className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-2.5 flex-shrink-0 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] rounded-xl p-1"
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-1">
            {/* Outer Ring / Base */}
            <div className="absolute inset-0 rounded-full bg-[#f0f2f5] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff]"></div>

            {currentUserHasStory ? (
              // User has story: Glossy Blue Ring
              <div className="relative w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] md:w-[66px] md:h-[66px] rounded-full p-[2px] sm:p-[3px] bg-gradient-to-tr from-[#007acc] via-[#4db8ff] to-[#007acc] shadow-md">
                <div className="w-full h-full rounded-full bg-[#f0f2f5] flex items-center justify-center overflow-hidden border border-white sm:border-2">
                  <div className="w-full h-full bg-gradient-to-br from-[#007acc] to-[#005fa3] flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-inner">
                    +
                  </div>
                </div>
              </div>
            ) : (
              // No story: Skeuomorphic Button
              <div className="relative w-[50px] h-[50px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] rounded-full bg-[#f0f2f5] flex items-center justify-center border border-gray-100">
                {/* Inner pressed effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#e6e6e6] to-[#ffffff] opacity-50"></div>

                {/* The Plus Icon Button */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[#007acc] shadow-[2px_2px_5px_rgba(0,122,204,0.4),-2px_-2px_5px_rgba(255,255,255,0.2)] flex items-center justify-center text-white text-xl sm:text-2xl transition-transform group-active:scale-95">
                  <span className="drop-shadow-md">+</span>
                </div>
              </div>
            )}

            {/* Badge for "Add" if needed */}
            {!currentUserHasStory && (
              <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full shadow-inner"></div>
              </div>
            )}
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-gray-600 max-w-14 sm:max-w-16 md:max-w-[72px] truncate tracking-wide">
            استوری شما
          </span>
        </div>

        {/* --- Story Groups --- */}
        {storyGroups.map((group, index) => (
          <div
            key={group.userId}
            role="button"
            tabIndex={0}
            onClick={() => handleStoryClick(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStoryClick(index);
              }
            }}
            className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-2.5 flex-shrink-0 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] rounded-xl p-1"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-1">
              {/* Background Shadow for depth */}
              <div className="absolute inset-2 rounded-full shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]"></div>

              {group.hasNew ? (
                // NEW STORY: Glossy/Metallic Blue Ring (Brand Color)
                <div className="relative w-full h-full rounded-full p-[2px] sm:p-[3px] bg-gradient-to-tr from-[#007acc] via-[#60a5fa] to-[#004c80] shadow-[0_4px_6px_rgba(0,122,204,0.3)]">
                  {/* Inner white border to separate image from ring */}
                  <div className="w-full h-full rounded-full bg-white p-[1.5px] sm:p-[2px] shadow-inner">
                    {group.userAvatar ? (
                      <OptimizedImage
                        src={group.userAvatar}
                        alt={group.userName}
                        width={64}
                        height={64}
                        className="rounded-full w-full h-full object-cover shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#007acc] to-[#005fa3] flex items-center justify-center text-white text-sm sm:text-base md:text-lg font-bold shadow-inner">
                        {group.userName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // SEEN STORY: Metallic Silver/Gray Ring
                <div className="relative w-full h-full rounded-full p-[1.5px] sm:p-[2px] bg-gradient-to-tr from-gray-300 via-gray-100 to-gray-400 shadow-sm opacity-90">
                  <div className="w-full h-full rounded-full bg-[#f0f2f5] p-[1.5px] sm:p-[2px]">
                    {group.userAvatar ? (
                      <OptimizedImage
                        src={group.userAvatar}
                        alt={group.userName}
                        width={64}
                        height={64}
                        className="rounded-full w-full h-full object-cover filter grayscale-[30%]"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm sm:text-base md:text-lg font-bold shadow-inner">
                        {group.userName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span
              className={`text-[10px] sm:text-xs font-medium max-w-14 sm:max-w-16 md:max-w-[72px] truncate ${
                group.hasNew ? "text-gray-800 font-bold" : "text-gray-500"
              }`}
            >
              {group.userName}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {viewerOpen && selectedGroupIndex < storyGroups.length && (
        <StoryViewer
          stories={storyGroups[selectedGroupIndex].stories}
          initialIndex={0}
          onClose={() => setViewerOpen(false)}
          onStoryChange={(index) => {
            console.log("Story changed to index:", index);
          }}
        />
      )}

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
  );
};

export default StoriesCarousel;
