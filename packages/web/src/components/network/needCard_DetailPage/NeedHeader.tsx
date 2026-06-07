import React from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { INeed } from "common-types";
import { getCreatorName, getCreatorAvatar } from "@/utils/needUtils";

interface NeedHeaderProps {
  need: INeed;
  isFollowing: boolean;
  onFollow: () => void;
}

const NeedHeader: React.FC<NeedHeaderProps> = ({ need, isFollowing, onFollow }) => {
  // تاریخ فرمت شده برای نمایش و ویژگی datetime
  const formattedDate = new Date(need.createdAt).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const isoDate = new Date(need.createdAt).toISOString();

  return (
    <header className="flex items-center justify-between px-3 py-3 sm:px-6 sm:py-5 md:px-8 bg-[#f0f2f5] border-b border-white/50 rounded-none sm:rounded-t-2xl md:rounded-t-[2rem]">
      {/* بخش اطلاعات کاربر */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* آواتار با استایل Neumorphic */}
        <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full p-1 bg-[#f0f2f5] shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] md:shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]">
          <div className="relative w-full h-full rounded-full overflow-hidden border border-white/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
            <OptimizedImage
              src={getCreatorAvatar(need)}
              alt={`تصویر پروفایل ${getCreatorName(need)}`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* نام و تاریخ */}
        <div className="flex flex-col justify-center">
          <h3 className="text-sm sm:text-base font-bold text-slate-700 tracking-tight leading-tight mb-1">
            {getCreatorName(need)}
          </h3>
          <time dateTime={isoDate} className="text-[10px] sm:text-xs font-medium text-slate-500">
            {formattedDate}
          </time>
        </div>
      </div>

      {/* دکمه دنبال کردن با استایل Neumorphic */}
      <button
        type="button"
        onClick={onFollow}
        aria-pressed={isFollowing}
        aria-label={
          isFollowing ? `لغو دنبال کردن ${getCreatorName(need)}` : `دنبال کردن ${getCreatorName(need)}`
        }
        className={`
          flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300
          ${
            isFollowing
              ? "text-slate-500 bg-[#f0f2f5] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]"
              : "text-[#007acc] bg-[#f0f2f5] shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]"
          }
        `}
      >
        <span className="flex items-center gap-1.5">
          {isFollowing ? (
            <>
              <span>دنبال‌شده</span>
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </>
          ) : (
            "دنبال کردن"
          )}
        </span>
      </button>
    </header>
  );
};

export default NeedHeader;
