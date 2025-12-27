import React from "react";
import SmartButton from "@/components/ui/SmartButton";
import { formatNumber } from "@/utils/needUtils";
import { Heart, MessageCircle, Share2, HandHeart } from "lucide-react"; // فرض بر نصب بودن lucide-react است

interface NeedActionsProps {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  onLike: () => void;
  onSupport: () => void;
}

const NeedActions: React.FC<NeedActionsProps> = ({
  isLiked,
  likesCount,
  commentsCount,
  sharesCount,
  onLike,
  onSupport,
}) => {
  // رنگ اصلی برند
  const PRIMARY_COLOR = "#007acc";

  return (
    <section
      className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6 p-3 sm:p-4 md:p-5 lg:p-6 rounded-b-lg sm:rounded-b-xl bg-[#e0e5ec] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] transition-all duration-300"
      aria-label="Need Actions Bar"
    >
      {/* Left Side: Interaction Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto justify-center sm:justify-start">
        {/* Like Button - Skeuomorphic Toggle */}
        <button
          onClick={onLike}
          aria-label={isLiked ? "Unlike" : "Like"}
          className={`
            group flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 rounded-lg sm:rounded-xl transition-all duration-200 ease-out
            ${
              isLiked
                ? "bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#b8b9be,inset_-6px_-6px_12px_#ffffff] text-[#007acc]"
                : "bg-[#e0e5ec] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] text-gray-600"
            }
            active:scale-95
          `}
        >
          <Heart
            className={`w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 transition-colors ${
              isLiked ? "fill-current" : "group-hover:text-[#007acc]"
            }`}
            strokeWidth={2.5}
          />
          <span className="font-bold text-xs sm:text-sm md:text-base font-sans">
            {formatNumber(likesCount)}
          </span>
        </button>

        {/* Comments Indicator - Skeuomorphic Static/Link */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 rounded-lg sm:rounded-xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] text-gray-600 cursor-default"
          title="Comments"
        >
          <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" strokeWidth={2.5} />
          <span className="font-bold text-xs sm:text-sm md:text-base font-sans">
            {formatNumber(commentsCount)}
          </span>
        </div>

        {/* Share Indicator - Skeuomorphic Static/Link */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 rounded-lg sm:rounded-xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] text-gray-600 cursor-pointer hover:text-[#007acc] transition-colors"
          title="Share"
        >
          <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" strokeWidth={2.5} />
          <span className="font-bold text-xs sm:text-sm md:text-base font-sans">
            {formatNumber(sharesCount)}
          </span>
        </div>
      </div>

      {/* Right Side: Primary Action (Support) */}
      <div className="w-full sm:w-auto">
        <SmartButton
          onClick={onSupport}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 lg:px-8 lg:py-3.5 rounded-lg sm:rounded-xl text-white font-bold text-sm sm:text-base md:text-lg shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)] active:scale-95 transition-all duration-200 border border-white/20"
          style={{
            background: `linear-gradient(145deg, ${PRIMARY_COLOR}, #005fa3)`,
          }}
        >
          <HandHeart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          <span>حمایت کنید</span>
        </SmartButton>
      </div>
    </section>
  );
};

export default NeedActions;
