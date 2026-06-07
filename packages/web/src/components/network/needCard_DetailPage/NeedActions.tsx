import React from "react";
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
  return (
    <section
      className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5 md:gap-6 lg:gap-8 transition-all duration-300"
      aria-label="Need Actions Bar"
    >
      {/* Left Side: Interaction Buttons */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-5 w-full sm:w-auto justify-between sm:justify-start">
        {/* Like Button - Neumorphic Toggle */}
        <button
          type="button"
          onClick={onLike}
          aria-label={isLiked ? "Unlike" : "Like"}
          className={`
            group flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 ease-out flex-1 sm:flex-none
            ${
              isLiked
                ? "bg-[#f0f2f5] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] sm:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] text-[#007acc]"
                : "bg-[#f0f2f5] shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] hover:shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] sm:hover:shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] active:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] sm:active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] text-slate-500"
            }
          `}
        >
          <Heart
            className={`w-4 h-4 sm:w-6 sm:h-6 transition-colors ${
              isLiked ? "fill-current" : "group-hover:text-[#007acc]"
            }`}
            strokeWidth={2.5}
          />
          <span className="font-bold text-xs sm:text-base font-sans">
            {formatNumber(likesCount)}
          </span>
        </button>

        {/* Comments Indicator - Neumorphic */}
        <div
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#f0f2f5] shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] text-slate-500 cursor-default flex-1 sm:flex-none"
          title="Comments"
        >
          <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={2.5} />
          <span className="font-bold text-xs sm:text-base font-sans">
            {formatNumber(commentsCount)}
          </span>
        </div>

        {/* Share Indicator - Neumorphic */}
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#f0f2f5] shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] text-slate-500 cursor-pointer hover:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] sm:hover:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] hover:text-[#007acc] transition-all duration-300 flex-1 sm:flex-none"
          title="Share"
        >
          <Share2 className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={2.5} />
          <span className="font-bold text-xs sm:text-base font-sans">
            {formatNumber(sharesCount)}
          </span>
        </button>
      </div>

      {/* Right Side: Primary Action (Support) */}
      <div className="w-full sm:w-auto mt-2 sm:mt-0">
        <button
          type="button"
          onClick={onSupport}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl text-white font-bold text-sm sm:text-lg bg-gradient-to-r from-[#007acc] to-[#005bb5] shadow-[0_6px_15px_rgba(0,122,204,0.3)] hover:shadow-[0_10px_25px_rgba(0,122,204,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.2)] transition-all duration-300 group"
        >
          <HandHeart className="w-4 h-4 sm:w-6 sm:h-6 group-hover:animate-pulse transition-transform" />
          <span>حمایت کنید</span>
        </button>
      </div>
    </section>
  );
};

export default NeedActions;
