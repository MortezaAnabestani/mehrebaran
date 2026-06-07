import React from "react";
import Link from "next/link";
import { ITeam } from "common-types";
import SmartButton from "@/components/ui/SmartButton";
import { Users, CheckCircle2, TrendingUp, Lock, Globe, ArrowRight } from "lucide-react";

interface TeamCardProps {
  team: ITeam;
  variant?: "card" | "compact";
  onUpdate?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, variant = "card" }) => {
  // --- محاسبات و منطق ---
  const activeMembers = team.members?.filter((m) => m.isActive).length || 0;
  const totalMembers = team.members?.length || 0;
  const tasksCompleted = team.members?.reduce((sum, m) => sum + (m.tasksCompleted || 0), 0) || 0;
  const contributionScore = team.members?.reduce((sum, m) => sum + (m.contributionScore || 0), 0) || 0;

  // نگاشت لیبل‌ها
  const getFocusAreaLabel = (focusArea: string): string => {
    const labels: Record<string, string> = {
      fundraising: "جمع‌آوری کمک",
      logistics: "لجستیک و پشتیبانی",
      communication: "ارتباطات و رسانه",
      technical: "فنی و مهندسی",
      volunteer: "نیروی داوطلب",
      coordination: "هماهنگی اجرایی",
      documentation: "مستندسازی",
      general: "عمومی",
    };
    return labels[focusArea] || focusArea;
  };

  // نگاشت وضعیت و استایل آن (Skeuomorphic Style)
  const getStatusStyle = (status: string) => {
    const styles: Record<string, { label: string; className: string; dotColor: string }> = {
      active: {
        label: "فعال",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm",
        dotColor: "bg-emerald-500",
      },
      paused: {
        label: "متوقف",
        className: "bg-amber-50 text-amber-700 border-amber-200 shadow-sm",
        dotColor: "bg-amber-500",
      },
      completed: {
        label: "تکمیل شده",
        className: "bg-blue-50 text-blue-700 border-blue-200 shadow-sm",
        dotColor: "bg-blue-500",
      },
      disbanded: {
        label: "منحل شده",
        className: "bg-gray-50 text-gray-600 border-gray-200 shadow-sm",
        dotColor: "bg-gray-400",
      },
    };
    return styles[status] || styles.disbanded;
  };

  const statusInfo = getStatusStyle(team.status);

  // کوتاه کردن متن
  const truncateDescription = (text?: string, maxLength: number = 120): string => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // --- رندر کامپوننت Compact ---
  if (variant === "compact") {
    return (
      <Link href={`/network/teams/${team._id}`} className="block group">
        <div className="relative bg-white rounded-xl p-4 border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
          {/* Status Dot */}
          <div
            className={`absolute top-4 left-4 w-2.5 h-2.5 rounded-full ${statusInfo.dotColor} shadow-[0_0_8px_rgba(0,0,0,0.2)]`}
          />

          <div className="mb-3 pr-2">
            <h4 className="font-bold text-gray-800 text-sm group-hover:text-[#007acc] transition-colors truncate">
              {team.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1">{getFocusAreaLabel(team.focusArea)}</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
              <Users size={12} className="text-[#007acc]" />
              <span>{activeMembers}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
              <CheckCircle2 size={12} className="text-emerald-600" />
              <span>{tasksCompleted}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // --- رندر کامپوننت Card (Full) ---
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* نوار رنگی بالای کارت برای هویت بصری */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#007acc] to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6 flex flex-col flex-grow">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pl-2">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/network/teams/${team._id}`}>
                <h3 className="font-bold text-xl text-gray-800 hover:text-[#007acc] transition-colors cursor-pointer line-clamp-1">
                  {team.name}
                </h3>
              </Link>
              {team.isPrivate ? (
                <Lock size={14} className="text-gray-400">
                  <title>تیم خصوصی</title>
                </Lock>
              ) : (
                <Globe size={14} className="text-gray-400">
                  <title>تیم عمومی</title>
                </Globe>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium">{getFocusAreaLabel(team.focusArea)}</p>
          </div>

          {/* Skeuomorphic Badge */}
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${statusInfo.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
            {statusInfo.label}
          </span>
        </div>

        {/* Description */}
        <div className="mb-5 min-h-[48px]">
          {team.description ? (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {truncateDescription(team.description)}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">توضیحاتی ثبت نشده است.</p>
          )}
        </div>

        {/* Tags */}
        {team.tags && team.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {team.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100/50"
              >
                #{tag}
              </span>
            ))}
            {team.tags.length > 3 && (
              <span className="text-[11px] text-gray-400 px-1 py-1">+{team.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Stats Grid - Recessed Look */}
        <div className="grid grid-cols-3 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200 mb-6 shadow-inner">
          <div className="bg-gray-50 p-3 text-center hover:bg-white transition-colors">
            <div className="flex justify-center text-gray-400 mb-1">
              <Users size={16} />
            </div>
            <p className="font-bold text-gray-800 text-lg">{activeMembers}</p>
            <p className="text-[10px] text-gray-500">عضو فعال</p>
          </div>
          <div className="bg-gray-50 p-3 text-center hover:bg-white transition-colors">
            <div className="flex justify-center text-emerald-500 mb-1">
              <CheckCircle2 size={16} />
            </div>
            <p className="font-bold text-gray-800 text-lg">{tasksCompleted}</p>
            <p className="text-[10px] text-gray-500">تسک انجام شده</p>
          </div>
          <div className="bg-gray-50 p-3 text-center hover:bg-white transition-colors">
            <div className="flex justify-center text-amber-500 mb-1">
              <TrendingUp size={16} />
            </div>
            <p className="font-bold text-gray-800 text-lg">{contributionScore}</p>
            <p className="text-[10px] text-gray-500">امتیاز مشارکت</p>
          </div>
        </div>

        {/* Footer: Members & Actions */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          {/* Avatars Stack */}
          <div className="flex items-center">
            <div className="flex -space-x-3 rtl:space-x-reverse">
              {team.members?.slice(0, 4).map((member, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007acc] to-blue-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm ring-1 ring-gray-100 relative z-10 hover:z-20 hover:scale-110 transition-transform cursor-help"
                  // title={typeof member.user === "object" && "name" in member.user ? member.user.name : "عضو"}
                >
                  {typeof member.user === "object" && member.user && "name" in member.user
                    ? member.user.name.charAt(0)
                    : "U"}
                </div>
              ))}
              {totalMembers > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm z-0">
                  +{totalMembers - 4}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Link href={`/network/teams/${team._id}`}>
            <SmartButton
              variant="mgray"
              size="sm"
              className="rounded-full !px-4 hover:!bg-[#007acc] hover:!text-white hover:!border-[#007acc] group/btn"
            >
              <span className="ml-1">مشاهده</span>
              <ArrowRight size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
            </SmartButton>
          </Link>
        </div>
      </div>

      {/* Join Overlay (Optional - only if active & public) */}
      {team.status === "active" && !team.isPrivate && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {/* دکمه اینجا غیرفعال است تا کلیک روی لینک اصلی کار کند، یا می‌توان آن را pointer-events-auto کرد */}
          <span className="bg-white text-[#007acc] px-4 py-2 rounded-full shadow-lg font-bold text-sm border border-blue-100 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            مشاهده و پیوستن
          </span>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
