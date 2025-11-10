"use client";

import React from "react";
import { ILeaderboardEntry } from "@/services/gamification.service";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface LeaderboardTableProps {
  entries: ILeaderboardEntry[];
  currentUserId?: string;
  variant?: "default" | "compact";
  showLevel?: boolean;
  showBadge?: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  currentUserId,
  variant = "default",
  showLevel = true,
  showBadge = false,
}) => {
  // رنگ رتبه
  const getRankColor = (rank: number): string => {
    if (rank === 1) return "text-yellow-500"; // طلا
    if (rank === 2) return "text-gray-400"; // نقره
    if (rank === 3) return "text-orange-500"; // برنز
    return "text-gray-600";
  };

  // آیکون رتبه
  const getRankIcon = (rank: number): string => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}`;
  };

  // فرمت score
  const formatScore = (score: number): string => {
    if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
    return score.toLocaleString("fa-IR");
  };

  // Compact variant
  if (variant === "compact") {
    return (
      <div className="space-y-2">
        {entries.map((entry) => {
          const isCurrentUser = currentUserId && entry.user._id === currentUserId;

          return (
            <div
              key={entry.user._id}
              className={`flex items-center gap-3 p-3 rounded-md ${
                isCurrentUser ? "bg-morange/10 border-2 border-morange" : "bg-white border border-gray-200"
              }`}
            >
              {/* Rank */}
              <div className={`text-xl font-bold ${getRankColor(entry.rank)} min-w-[40px] text-center`}>
                {getRankIcon(entry.rank)}
              </div>

              {/* User */}
              <div className="flex items-center gap-2 flex-1">
                <div className="w-10 h-10 rounded-full bg-mblue text-white flex items-center justify-center font-bold">
                  {entry.user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{entry.user.name}</p>
                  {showLevel && <p className="text-xs text-gray-500">سطح {entry.level}</p>}
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="font-bold text-morange">{formatScore(entry.score)}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default variant (table)
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">رتبه</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">کاربر</th>
            {showLevel && (
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">سطح</th>
            )}
            {showBadge && (
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">نشان</th>
            )}
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">امتیاز</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entries.map((entry, index) => {
            const isCurrentUser = currentUserId && entry.user._id === currentUserId;

            return (
              <tr
                key={index}
                className={`transition-colors ${
                  isCurrentUser ? "bg-morange/10 font-bold" : "hover:bg-gray-50"
                }`}
              >
                {/* Rank */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-xl font-bold ${getRankColor(entry.rank)}`}>
                    {getRankIcon(entry.rank)}
                  </div>
                </td>

                {/* User */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-mblue text-white flex items-center justify-center font-bold">
                      {entry?.user.name}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{entry.user.name}</p>
                      {isCurrentUser && <span className="text-xs text-morange">شما</span>}
                    </div>
                  </div>
                </td>

                {/* Level */}
                {showLevel && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">سطح {entry.level}</span>
                  </td>
                )}

                {/* Badge */}
                {showBadge && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.badge ? (
                      <span className="text-lg">{entry.badge.icon || "🏅"}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                )}

                {/* Score */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className="text-morange">⭐</span>
                    <span className="font-bold text-morange text-lg">{formatScore(entry.score)}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
