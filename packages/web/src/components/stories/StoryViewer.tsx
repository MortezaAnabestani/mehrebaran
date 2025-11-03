"use client";

import React, { useEffect, useState, useRef } from "react";
import type { IStory, IUser } from "@mehrebaran/common-types";
import storyService from "@/services/story.service";
import SmartButton from "@/components/ui/SmartButton";

// ===========================
// Types & Interfaces
// ===========================

export interface StoryViewerProps {
  stories: IStory[];
  initialIndex?: number;
  onClose: () => void;
  onStoryChange?: (index: number) => void;
}

// ===========================
// StoryViewer Component
// ===========================

/**
 * A fullscreen story viewer component
 * Supports image, video, and text stories with reactions
 */
const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex = 0,
  onClose,
  onStoryChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showReactions, setShowReactions] = useState<boolean>(false);

  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(Date.now());
  const viewedStories = useRef<Set<string>>(new Set());

  const currentStory = stories[currentIndex];
  const storyDuration = currentStory?.type === "video"
    ? (currentStory.media?.duration || 10) * 1000
    : 5000; // 5 seconds for image/text

  // ===========================
  // Story Navigation
  // ===========================

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  // ===========================
  // Progress Management
  // ===========================

  useEffect(() => {
    if (!currentStory || isPaused) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      return;
    }

    startTime.current = Date.now();
    setProgress(0);

    // Mark as viewed if not already
    if (!viewedStories.current.has(currentStory._id)) {
      storyService.viewStory(currentStory._id);
      viewedStories.current.add(currentStory._id);
    }

    // Update progress
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const newProgress = (elapsed / storyDuration) * 100;

      if (newProgress >= 100) {
        goToNext();
      } else {
        setProgress(newProgress);
      }
    }, 50);

    // Notify parent
    if (onStoryChange) {
      onStoryChange(currentIndex);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, currentStory, isPaused]);

  // ===========================
  // Event Handlers
  // ===========================

  const handleReaction = async (emoji: string) => {
    try {
      await storyService.reactToStory(currentStory._id, emoji);
      setShowReactions(false);
    } catch (error) {
      console.error("Error reacting to story:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowRight") {
      goToPrevious();
    } else if (e.key === "ArrowLeft") {
      goToNext();
    } else if (e.key === " ") {
      e.preventDefault();
      setIsPaused(!isPaused);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, currentIndex]);

  // ===========================
  // Helper Functions
  // ===========================

  const getUser = (): IUser => {
    return currentStory.user as IUser;
  };

  const getUserName = (): string => {
    const user = getUser();
    return user.name || "کاربر";
  };

  const getUserAvatar = (): string | null => {
    const user = getUser();
    return user.avatar || null;
  };

  if (!currentStory) {
    return null;
  }

  // ===========================
  // Render
  // ===========================

  const userName = getUserName();
  const userAvatar = getUserAvatar();
  const timeAgo = storyService.getStoryTimeAgo(currentStory.createdAt);
  const reactionEmojis = ["❤️", "😂", "😮", "😢", "👏", "🔥", "🎉"];

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-4">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width:
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex
                    ? `${progress}%`
                    : "0%",
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-0 right-0 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-mblue to-cyan-500 flex items-center justify-center text-white font-bold">
              {userName.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-white font-bold text-sm">{userName}</p>
            <p className="text-white/70 text-xs">{timeAgo}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Story Content */}
      <div className="w-full h-full flex items-center justify-center">
        {currentStory.type === "image" && currentStory.media?.url && (
          <img
            src={currentStory.media.url}
            alt="استوری"
            className="max-w-full max-h-full object-contain"
            onLoad={() => setProgress(0)}
          />
        )}

        {currentStory.type === "video" && currentStory.media?.url && (
          <video
            src={currentStory.media.url}
            className="max-w-full max-h-full object-contain"
            autoPlay
            muted
            onEnded={goToNext}
          />
        )}

        {currentStory.type === "text" && currentStory.text && (
          <div
            className="w-full h-full flex items-center justify-center p-12"
            style={{
              backgroundColor: currentStory.backgroundColor || "#3b80c3",
              color: currentStory.textColor || "#ffffff",
            }}
          >
            <p
              className="text-4xl text-center font-bold"
              style={{ fontFamily: currentStory.fontFamily || "inherit" }}
            >
              {currentStory.text}
            </p>
          </div>
        )}

        {/* Caption */}
        {currentStory.caption && (
          <div className="absolute bottom-20 left-0 right-0 px-6">
            <p className="text-white text-center bg-black/50 rounded-lg p-3">
              {currentStory.caption}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Areas */}
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-20 bottom-20 w-1/3 cursor-pointer"
        disabled={currentIndex === 0}
      />
      <button
        onClick={goToNext}
        className="absolute right-0 top-20 bottom-20 w-1/3 cursor-pointer"
      />

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 px-4">
        {/* Pause/Play */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
        >
          {isPaused ? "▶️" : "⏸️"}
        </button>

        {/* Reactions */}
        <div className="relative">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
          >
            ❤️
          </button>

          {showReactions && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-3 shadow-2xl flex gap-2">
              {reactionEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Views Count */}
        <div className="px-4 py-2 rounded-full bg-black/50 text-white text-sm">
          👁️ {currentStory.viewsCount}
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
