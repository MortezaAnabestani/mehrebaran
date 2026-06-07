"use client";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { FAQsType } from "@/types/types";
import { useState, FC, useId } from "react";

const FaqSection: FC<FAQsType> = ({ question, answer }) => {
  const [faqOpen, setFaqOpen] = useState<boolean>(false);
  const contentId = useId();

  return (
    <div
      className={`
        group mb-4 overflow-hidden rounded-3xl border border-gray-100 
        bg-[#fefefe] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${faqOpen ? "shadow-md ring-1 ring-[#007acc]/20" : "shadow-sm hover:shadow-md"}
      `}
    >
      {/* Header / Trigger Area */}
      <button
        onClick={() => setFaqOpen((prev) => !prev)}
        className={`
          flex w-full items-center justify-between p-5 text-right transition-colors duration-300
          ${faqOpen ? "bg-[#007acc]/5" : "bg-white hover:bg-gray-50"}
        `}
        aria-expanded={faqOpen}
        aria-controls={contentId}
      >
        <span
          className={`text-lg font-medium tracking-tight ${faqOpen ? "text-[#007acc]" : "text-gray-800"}`}
        >
          {question}
        </span>

        {/* Icon Container - M3 Standard Icon Button */}
        <div
          className={`
            flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300
            ${faqOpen ? "bg-[#007acc] rotate-180" : "bg-gray-100 group-hover:bg-[#007acc]/10"}
          `}
        >
          <OptimizedImage
            width={20}
            height={20}
            // تغییر رنگ آیکون بر اساس وضعیت (سفید در حالت فعال، رنگ اصلی یا خاکستری در حالت غیرفعال)
            // فرض بر این است که آیکون SVG قابلیت رنگ‌پذیری دارد یا خود آیکون رنگ مناسب دارد.
            // در اینجا از کلاس‌های فیلتر برای مدیریت رنگ استفاده می‌کنیم اگر آیکون سیاه باشد.
            className={`transition-all duration-300 ${faqOpen ? "brightness-0 invert" : ""}`}
            src="/icons/chevron_down.svg"
            alt="toggle accordion"
          />
        </div>
      </button>

      {/* Content Area */}
      <div
        id={contentId}
        className={`
          grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${faqOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
        `}
      >
        <div className="overflow-hidden">
          <div className="p-5 pt-0 text-base leading-8 text-gray-600 bg-[#007acc]/5">
            <div className="h-px w-full bg-[#007acc]/10 mb-4" /> {/* Divider */}
            <p className="text-justify">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
