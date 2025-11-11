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

const StoriesCarousel: React.FC<StoriesCarouselProps> = ({
  storyGroups,
  currentUserId,
  onCreateStory,
}) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

  const handleStoryClick = (groupIndex: number) => {
    setSelectedGroupIndex(groupIndex);
    setViewerOpen(true);
  };

  const currentUserHasStory = storyGroups.some((group) => group.userId === currentUserId);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {/* Add Story Button */}
        <div
          onClick={onCreateStory}
          className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
        >
          <div className="relative w-16 h-16">
            {currentUserHasStory ? (
              // User has story - show with gradient border
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mblue to-cyan-500 flex items-center justify-center text-white text-xl">
                    +
                  </div>
                </div>
              </div>
            ) : (
              // No story - show add button
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                +
              </div>
            )}
          </div>
          <span className="text-xs font-medium max-w-[64px] truncate">استوری شما</span>
        </div>

        {/* Story Groups */}
        {storyGroups.map((group, index) => (
          <div
            key={group.userId}
            onClick={() => handleStoryClick(index)}
            className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
          >
            <div className="relative w-16 h-16">
              {/* Gradient Border for New Stories */}
              {group.hasNew ? (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5 group-hover:scale-110 transition-transform">
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    {group.userAvatar ? (
                      <OptimizedImage
                        src={group.userAvatar}
                        alt={group.userName}
                        width={56}
                        height={56}
                        className="rounded-full w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                        {group.userName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Gray Border for Seen Stories
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 p-0.5 group-hover:scale-110 transition-transform">
                  {group.userAvatar ? (
                    <OptimizedImage
                      src={group.userAvatar}
                      alt={group.userName}
                      width={56}
                      height={56}
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold">
                      {group.userName.charAt(0)}
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className="text-xs font-medium max-w-[64px] truncate">{group.userName}</span>
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
            // Optional: Track story views
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
        }
      `}</style>
    </div>
  );
};

export default StoriesCarousel;
