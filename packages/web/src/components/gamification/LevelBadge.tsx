"use client";

import React from "react";
import { ILevel, getLevelProgressPercentage, getPointsToNextLevel } from "@/services/gamification.service";

interface LevelBadgeProps {
  currentLevel: ILevel;
  currentPoints: number;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  showTitle?: boolean;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({
  currentLevel,
  currentPoints,
  size = "md",
  showProgress = true,
  showTitle = true,
}) => {
  const progressPercentage = getLevelProgressPercentage(currentPoints);
  const pointsToNext = getPointsToNextLevel(currentPoints);

  // رنگ level بر اساس سطح
  const getLevelColor = (level: number): string => {
    if (level >= 18) return "from-red-500 to-pink-500"; // Ruby, Mythical
    if (level >= 16) return "from-purple-500 to-indigo-500"; // Diamond, Emerald
    if (level >= 13) return "from-blue-500 to-cyan-500"; // Legend, Star, Shining Star
    if (level >= 10) return "from-green-500 to-teal-500"; // Leader, Inspirational, Champion
    if (level >= 7) return "from-yellow-500 to-orange-500"; // Top Active, Expert, Master
    if (level >= 4) return "from-orange-400 to-red-400"; // Committed, Supporter, Contributor
    return "from-gray-400 to-gray-500"; // Newcomer, Beginner, Active
  };

  // اندازه‌ها
  const sizeClasses = {
    sm: {
      badge: "w-12 h-12 text-lg",
      container: "gap-2",
      title: "text-xs",
      points: "text-xs",
      progressBar: "h-1",
    },
    md: {
      badge: "w-16 h-16 text-2xl",
      container: "gap-3",
      title: "text-sm",
      points: "text-sm",
      progressBar: "h-2",
    },
    lg: {
      badge: "w-20 h-20 text-3xl",
      container: "gap-4",
      title: "text-base",
      points: "text-base",
      progressBar: "h-3",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-center ${sizes.container}`}>
      {/* Level Badge */}
      <div
        className={`${sizes.badge} rounded-full bg-gradient-to-br ${getLevelColor(
          currentLevel.level
        )} text-white flex items-center justify-center font-extrabold shadow-lg`}
        title={currentLevel.title}
      >
        {currentLevel.level}
      </div>

      {/* Level Info */}
      {showTitle && (
        <div className="flex-1">
          {/* Title */}
          <div className="flex items-center gap-2">
            <p className={`font-bold text-gray-800 ${sizes.title}`}>{currentLevel.title}</p>
            <span className={`text-gray-500 ${sizes.points}`}>سطح {currentLevel.level}</span>
          </div>

          {/* Progress Bar */}
          {showProgress && pointsToNext > 0 && (
            <div className="mt-1">
              <div className={`w-full bg-gray-200 rounded-full ${sizes.progressBar} overflow-hidden`}>
                <div
                  className={`bg-gradient-to-r ${getLevelColor(currentLevel.level)} ${
                    sizes.progressBar
                  } rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {pointsToNext.toLocaleString("fa-IR")} امتیاز تا سطح بعد
              </p>
            </div>
          )}

          {/* Max Level */}
          {showProgress && pointsToNext === 0 && (
            <p className="text-xs text-green-600 font-bold mt-1">🏆 حداکثر سطح!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LevelBadge;
