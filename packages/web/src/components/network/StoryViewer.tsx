"use client";

import React, { useState, useEffect, useRef } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { X, ChevronLeft, ChevronRight, Pause } from "lucide-react"; // فرض بر استفاده از lucide-react برای آیکون‌های مدرن

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

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialIndex = 0, onClose, onStoryChange }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentStory = stories[currentIndex];
  const duration = currentStory?.duration || 5;

  // Reset loading state on story change
  useEffect(() => {
    setIsImageLoading(true);
    setProgress(0);
  }, [currentIndex]);

  // Progress Logic
  useEffect(() => {
    if (isPaused || !currentStory || isImageLoading) return;

    startTimeRef.current = Date.now() - (progress / 100) * (duration * 1000);
    const interval = 16; // ~60fps for smoother animation

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPaused, currentStory, duration, isImageLoading]);

  useEffect(() => {
    const handlePrevious = () => {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
        onStoryChange?.(currentIndex - 1);
      }
    };

    const handleNext = () => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        onStoryChange?.(currentIndex + 1);
      } else {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "Escape") onClose();
      if (e.key === " ") setIsPaused((prev) => !prev); // Space to toggle pause
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, stories.length, onClose, onStoryChange]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      onStoryChange?.(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      onStoryChange?.(currentIndex - 1);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
      {/* 1. Dynamic Blurred Background (Ambiance) */}
      <div className="absolute inset-0 z-0 opacity-40 scale-110 blur-3xl transition-all duration-700 ease-in-out">
        {currentStory.mediaType === "image" && (
          <OptimizedImage src={currentStory.mediaUrl} alt="background" fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 2. Main Story Container (Skeuomorphic Card) */}
      <div className="relative z-10 w-full h-full md:h-[85vh] md:w-auto md:aspect-[9/16] bg-black md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-black/50">
        {/* Top Gradient Overlay for readability */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />

        {/* 3. Progress Bars (Engraved Look) */}
        <div className="absolute top-4 left-3 right-3 flex gap-1.5 z-30">
          {stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] backdrop-blur-sm"
            >
              <div
                className="h-full rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_#007acc]"
                style={{
                  width: index < currentIndex ? "100%" : index === currentIndex ? `${progress}%` : "0%",
                  backgroundColor: "#007acc", // BRAND PRIMARY COLOR
                }}
              />
            </div>
          ))}
        </div>

        {/* 4. Header Info (Glassmorphism) */}
        <div className="absolute top-8 left-4 right-16 flex items-center gap-3 z-30">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#007acc] to-cyan-400 rounded-full opacity-75 blur-[2px] group-hover:opacity-100 transition duration-200"></div>
            <div className="relative w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden border-2 border-black">
              {currentStory.userAvatar ? (
                <OptimizedImage
                  src={currentStory.userAvatar}
                  alt={currentStory.userName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold">{currentStory.userName.charAt(0)}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col drop-shadow-md">
            <span className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
              {currentStory.userName}
              <span className="text-xs font-normal text-white/60">•</span>
              <span className="text-xs font-normal text-white/80">
                {new Date(currentStory.createdAt).toLocaleDateString("fa-IR")}
              </span>
            </span>
          </div>
        </div>

        {/* 5. Close Button (Tactile Floating Action Button) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-white/20 active:scale-95 active:shadow-inner transition-all duration-200"
        >
          <X size={20} />
        </button>

        {/* 6. Media Content */}
        <div
          className="w-full h-full flex items-center justify-center bg-[#0f0f0f]"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {isImageLoading && currentStory.mediaType === "image" && (
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-8 h-8 border-2 border-white/20 border-t-[#007acc] rounded-full animate-spin" />
            </div>
          )}

          {currentStory.mediaType === "image" ? (
            <OptimizedImage
              src={currentStory.mediaUrl}
              alt="Story"
              width={600}
              height={1000}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setIsImageLoading(false)}
            />
          ) : (
            <video
              src={currentStory.mediaUrl}
              className="w-full h-full object-contain"
              autoPlay
              muted
              playsInline
              onLoadedData={() => setIsImageLoading(false)}
            />
          )}
        </div>

        {/* 7. Navigation Overlays (Invisible but functional) */}
        <div className="absolute inset-0 z-20 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrevious} />
          <div className="w-1/3 h-full cursor-pointer" onClick={() => setIsPaused(!isPaused)} />{" "}
          {/* Center tap toggles pause */}
          <div className="w-1/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Pause Indicator */}
        {isPaused && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className="bg-black/40 backdrop-blur-md p-4 rounded-full border border-white/10 shadow-xl">
              <Pause className="text-white w-8 h-8 fill-current" />
            </div>
          </div>
        )}

        {/* Bottom Gradient for text readability if needed */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none" />
      </div>

      {/* 8. Desktop Navigation Controls (Skeuomorphic Buttons) */}
      <div className="hidden md:flex items-center justify-between absolute w-full max-w-4xl px-4 z-40 pointer-events-none">
        {currentIndex > 0 ? (
          <button
            onClick={handlePrevious}
            className="pointer-events-auto w-14 h-14 rounded-full bg-[#2a2a2a] border border-white/5 shadow-[5px_5px_10px_rgba(0,0,0,0.5),-2px_-2px_5px_rgba(255,255,255,0.05)] flex items-center justify-center text-white/80 hover:text-[#007acc] hover:scale-105 active:shadow-[inset_3px_3px_5px_rgba(0,0,0,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.05)] transition-all duration-200"
          >
            <ChevronLeft size={28} />
          </button>
        ) : (
          <div />
        )}

        {currentIndex < stories.length - 1 ? (
          <button
            onClick={handleNext}
            className="pointer-events-auto w-14 h-14 rounded-full bg-[#2a2a2a] border border-white/5 shadow-[5px_5px_10px_rgba(0,0,0,0.5),-2px_-2px_5px_rgba(255,255,255,0.05)] flex items-center justify-center text-white/80 hover:text-[#007acc] hover:scale-105 active:shadow-[inset_3px_3px_5px_rgba(0,0,0,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.05)] transition-all duration-200"
          >
            <ChevronRight size={28} />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
