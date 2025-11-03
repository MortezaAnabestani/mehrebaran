"use client";

import React from "react";
import Link from "next/link";
import { ITeam } from "common-types";
import SmartButton from "@/components/ui/SmartButton";

interface TeamCardProps {
  team: ITeam;
  variant?: "card" | "compact";
  onUpdate?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, variant = "card", onUpdate }) => {
  // محاسبه تعداد اعضای فعال
  const activeMembers = team.members?.filter((m) => m.isActive).length || 0;
  const totalMembers = team.members?.length || 0;

  // محاسبه progress درصد تسک‌های انجام شده
  const tasksCompleted = team.members?.reduce((sum, m) => sum + (m.tasksCompleted || 0), 0) || 0;

  // ترجمه focusArea
  const getFocusAreaLabel = (focusArea: string): string => {
    const labels: Record<string, string> = {
      fundraising: "جمع‌آوری کمک",
      logistics: "لجستیک",
      communication: "ارتباطات",
      technical: "فنی",
      volunteer: "داوطلب",
      coordination: "هماهنگی",
      documentation: "مستندسازی",
      general: "عمومی",
    };
    return labels[focusArea] || focusArea;
  };

  // ترجمه status
  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      active: "فعال",
      paused: "متوقف",
      completed: "تکمیل شده",
      disbanded: "منحل شده",
    };
    return labels[status] || status;
  };

  // رنگ status badge
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      paused: "bg-yellow-100 text-yellow-700",
      completed: "bg-blue-100 text-blue-700",
      disbanded: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  // نمایش کوتاه توضیحات
  const truncateDescription = (text?: string, maxLength: number = 100): string => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Compact variant
  if (variant === "compact") {
    return (
      <Link href={`/network/teams/${team._id}`}>
        <div className="bg-white border border-mgray/20 rounded-md p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm">{team.name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(team.status)}`}>
              {getStatusLabel(team.status)}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2">{getFocusAreaLabel(team.focusArea)}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>👥 {activeMembers} عضو</span>
            <span>✅ {tasksCompleted} تسک</span>
          </div>
        </div>
      </Link>
    );
  }

  // Card variant (default)
  return (
    <div className="bg-white border border-mgray/20 rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link href={`/network/teams/${team._id}`}>
              <h3 className="font-bold text-lg hover:text-mblue transition-colors cursor-pointer">
                {team.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 mt-1">{getFocusAreaLabel(team.focusArea)}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-bold ${getStatusColor(team.status)}`}>
            {getStatusLabel(team.status)}
          </span>
        </div>

        {/* Description */}
        {team.description && (
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">{truncateDescription(team.description, 150)}</p>
        )}

        {/* Tags */}
        {team.tags && team.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {team.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-mblue/10 text-mblue px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
            {team.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">+{team.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-mgray/10 rounded-md">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">اعضای فعال</p>
            <p className="font-bold text-lg text-mblue">
              {activeMembers}
              {team.maxMembers && <span className="text-sm text-gray-500">/{team.maxMembers}</span>}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">تسک‌های انجام شده</p>
            <p className="font-bold text-lg text-green-600">{tasksCompleted}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">امتیاز مشارکت</p>
            <p className="font-bold text-lg text-morange">
              {team.members?.reduce((sum, m) => sum + (m.contributionScore || 0), 0) || 0}
            </p>
          </div>
        </div>

        {/* Members preview */}
        {team.members && team.members.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-2">اعضای تیم:</p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {team.members.slice(0, 5).map((member, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-mblue text-white flex items-center justify-center text-xs font-bold border-2 border-white"
                    title={typeof member.user === "object" ? member.user.name : "عضو"}
                  >
                    {typeof member.user === "object" && member.user.name
                      ? member.user.name.charAt(0)
                      : "👤"}
                  </div>
                ))}
              </div>
              {totalMembers > 5 && (
                <span className="text-xs text-gray-500">+{totalMembers - 5} نفر دیگر</span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-mgray/20">
          <Link href={`/network/teams/${team._id}`} className="flex-1">
            <SmartButton variant="mblue" size="sm" className="w-full">
              مشاهده جزئیات
            </SmartButton>
          </Link>
          {team.status === "active" && !team.isPrivate && (
            <SmartButton variant="morange" size="sm" className="flex-1">
              پیوستن
            </SmartButton>
          )}
        </div>
      </div>

      {/* Private badge */}
      {team.isPrivate && (
        <div className="bg-gray-100 px-4 py-2 text-xs text-gray-600 text-center">
          🔒 تیم خصوصی
        </div>
      )}
    </div>
  );
};

export default TeamCard;
