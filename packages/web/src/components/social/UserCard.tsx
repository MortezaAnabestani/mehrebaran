"use client";

import React, { useState } from "react";
import Link from "next/link";
import SmartButton from "@/components/ui/SmartButton";
import { socialService } from "@/services/social.service";

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    avatar?: string;
    level?: number;
    followersCount?: number;
    followingCount?: number;
  };
  currentUserId?: string;
  initialFollowState?: boolean;
  variant?: "card" | "compact" | "list";
  onFollowChange?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  currentUserId,
  initialFollowState = false,
  variant = "card",
  onFollowChange,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowState);
  const [isLoading, setIsLoading] = useState(false);

  const isCurrentUser = currentUserId === user._id;

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsLoading(true);
      if (isFollowing) {
        await socialService.unfollowUser(user._id);
        setIsFollowing(false);
      } else {
        await socialService.followUser(user._id);
        setIsFollowing(true);
      }
      if (onFollowChange) onFollowChange();
    } catch (error: any) {
      console.error("Follow toggle error:", error);
      alert(error.message || "خطا در عملیات");
    } finally {
      setIsLoading(false);
    }
  };

  // Compact variant - برای dropdown و لیست‌های کوچک
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
        <Link href={`/network/users/${user._id}`} className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-mblue text-white flex items-center justify-center font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm">{user.name}</p>
            {user.level && <p className="text-xs text-gray-500">سطح {user.level}</p>}
          </div>
        </Link>
        {!isCurrentUser && (
          <button
            onClick={handleFollowToggle}
            disabled={isLoading}
            className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
              isFollowing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-mblue text-white hover:bg-mblue/80"
            }`}
          >
            {isFollowing ? "دنبال‌شده" : "دنبال کردن"}
          </button>
        )}
      </div>
    );
  }

  // List variant - برای لیست‌های عمودی
  if (variant === "list") {
    return (
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md hover:shadow-md transition-shadow">
        <Link href={`/network/users/${user._id}`} className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-mblue text-white flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-bold">{user.name}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              {user.level && <span>سطح {user.level}</span>}
              {user.followersCount !== undefined && (
                <span>{user.followersCount.toLocaleString("fa-IR")} دنبال‌کننده</span>
              )}
              {user.followingCount !== undefined && (
                <span>{user.followingCount.toLocaleString("fa-IR")} دنبال‌شونده</span>
              )}
            </div>
          </div>
        </Link>
        {!isCurrentUser && (
          <SmartButton
            variant={isFollowing ? "mgray" : "mblue"}
            size="sm"
            onClick={handleFollowToggle}
            disabled={isLoading}
          >
            {isFollowing ? "دنبال‌شده ✓" : "دنبال کردن"}
          </SmartButton>
        )}
      </div>
    );
  }

  // Card variant (default) - برای grid
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <Link href={`/network/users/${user._id}`}>
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-mblue to-cyan-500 text-white flex items-center justify-center text-3xl font-bold mb-4">
            {user.name.charAt(0)}
          </div>

          {/* Name */}
          <h3 className="font-bold text-lg mb-2">{user.name}</h3>

          {/* Level */}
          {user.level && (
            <p className="text-sm text-gray-600 mb-3">سطح {user.level}</p>
          )}

          {/* Stats */}
          {(user.followersCount !== undefined || user.followingCount !== undefined) && (
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              {user.followersCount !== undefined && (
                <div className="text-center">
                  <p className="font-bold text-mblue">{user.followersCount.toLocaleString("fa-IR")}</p>
                  <p className="text-xs">دنبال‌کننده</p>
                </div>
              )}
              {user.followingCount !== undefined && (
                <div className="text-center">
                  <p className="font-bold text-gray-700">{user.followingCount.toLocaleString("fa-IR")}</p>
                  <p className="text-xs">دنبال‌شونده</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Follow Button */}
      {!isCurrentUser && (
        <SmartButton
          variant={isFollowing ? "mgray" : "mblue"}
          size="md"
          onClick={handleFollowToggle}
          disabled={isLoading}
          className="w-full mt-4"
        >
          {isFollowing ? "دنبال‌شده ✓" : "دنبال کردن"}
        </SmartButton>
      )}

      {isCurrentUser && (
        <Link href="/network/profile">
          <SmartButton variant="morange" size="md" className="w-full mt-4">
            مشاهده پروفایل
          </SmartButton>
        </Link>
      )}
    </div>
  );
};

export default UserCard;
