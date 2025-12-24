import React from "react";
import SmartButton from "@/components/ui/SmartButton";
import { INeed } from "common-types";
import { formatNumber } from "@/utils/needUtils";

interface NeedSidebarProps {
  need: INeed;
  likesCount: number;
  commentsCount: number;
  onFinancialSupport: () => void;
}

const NeedSidebar: React.FC<NeedSidebarProps> = ({ need, likesCount, commentsCount, onFinancialSupport }) => {
  // استایل پایه برای کارت‌های اسکئومورفیک
  const cardBaseClass =
    "relative overflow-hidden bg-gradient-to-br from-[#f0f4f8] to-[#e6ebf2] rounded-2xl p-6 " +
    "shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.8)] " +
    "border border-white/40 transition-transform duration-300 hover:scale-[1.01]";

  return (
    <aside className="flex flex-col gap-8 w-full max-w-md mx-auto lg:mx-0">
      {/* --- بخش حمایت مالی (Support Section) --- */}
      <section className={cardBaseClass} aria-labelledby="support-heading">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#007acc] to-transparent opacity-50" />

        <h2 id="support-heading" className="text-xl font-extrabold text-gray-800 mb-3 tracking-tight">
          حمایت از این نیاز
        </h2>

        <p className="text-sm text-gray-600 mb-6 leading-7 font-medium">
          با حمایت مالی خود، به تحقق این نیاز کمک کنید و در ساخت آینده‌ای روشن‌تر سهیم شوید. هر کمک کوچک،
          تأثیری بزرگ دارد.
        </p>

        <div className="relative group">
          {/* افکت درخشش پشت دکمه */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#007acc] to-blue-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

          <SmartButton
            variant="custom" // فرض بر این است که می‌توان کلاس‌های کاستوم داد یا از variant مناسب استفاده کرد
            size="lg"
            onClick={onFinancialSupport}
            className="relative w-full bg-[#007acc] text-white font-bold py-3 rounded-xl 
                       shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_6px_rgba(0,122,204,0.3)]
                       hover:bg-[#006bb3] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_12px_rgba(0,122,204,0.4)]
                       active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-[1px]
                       transition-all duration-200 border-none flex justify-center items-center gap-2"
          >
            <span>حمایت مالی</span>
            <span className="text-lg">💎</span>
          </SmartButton>
        </div>
      </section>

      {/* --- بخش دسته‌بندی (Category Section) --- */}
      <section className={cardBaseClass} aria-labelledby="category-heading">
        <h2 id="category-heading" className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#007acc] shadow-[0_0_8px_#007acc]"></span>
          دسته‌بندی
        </h2>

        <div className="flex justify-start">
          {/* استایل دکمه فشرده (Inset) برای تگ */}
          <span
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-[#007acc] 
                         bg-[#e6ebf2] 
                         shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]
                         border border-white/20"
          >
            {typeof need.category === "string" ? need.category : need.category?.name || "عمومی"}
          </span>
        </div>
      </section>

      {/* --- بخش آمار (Stats Section) --- */}
      <section className={cardBaseClass} aria-labelledby="stats-heading">
        <h2
          id="stats-heading"
          className="text-lg font-bold text-gray-700 mb-5 border-b border-gray-200/50 pb-2"
        >
          آمار فعالیت
        </h2>

        <dl className="space-y-3">
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
  <div className="flex justify-between items-center p-3 rounded-xl transition-colors hover:bg-white/40 group">
    <dt className="flex items-center gap-3 text-sm font-medium text-gray-500 group-hover:text-[#007acc] transition-colors">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e0e5ec] text-[#007acc] shadow-[2px_2px_5px_rgba(163,177,198,0.4),-2px_-2px_5px_rgba(255,255,255,0.8)]">
        {icon}
      </span>
      {label}
    </dt>
    <dd className="font-bold text-gray-800 text-base drop-shadow-sm">{value}</dd>
  </div>
);

// SVG Icons for better scalability and styling control
const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
    />
  </svg>
);
const ChatIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);
const ShareIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

export default NeedSidebar;
