"use client";

import React from "react";
import { IBadge, IUserBadge } from "@/services/gamification.service";

interface AchievementCardProps {
  badge: IBadge | IUserBadge;
  earned?: boolean;
  earnedAt?: Date;
  progress?: number;
  variant?: "card" | "compact";
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  badge,
  earned = false,
  earnedAt,
  progress,
  variant = "card",
}) => {
  // اگر badge از نوع IUserBadge باشد
  const badgeData = "badge" in badge ? badge.badge : badge;
  const isEarned = earned || ("earnedAt" in badge && badge.earnedAt);
  const badgeProgress = progress || ("progress" in badge ? badge.progress : undefined);
  const dateEarned = earnedAt || ("earnedAt" in badge ? badge.earnedAt : undefined);

  // رنگ tier
  const getTierColor = (tier: string): string => {
    const colors: Record<string, string> = {
      bronze: "from-orange-400 to-orange-600",
      silver: "from-gray-300 to-gray-500",
      gold: "from-yellow-400 to-yellow-600",
      platinum: "from-cyan-400 to-cyan-600",
      diamond: "from-purple-400 to-purple-600",
    };
    return colors[tier] || "from-gray-400 to-gray-600";
  };

  // ترجمه tier
  const getTierLabel = (tier: string): string => {
    const labels: Record<string, string> = {
      bronze: "برنز",
      silver: "نقره",
      gold: "طلا",
      platinum: "پلاتین",
      diamond: "الماس",
    };
    return labels[tier] || tier;
  };

  // آیکون tier
  const getTierIcon = (tier: string): string => {
    const icons: Record<string, string> = {
      bronze: "🥉",
      silver: "🥈",
      gold: "🥇",
      platinum: "💎",
      diamond: "💠",
    };
    return icons[tier] || "🏅";
  };

  // Compact variant
  if (variant === "compact") {
    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-md border ${
          isEarned
            ? "bg-white border-morange/20"
            : "bg-gray-50 border-gray-200 opacity-50"
        }`}
      >
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTierColor(
            badgeData.tier
          )} flex items-center justify-center text-2xl shadow-md`}
        >
          {badgeData.icon || getTierIcon(badgeData.tier)}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h4 className="font-bold text-sm">{badgeData.name}</h4>
          <p className="text-xs text-gray-600">{getTierLabel(badgeData.tier)}</p>
        </div>

        {/* Earned indicator */}
        {isEarned && (
          <div className="text-green-600 text-lg">✓</div>
        )}
      </div>
    );
  }

  // Card variant
  return (
    <div
      className={`rounded-lg border overflow-hidden transition-all hover:shadow-lg ${
        isEarned
          ? "bg-white border-morange/30 shadow-md"
          : "bg-gray-50 border-gray-200 opacity-60"
      }`}
    >
      {/* Header */}
      <div
        className={`p-6 bg-gradient-to-br ${getTierColor(badgeData.tier)} text-white relative`}
      >
        {/* Earned badge */}
        {isEarned && (
          <div className="absolute top-2 right-2 bg-white text-green-600 text-xs font-bold px-2 py-1 rounded-full">
            ✓ دریافت شده
          </div>
        )}

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl mx-auto mb-3 shadow-lg">
          {badgeData.icon || getTierIcon(badgeData.tier)}
        </div>

        {/* Tier */}
        <p className="text-center text-xs font-bold uppercase tracking-wider">
          {getTierLabel(badgeData.tier)}
        </p>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-center mb-2">{badgeData.name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 text-center mb-3 line-clamp-2">
          {badgeData.description}
        </p>

        {/* Progress Bar (if not earned) */}
        {!isEarned && badgeProgress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">پیشرفت:</span>
              <span className="text-xs font-bold text-mblue">{badgeProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${getTierColor(badgeData.tier)} h-full rounded-full transition-all`}
                style={{ width: `${badgeProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Earned Date */}
        {isEarned && dateEarned && (
          <p className="text-xs text-center text-gray-500 mb-2">
            دریافت شده در: {new Date(dateEarned).toLocaleDateString("fa-IR")}
          </p>
        )}

        {/* Points Reward */}
        <div className="flex items-center justify-center gap-1 text-morange font-bold text-sm">
          <span>⭐</span>
          <span>{badgeData.pointsReward} امتیاز</span>
        </div>

        {/* Category */}
        <p className="text-xs text-center text-gray-500 mt-2">
          دسته: {badgeData.category}
        </p>
      </div>
    </div>
  );
};

export default AchievementCard;
