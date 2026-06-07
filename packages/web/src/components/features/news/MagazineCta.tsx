import Link from "next/link";
import React from "react";

const MagazineCta: React.FC = () => {
  return (
    <div className="mt-24 relative flex justify-center items-center px-4">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[40px] bg-[#e0e5ec] p-10 lg:p-16 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#e0e5ec] shadow-[inset_10px_10px_20px_#bebebe,inset_-10px_-10px_20px_#ffffff] opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-right max-w-2xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] text-sm font-bold text-[#007acc] mb-6">
              <span className="w-2 h-2 rounded-full bg-yellow-400 ml-2 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.6)]" />
              پیشنهاد ویژه
            </div>

            <h2 className="text-3xl lg:text-4xl font-black mb-4 leading-tight text-gray-700">
              مجله تخصصی <span className="text-[#007acc]">مهرباران</span>
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed font-medium">
              دسترسی به آرشیو کامل مقالات تحلیلی، گزارش‌های تصویری اختصاصی و ویدیوهای الهام‌بخش از فعالیت‌های
              خیریه با رویکردی نوین.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/blog"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#007acc] transition-all duration-300 bg-[#e0e5ec] rounded-2xl shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] hover:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] hover:scale-[0.98]"
            >
              <span>مشاهده مجله</span>
              <svg
                className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineCta;
