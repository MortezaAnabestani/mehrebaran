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
      need.budgetItems?.reduce((sum: number, item: { estimatedCost?: number }) => sum + (item.estimatedCost || 0), 0) || 0;
    const raised =
      need.budgetItems?.reduce((sum: number, item: { amountRaised?: number }) => sum + (item.amountRaised || 0), 0) || 0;
    const prog = budget === 0 ? 0 : Math.min((raised / budget) * 100, 100);

    return { totalBudget: budget, totalRaised: raised, progress: prog };
  }, [need.budgetItems]);

  return (
    <section
      className="px-0 sm:px-2 md:px-4 my-6 sm:my-8 lg:my-10 space-y-6 sm:space-y-8 lg:space-y-10 text-slate-700 font-sans"
      dir="rtl"
    >
      {/* Budget Section */}
      {need.budgetItems && need.budgetItems.length > 0 && (
        <article
          className={`bg-[#f0f2f5] rounded-2xl md:rounded-3xl shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] md:shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] border border-white/40 p-3 sm:p-5 md:p-6 lg:p-8 transition-transform duration-300 hover:scale-[1.01]`}
        >
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center">
              <OptimizedImage
                src="/icons/rial.svg"
                alt="budget icon"
                width={24}
                height={24}
                className="inline-block"
              />
              <h3 className="font-extrabold text-base sm:text-lg md:text-xl text-slate-700 inline-block pr-2">
                وضعیت بودجه
              </h3>
            </div>
            <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-[#007acc] bg-[#f0f2f5] shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] sm:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]">
              {progress.toFixed(1)}% تکمیل شده
            </span>
          </header>

          {/* Main Progress Bar */}
          <div className="mb-5 sm:mb-8 text-center flex flex-col justify-center overflow-hidden">
            <div
              className={`w-full h-4 sm:h-5 md:h-6 rounded-full bg-[#f0f2f5] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] sm:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] overflow-hidden relative`}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded-full bg-gradient-to-r from-[#007acc]/80 to-[#007acc] shadow-[2px_0_5px_rgba(0,0,0,0.2)] transition-all duration-1000 ease-out relative`}
                style={{ width: `${progress}%` }}
              >
                {/* Shine Effect on Bar */}
                <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/30 rounded-t-full"></div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            <div className="p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border border-white/60 bg-[#f0f2f5] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] sm:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]">
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">جمع‌آوری شده</p>
              <p className="font-bold text-sm sm:text-base md:text-lg text-[#007acc] drop-shadow-sm truncate">
                {formatNumber(totalRaised)} <span className="text-[10px] sm:text-xs text-slate-400">ریال</span>
              </p>
            </div>
            <div className="p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border border-white/60 bg-[#f0f2f5] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] sm:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]">
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">هدف کل</p>
              <p className="font-bold text-sm sm:text-base md:text-lg text-slate-700 truncate">
                {formatNumber(totalBudget)} <span className="text-[10px] sm:text-xs text-slate-400">ریال</span>
              </p>
            </div>
          </div>
        </article>
      )}

      {/* Milestones Section */}
      {need.milestones && need.milestones.length > 0 && (
        <article className={`bg-[#f0f2f5] rounded-2xl md:rounded-3xl shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] md:shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] border border-white/40 p-3 sm:p-5 md:p-6 lg:p-8`}>
          <header className="mb-5 sm:mb-6 md:mb-8">
            <h3 className="font-extrabold text-base sm:text-lg md:text-xl text-slate-700 flex items-center gap-2">
              <span className="text-lg sm:text-xl md:text-2xl drop-shadow-sm">🚩</span> نقاط عطف پروژه
            </h3>
          </header>

          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {[...(need.milestones || [])]
              .sort((a: { order?: number }, b: { order?: number }) => (a.order || 0) - (b.order || 0))
              .map((milestone: { title?: string; progressPercentage?: number }, idx: number) => (
                <div key={milestone.title || idx} className="group">
                  <div className="flex justify-between items-end mb-2 px-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-700 group-hover:text-[#007acc] transition-colors truncate pl-2">
                      {milestone.title}
                    </h4>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-[#f0f2f5] shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] px-2 py-1 rounded-lg">
                      {milestone.progressPercentage}%
                    </span>
                  </div>

                  {/* Milestone Progress Bar */}
                  <div
                    className={`w-full h-2 sm:h-2.5 rounded-full bg-[#f0f2f5] shadow-[inset_3px_3px_5px_#c5c5c5,inset_-3px_-3px_5px_#ffffff] overflow-hidden`}
                    role="progressbar"
                    aria-label={`پیشرفت ${milestone.title}`}
                  >
                    <div
                      className={`h-full rounded-full bg-gradient-to-r from-[#007acc]/70 to-[#007acc] opacity-90 group-hover:opacity-100 transition-all duration-700 ease-out`}
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
