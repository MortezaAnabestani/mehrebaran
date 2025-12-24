import React, { useMemo } from "react";
import { INeed } from "common-types";
import { formatNumber } from "@/utils/needUtils";

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
    <section className="px-6 my-8 space-y-8 text-gray-700 font-sans" dir="rtl">
      {/* Budget Section */}
      {need.budgetItems && need.budgetItems.length > 0 && (
        <article className={`${neumorphicCard} p-6 transition-transform duration-300 hover:scale-[1.01]`}>
          <header className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-xl text-gray-800 flex items-center gap-2">
              <span className="text-2xl">💰</span> وضعیت بودجه
            </h3>
            <span className="px-4 py-1 rounded-full text-sm font-bold text-[#007acc] bg-[#e0e5ec] shadow-[3px_3px_6px_rgb(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)]">
              {progress.toFixed(1)}% تکمیل شده
            </span>
          </header>

          {/* Main Progress Bar */}
          <div className="mb-8">
            <div
              className={`w-full h-6 ${neumorphicInset} overflow-hidden relative`}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/40 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.3)] bg-[#e0e5ec]/50">
              <p className="text-xs font-medium text-gray-500 mb-1">جمع‌آوری شده</p>
              <p className="font-bold text-lg text-[#007acc] drop-shadow-sm">
                {formatNumber(totalRaised)} <span className="text-xs text-gray-400">ریال</span>
              </p>
            </div>
            <div className="p-4 rounded-xl border border-white/40 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.3)] bg-[#e0e5ec]/50">
              <p className="text-xs font-medium text-gray-500 mb-1">هدف کل</p>
              <p className="font-bold text-lg text-gray-700">
                {formatNumber(totalBudget)} <span className="text-xs text-gray-400">ریال</span>
              </p>
            </div>
          </div>
        </article>
      )}

      {/* Milestones Section */}
      {need.milestones && need.milestones.length > 0 && (
        <article className={`${neumorphicCard} p-6`}>
          <header className="mb-6">
            <h3 className="font-extrabold text-xl text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🚩</span> نقاط عطف پروژه
            </h3>
          </header>

          <div className="space-y-5">
            {need.milestones
              .sort((a: any, b: any) => a.order - b.order)
              .map((milestone: any, idx: number) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-2 px-1">
                    <h4 className="font-bold text-sm text-gray-700 group-hover:text-[#007acc] transition-colors">
                      {milestone.title}
                    </h4>
                    <span className="text-xs font-bold text-gray-500 bg-gray-200/50 px-2 py-0.5 rounded-md">
                      {milestone.progressPercentage}%
                    </span>
                  </div>

                  {/* Milestone Progress Bar */}
                  <div
                    className={`w-full h-3 ${neumorphicInset} overflow-hidden`}
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
