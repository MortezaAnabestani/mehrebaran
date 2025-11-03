"use client";

import React from "react";
import Link from "next/link";
import type { IStory, IUser } from "@mehrebaran/common-types";
import storyService from "@/services/story.service";

// ===========================
// Types & Interfaces
// ===========================

export interface StoryCardProps {
  story: IStory;
  hasUnviewed?: boolean;
  onClick?: () => void;
}

// ===========================
// StoryCard Component
// ===========================

/**
 * A story card component for displaying story previews
 * Shows user avatar, story preview, and unviewed indicator
 */
const StoryCard: React.FC<StoryCardProps> = ({
  story,
  hasUnviewed = false,
  onClick,
}) => {
  // ===========================
  // Helper Functions
  // ===========================

  const getUser = (): IUser => {
    return story.user as IUser;
  };

  const getUserName = (): string => {
    const user = getUser();
    return user.name || "کاربر";
  };

  const getUserAvatar = (): string | null => {
    const user = getUser();
    return user.avatar || null;
  };

  const getStoryPreview = (): string | null => {
    if (story.type === "image" && story.media?.url) {
      return story.media.url;
    }
    if (story.type === "video" && story.media?.thumbnail) {
      return story.media.thumbnail;
    }
    return null;
  };

  const getStoryBackground = (): string => {
    if (story.type === "text" && story.backgroundColor) {
      return story.backgroundColor;
    }
    return "bg-gradient-to-br from-mblue to-cyan-500";
  };

  const getStoryText = (): string | null => {
    if (story.type === "text" && story.text) {
      return story.text;
    }
    return null;
  };

  // ===========================
  // Event Handlers
  // ===========================

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // ===========================
  // Render
  // ===========================

  const userName = getUserName();
  const userAvatar = getUserAvatar();
  const storyPreview = getStoryPreview();
  const storyText = getStoryText();
  const timeAgo = storyService.getStoryTimeAgo(story.createdAt);
  const isExpired = storyService.isStoryExpired(story);

  return (
    <button
      onClick={handleClick}
      className="flex-shrink-0 w-28 cursor-pointer group"
      disabled={isExpired}
    >
      <div className="relative">
        {/* Story Preview */}
        <div
          className={`w-28 h-36 rounded-2xl overflow-hidden border-4 transition-all ${
            hasUnviewed
              ? "border-morange shadow-lg shadow-morange/30"
              : "border-gray-200"
          } ${isExpired ? "opacity-50 grayscale" : "group-hover:scale-105"}`}
        >
          {storyPreview ? (
            <img
              src={storyPreview}
              alt={`استوری ${userName}`}
              className="w-full h-full object-cover"
            />
          ) : storyText ? (
            <div
              className={`w-full h-full flex items-center justify-center p-3 ${getStoryBackground()}`}
              style={{
                backgroundColor: story.backgroundColor,
                color: story.textColor || "#ffffff",
              }}
            >
              <p className="text-sm text-center font-bold line-clamp-4">
                {storyText}
              </p>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-4xl">📷</span>
            </div>
          )}

          {/* Video Indicator */}
          {story.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-mblue mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}

          {/* Expired Overlay */}
          {isExpired && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xs font-bold">منقضی شده</span>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-lg"
            />
          ) : (
            <div className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-mblue to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
              {userName.charAt(0)}
            </div>
          )}

          {/* Unviewed Indicator (ring) */}
          {hasUnviewed && !isExpired && (
            <div className="absolute inset-0 rounded-full border-2 border-morange animate-ping"></div>
          )}
        </div>
      </div>

      {/* User Name */}
      <p className="text-xs text-gray-700 mt-5 text-center truncate px-1 font-medium">
        {userName}
      </p>

      {/* Time Ago */}
      <p className="text-xs text-gray-400 text-center mt-1">{timeAgo}</p>
    </button>
  );
};

export default StoryCard;
