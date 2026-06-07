import React from "react";
import { INeed } from "common-types";
import { formatNumber } from "@/utils/needUtils";

interface NeedSidebarProps {
  need: INeed;
  likesCount: number;
  commentsCount: number;
  onFinancialSupport?: () => void;
}

const NeedSidebar: React.FC<NeedSidebarProps> = ({ need, likesCount, commentsCount }) => {
  return (
    <aside className="w-full">
      {/* --- بخش دسته‌بندی (Category Section) --- */}
      <section className="mb-6 relative" aria-labelledby="category-heading">
        <h2
          id="category-heading"
          className="text-sm sm:text-base md:text-lg font-bold text-slate-700 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2"
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#007acc] shadow-[0_0_8px_#007acc]"></span>
          دسته‌بندی مربوطه
        </h2>

        <div className="flex justify-start">
          <span
            className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#007acc]
                         bg-[#f0f2f5]
                         shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]"
          >
            {typeof need.category === "string" ? need.category : need.category?.name || "عمومی"}
          </span>
        </div>
      </section>

      {/* --- بخش آمار (Stats Section) --- */}
      <section className="relative" aria-labelledby="stats-heading">
        <h2
          id="stats-heading"
          className="text-sm sm:text-base md:text-lg font-bold text-slate-700 mb-4 sm:mb-5 border-b border-white/50 pb-2.5"
        >
          آمار فعالیت
        </h2>

        <dl className="space-y-3 sm:space-y-4">
          <StatRow label="بازدید" value={formatNumber(need.viewsCount || 0)} icon={<EyeIcon />} />
          <StatRow label="لایک" value={formatNumber(likesCount)} icon={<ThumbUpIcon />} />
          <StatRow label="نظرات" value={formatNumber(commentsCount)} icon={<ChatIcon />} />
          <StatRow label="اشتراک" value={formatNumber(need.sharesCount || 0)} icon={<ShareIcon />} />
        </dl>
      </section>
    </aside>
  );
};

// --- Sub-components & Icons ---

const StatRow = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="flex justify-between items-center px-2 py-1.5 group">
    <dt className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-500 group-hover:text-[#007acc] transition-colors duration-300">
      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#f0f2f5] text-[#007acc] shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] group-hover:shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] transition-all duration-300">
        {icon}
      </span>
      {label}
    </dt>
    <dd className="font-extrabold text-slate-700 text-sm sm:text-base drop-shadow-sm">{value}</dd>
  </div>
);

// SVG Icons for better scalability and styling control
const EyeIcon = () => (
  <svg
    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);
const ThumbUpIcon = () => (
  <svg
    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
    />
  </svg>
);
const ChatIcon = () => (
  <svg
    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);
const ShareIcon = () => (
  <svg
    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

export default NeedSidebar;
