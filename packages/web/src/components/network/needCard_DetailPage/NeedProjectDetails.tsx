import React, { useMemo } from "react";
import { INeed } from "common-types";
import { formatNumber } from "@/utils/needUtils";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface NeedProjectDetailsProps {
  need: INeed;
}

const NeedProjectDetails: React.FC<NeedProjectDetailsProps> = ({ need }) => {
  // استفاده از useMemo برای بهینه‌سازی محاسبات و جلوگیری از رندرهای غیرضروری
  const { totalBudget, totalRaised, progress } = useMemo(() => {
    const budget =
      need.budgetItems?.reduce((sum: number, item: any) => sum + (item.estimatedCost || 0), 0) || 0;
    const raised =
      need.budgetItems?.reduce((sum: number, item: any) => sum + (item.amountRaised || 0), 0) || 0;
    const prog = budget === 0 ? 0 : Math.min((raised / budget) * 100, 100);

    return { totalBudget: budget, totalRaised: raised, progress: prog };
  }, [need.budgetItems]);

  // استایل‌های پایه برای افکت اسکئومورفیسم (Neumorphism)
  const neumorphicCard =
    " rounded-2xl shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]";
  const neumorphicInset =
    " rounded-full shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.8)]";
  const primaryGradient = "bg-gradient-to-b from-[#33aaff] to-[#007acc]"; // رنگ برند #007acc

  return (
    <section
      className="px-3 sm:px-4 md:px-6 my-4 sm:my-5 md:my-6 lg:my-8 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 text-gray-700 font-sans"
      dir="rtl"
    >
      {/* Budget Section */}
      {need.budgetItems && need.budgetItems.length > 0 && (
        <article
          className={`${neumorphicCard} p-3 sm:p-4 md:p-5 lg:p-6 transition-transform duration-300 hover:scale-[1.01]`}
        >
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-5 md:mb-6">
            <div className="flex items-center">
              <OptimizedImage
                src="/icons/rial.svg"
                alt="download icon"
                width={22}
                height={22}
                className="inline-block"
              />
              <h3 className="font-extrabold text-base sm:text-lg md:text-xl text-gray-800 inline-block pr-1.5">
                وضعیت بودجه
              </h3>
            </div>
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 md:px-4 rounded-full text-xs sm:text-sm font-bold text-[#007acc] bg-[#e0e5ec] shadow-[3px_3px_6px_rgb(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)]">
              {progress.toFixed(1)}% تکمیل شده
            </span>
          </header>

          {/* Main Progress Bar */}
          <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            <div
              className={`w-full h-4 sm:h-5 md:h-6 ${neumorphicInset} overflow-hidden relative`}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded-full ${primaryGradient} shadow-[2px_0_5px_rgba(0,0,0,0.2)] transition-all duration-1000 ease-out relative`}
                style={{ width: `${progress}%` }}
              >
                {/* Shine Effect on Bar */}
                <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/30 rounded-t-full"></div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <div className="p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-white/40 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.3)] bg-[#e0e5ec]/50">
              <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-0.5 sm:mb-1">جمع‌آوری شده</p>
              <p className="font-bold text-sm sm:text-base md:text-lg text-[#007acc] drop-shadow-sm">
                {formatNumber(totalRaised)} <span className="text-[10px] sm:text-xs text-gray-400">ریال</span>
              </p>
            </div>
            <div className="p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-white/40 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.3)] bg-[#e0e5ec]/50">
              <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-0.5 sm:mb-1">هدف کل</p>
              <p className="font-bold text-sm sm:text-base md:text-lg text-gray-700">
                {formatNumber(totalBudget)} <span className="text-[10px] sm:text-xs text-gray-400">ریال</span>
              </p>
            </div>
          </div>
        </article>
      )}

      {/* Milestones Section */}
      {need.milestones && need.milestones.length > 0 && (
        <article className={`${neumorphicCard} p-3 sm:p-4 md:p-5 lg:p-6`}>
          <header className="mb-4 sm:mb-5 md:mb-6">
            <h3 className="font-extrabold text-base sm:text-lg md:text-xl text-gray-800 flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl md:text-2xl">🚩</span> نقاط عطف پروژه
            </h3>
          </header>

          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {need.milestones
              .sort((a: any, b: any) => a.order - b.order)
              .map((milestone: any, idx: number) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-1.5 sm:mb-2 px-0.5 sm:px-1">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-700 group-hover:text-[#007acc] transition-colors">
                      {milestone.title}
                    </h4>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 bg-gray-200/50 px-1.5 sm:px-2 py-0.5 rounded-md">
                      {milestone.progressPercentage}%
                    </span>
                  </div>

                  {/* Milestone Progress Bar */}
                  <div
                    className={`w-full h-2 sm:h-2.5 md:h-3 ${neumorphicInset} overflow-hidden`}
                    role="progressbar"
                    aria-label={`پیشرفت ${milestone.title}`}
                  >
                    <div
                      className={`h-full rounded-full ${primaryGradient} opacity-90 group-hover:opacity-100 transition-all duration-700 ease-out`}
                      style={{ width: `${milestone.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </article>
      )}
    </section>
  );
};

export default NeedProjectDetails;
