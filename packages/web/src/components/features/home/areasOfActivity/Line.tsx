"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Props {
  isCurrentTop: boolean;
  isNextBottom: boolean;
}

const Line: React.FC<Props> = ({ isCurrentTop, isNextBottom }) => {
  // رنگ اصلی برند
  const BRAND_COLOR = "#007acc";
  const GLOW_COLOR = "#40a9ff"; // نسخه روشن‌تر برای درخشش

  // محاسبه مسیر منحنی (Bezier Curve) برای ایجاد حس ارگانیک و نرم
  const path = useMemo(() => {
    if (isCurrentTop && isNextBottom) {
      // حالت S شکل (بالا به پایین) - نرم‌تر شده
      return "M0,0 C100,0 150,80 250,80";
    } else if (isCurrentTop) {
      // خط مستقیم (بالا به بالا) - با کمی انحنای طبیعی
      return "M0,0 C125,0 125,0 250,0";
    } else {
      // حالت S معکوس (پایین به بالا)
      return "M0,80 C100,80 150,0 250,0";
    }
  }, [isCurrentTop, isNextBottom]);

  // تولید ID یکتا برای جلوگیری از تداخل در رندرهای متعدد
  const uniqueId = `organic-line-${isCurrentTop ? "t" : "b"}-${isNextBottom ? "b" : "t"}`;
  const gradientId = `flow-gradient-${uniqueId}`;
  const filterId = `glow-filter-${uniqueId}`;

  // تنظیم موقعیت عمودی کانتینر
  const containerClass =
    isCurrentTop && isNextBottom ? "translate-y-10" : isCurrentTop ? "translate-y-4" : "translate-y-20";

  return (
    <div
      className={`absolute left-1/2 -z-10 top-1/5 ${containerClass} w-[250px] h-[100px] pointer-events-none overflow-visible`}
    >
      <svg width="100%" height="100%" className="overflow-visible">
        <defs>
          {/* گرادینت متحرک برای شبیه‌سازی جریان مایع/انرژی */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={BRAND_COLOR} stopOpacity="0">
              <animate
                attributeName="offset"
                values="-1; 1"
                dur="3s"
                repeatCount="indefinite"
                keyTimes="0; 1"
              />
            </stop>
            <stop offset="50%" stopColor={GLOW_COLOR} stopOpacity="1">
              <animate
                attributeName="offset"
                values="-0.5; 1.5"
                dur="3s"
                repeatCount="indefinite"
                keyTimes="0; 1"
              />
            </stop>
            <stop offset="100%" stopColor={BRAND_COLOR} stopOpacity="0">
              <animate
                attributeName="offset"
                values="0; 2"
                dur="3s"
                repeatCount="indefinite"
                keyTimes="0; 1"
              />
            </stop>
          </linearGradient>

          {/* فیلتر پیشرفته برای ایجاد درخشش نرم و ارگانیک */}
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={BRAND_COLOR} floodOpacity="0.6" />
          </filter>
        </defs>

        {/* مسیر پس‌زمینه (کم‌رنگ و ثابت) - ساختار لوله */}
        <path
          d={path}
          stroke={BRAND_COLOR}
          strokeWidth="2"
          fill="transparent"
          strokeLinecap="round"
          opacity="0.15"
        />

        {/* مسیر جریان انرژی (متحرک و درخشان) */}
        <path
          d={path}
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
          fill="transparent"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
          style={{ mixBlendMode: "screen" }}
        />

        {/* نقطه شروع (تپنده) */}
        <motion.circle
          cx="0"
          cy={isCurrentTop ? "0" : "80"}
          r="5"
          fill={BRAND_COLOR}
          filter={`url(#${filterId})`}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.6, 1, 0.6],
            boxShadow: `0px 0px 10px ${BRAND_COLOR}`,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* نقطه پایان (تپنده با تاخیر) */}
        <motion.circle
          cx="250"
          cy={isNextBottom ? "80" : "0"}
          r="5"
          fill={BRAND_COLOR}
          filter={`url(#${filterId})`}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1, // تاخیر برای هماهنگی با جریان خط
          }}
        />
      </svg>
    </div>
  );
};

export default Line;
