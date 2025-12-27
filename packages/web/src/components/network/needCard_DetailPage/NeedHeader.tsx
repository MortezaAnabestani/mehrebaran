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
    <header className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* بخش اطلاعات کاربر */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* آواتار با استایل Skeuomorphic (برجسته و قاب‌دار) */}
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full p-0.5 sm:p-1 bg-gradient-to-br from-white to-gray-200 shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.8)]">
          <div className="relative w-full h-full rounded-full overflow-hidden border border-gray-300/50 shadow-inner">
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
          <h3 className="text-sm sm:text-base font-bold text-gray-800 tracking-tight leading-tight mb-0.5 drop-shadow-sm">
            {getCreatorName(need)}
          </h3>
          <time dateTime={isoDate} className="text-[10px] sm:text-xs font-medium text-gray-500/90">
            {formattedDate}
          </time>
        </div>
      </div>

      {/* دکمه دنبال کردن با استایل دکمه‌های فیزیکی/براق */}
      <button
        onClick={onFollow}
        aria-pressed={isFollowing}
        aria-label={
          isFollowing ? `لغو دنبال کردن ${getCreatorName(need)}` : `دنبال کردن ${getCreatorName(need)}`
        }
        className={`
          relative overflow-hidden px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007acc]/50
          ${
            isFollowing
              ? "bg-gray-100 text-gray-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] border border-gray-200"
              : "text-white bg-[#007acc] bg-gradient-to-b from-[#3394d6] to-[#006bb3] border-t border-[#4dace6] border-b border-[#005c99] shadow-[0_4px_6px_rgba(0,122,204,0.3),0_1px_3px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(0,122,204,0.4)] active:translate-y-0 active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.2)]"
          }
        `}
      >
        <span className="relative z-10 flex items-center gap-1 sm:gap-2">
          {isFollowing ? (
            <>
              <span>دنبال‌شده</span>
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
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
