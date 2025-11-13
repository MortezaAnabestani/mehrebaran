"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  isCurrentTop: boolean;
  isNextBottom: boolean;
}

const Line: React.FC<Props> = ({ isCurrentTop, isNextBottom }) => {
  const pathRef = useRef<SVGPathElement>(null);

  // محاسبه path بر اساس position
  const path =
    isCurrentTop && isNextBottom
      ? "M0,0 C80,0 120,80 250,80"
      : isCurrentTop
      ? "M0,0 C100,0 90,0 250,0"
      : "M0,80 C40,80 90,0 250,0";

  useEffect(() => {
    if (!pathRef.current) return;

    const pathLength = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${pathLength}`;
    pathRef.current.style.strokeDashoffset = `${pathLength}`;
  }, []);

  return (
    <div
      className={`absolute left-1/2 -z-10 top-1/5 ${
        isCurrentTop && isNextBottom ? "translate-y-6" : isCurrentTop ? "translate-y-4" : "translate-y-10"
      } w-200 h-20 overflow-visible`}
    >
      <svg width="100%" height="100%" className="overflow-visible">
        {/* گلو زیر خط */}
        <defs>
          {/* Gradient برای جریان */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff9434" stopOpacity="0.3">
              <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#ffb366" stopOpacity="1">
              <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#ff9434" stopOpacity="0.3">
              <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* فیلتر برای گلو */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* فیلتر برای shadow */}
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ff9434" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* خط پس‌زمینه (گلو) */}
        <path
          d={path}
          stroke="#ff9434"
          strokeWidth="10"
          fill="transparent"
          opacity="0.2"
          filter="url(#glow)"
        />

        {/* خط اصلی با انیمیشن */}
        <motion.path
          ref={pathRef}
          d={path}
          stroke="url(#lineGradient)"
          strokeWidth="5"
          fill="transparent"
          filter="url(#shadow)"
          strokeLinecap="round"
          initial={{ strokeDashoffset: 500 }}
          animate={{
            strokeDashoffset: 0,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />

        {/* پارتیکل‌های در حال حرکت روی خط */}
        {[0, 0.3, 0.6].map((delay, index) => (
          <motion.circle
            key={index}
            r="4"
            fill="#ffb366"
            filter="url(#glow)"
            initial={{ offsetdistance: "0%", opacity: 0 }}
            animate={{
              offsetdistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: delay,
              ease: "linear",
            }}
            style={{
              offsetPath: `path('${path}')`,
              offsetRotate: "0deg",
            }}
          />
        ))}

        {/* دایره‌های پالس در نقاط شروع و پایان */}
        <motion.circle
          cx="0"
          cy={isCurrentTop ? "0" : "80"}
          r="6"
          fill="#ff9434"
          opacity="0.6"
          animate={{
            r: [6, 12, 6],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="250"
          cy={isNextBottom ? "80" : "0"}
          r="6"
          fill="#ff9434"
          opacity="0.6"
          animate={{
            r: [6, 12, 6],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </svg>
    </div>
  );
};

export default Line;
