"use client";

import React, { useState, useEffect, useRef } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
  duration?: number; // seconds
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
  onStoryChange?: (index: number) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex = 0,
  onClose,
  onStoryChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentStory = stories[currentIndex];
  const duration = currentStory?.duration || 5; // Default 5 seconds

  // Progress timer
  useEffect(() => {
    if (isPaused || !currentStory) return;

    startTimeRef.current = Date.now();
    const interval = 50; // Update every 50ms for smooth animation

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = (elapsed / (duration * 1000)) * 100;

      if (newProgress >= 100) {
        handleNext();
      } else {
        setProgress(newProgress);
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, currentStory, duration]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
      onStoryChange?.(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
      onStoryChange?.(currentIndex - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl z-50 hover:scale-110 transition-transform"
      >
        ×
      </button>

      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-40">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all"
              style={{
                width:
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Header */}
      <div className="absolute top-4 left-4 right-16 flex items-center gap-3 z-40">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
          {currentStory.userAvatar ? (
            <OptimizedImage
              src={currentStory.userAvatar}
              alt={currentStory.userName}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            currentStory.userName.charAt(0)
          )}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{currentStory.userName}</p>
          <p className="text-white/70 text-xs">
            {new Date(currentStory.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
      </div>

      {/* Story Content */}
      <div
        className="relative w-full max-w-md h-full max-h-[80vh] bg-black"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {currentStory.mediaType === "image" ? (
          <OptimizedImage
            src={currentStory.mediaUrl}
            alt="Story"
            width={500}
            height={800}
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            src={currentStory.mediaUrl}
            className="w-full h-full object-contain"
            autoPlay
            muted
            playsInline
          />
        )}

        {/* Navigation Areas */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
          onClick={handlePrevious}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
          onClick={handleNext}
        />
      </div>

      {/* Previous/Next Arrows for Desktop */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:scale-110 transition-transform"
        >
          ‹
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:scale-110 transition-transform"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default StoryViewer;
