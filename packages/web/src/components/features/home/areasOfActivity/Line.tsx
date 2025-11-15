"use client";

import React from "react";
import { motion } from "framer-motion";

interface Props {
  isCurrentTop: boolean;
  isNextBottom: boolean;
}

const Line: React.FC<Props> = ({ isCurrentTop, isNextBottom }) => {
  // محاسبه path بر اساس position
  const path =
    isCurrentTop && isNextBottom
      ? "M0,0 C80,0 120,80 250,80"
      : isCurrentTop
      ? "M0,0 C100,0 90,0 250,0"
      : "M0,80 C40,80 90,0 250,0";

  // ID یکتا برای هر gradient
  const gradientId = `flowingLight-${isCurrentTop}-${isNextBottom}`;
  const glowId = `glow-${isCurrentTop}-${isNextBottom}`;

  return (
    <div
      className={`absolute left-1/2 -z-10 top-1/5 ${
        isCurrentTop && isNextBottom ? "translate-y-6" : isCurrentTop ? "translate-y-4" : "translate-y-10"
      } w-200 h-20 overflow-visible`}
    >
      <svg width="100%" height="100%" className="overflow-visible">
        <defs>
          {/* Gradient برای جریان نور */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0">
              <animate attributeName="offset" values="-0.5;1.5" dur="2.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="20%" stopColor="#60a5fa" stopOpacity="0.3">
              <animate attributeName="offset" values="-0.3;1.7" dur="2.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#93c5fd" stopOpacity="1">
              <animate attributeName="offset" values="0;2" dur="2.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="80%" stopColor="#60a5fa" stopOpacity="0.3">
              <animate attributeName="offset" values="0.3;2.3" dur="2.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0">
              <animate attributeName="offset" values="0.5;2.5" dur="2.5s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* فیلتر برای گلو */}
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* خط پس‌زمینه (خاکستری) */}
        <path
          d={path}
          stroke="#e5e7eb"
          strokeWidth="3"
          fill="transparent"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* خط با جریان نور */}
        <path
          d={path}
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
          fill="transparent"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
        />

        {/* دایره‌های نورانی در نقاط شروع و پایان */}
        <motion.circle
          cx="0"
          cy={isCurrentTop ? "0" : "80"}
          r="4"
          fill="#3b82f6"
          filter={`url(#${glowId})`}
          animate={{
            r: [4, 6, 4],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="250"
          cy={isNextBottom ? "80" : "0"}
          r="4"
          fill="#3b82f6"
          filter={`url(#${glowId})`}
          animate={{
            r: [4, 6, 4],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.75,
          }}
        />
      </svg>
    </div>
  );
};

export default Line;
