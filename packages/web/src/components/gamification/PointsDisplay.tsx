"use client";

import React from "react";

interface PointsDisplayProps {
  points: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showLabel?: boolean;
  variant?: "default" | "compact" | "detailed";
  changeAmount?: number; // برای نمایش تغییرات اخیر (+100, -50)
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({
  points,
  size = "md",
  showIcon = true,
  showLabel = true,
  variant = "default",
  changeAmount,
}) => {
  // فرمت اعداد بزرگ
  const formatPoints = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString("fa-IR");
  };

  // اندازه‌ها
  const sizeClasses = {
    sm: {
      container: "gap-1",
      icon: "text-base",
      points: "text-sm",
      label: "text-xs",
      change: "text-xs",
    },
    md: {
      container: "gap-2",
      icon: "text-lg",
      points: "text-xl",
      label: "text-sm",
      change: "text-sm",
    },
    lg: {
      container: "gap-3",
      icon: "text-2xl",
      points: "text-3xl",
      label: "text-base",
      change: "text-base",
    },
  };

  const sizes = sizeClasses[size];

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={`flex items-center ${sizes.container}`}>
        {showIcon && <span className={`${sizes.icon}`}>⭐</span>}
        <span className={`font-bold text-morange ${sizes.points}`}>{formatPoints(points)}</span>
        {changeAmount !== undefined && changeAmount !== 0 && (
          <span
            className={`font-bold ${
              changeAmount > 0 ? "text-green-600" : "text-red-600"
            } ${sizes.change}`}
          >
            {changeAmount > 0 ? "+" : ""}
            {formatPoints(changeAmount)}
          </span>
        )}
      </div>
    );
  }

  // Detailed variant
  if (variant === "detailed") {
    return (
      <div className="bg-gradient-to-br from-morange/10 to-morange/5 border border-morange/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {showIcon && <span className="text-2xl">⭐</span>}
            <span className="text-sm text-gray-600">مجموع امتیازات</span>
          </div>
          {changeAmount !== undefined && changeAmount !== 0 && (
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                changeAmount > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {changeAmount > 0 ? "+" : ""}
              {formatPoints(changeAmount)}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-morange">{formatPoints(points)}</span>
          <span className="text-lg text-gray-500">امتیاز</span>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center ${sizes.container}`}>
      {showIcon && <span className={`${sizes.icon}`}>⭐</span>}
      <div>
        <span className={`font-extrabold text-morange ${sizes.points}`}>{formatPoints(points)}</span>
        {showLabel && <span className={`text-gray-600 mr-1 ${sizes.label}`}>امتیاز</span>}
        {changeAmount !== undefined && changeAmount !== 0 && (
          <span
            className={`font-bold mr-2 ${
              changeAmount > 0 ? "text-green-600" : "text-red-600"
            } ${sizes.change}`}
          >
            ({changeAmount > 0 ? "+" : ""}
            {formatPoints(changeAmount)})
          </span>
        )}
      </div>
    </div>
  );
};

export default PointsDisplay;
