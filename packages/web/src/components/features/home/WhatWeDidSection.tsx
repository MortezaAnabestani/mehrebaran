"use client";

import { IWhatWeDidStatistics } from "common-types";
import React, { useRef, useEffect, useState } from "react";
import HeadTitle from "./HeadTitle";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import OptimizedImage from "@/components/ui/OptimizedImage";
import dynamic from "next/dynamic";

const Tetris = dynamic(() => import("@/components/Tetris/Tetris"), { ssr: false });

// --- Types ---
interface WhatWeDidType {
  title: string;
  href: string;
  numOfProject: number;
  variant: "primary" | "secondary";
  icon: string;
}

// --- Helper Component: Animated Counter ---
const AnimatedCounter = ({ value }: { value: number }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString("fa-IR"));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

const WhatWeDidSection: React.FC<{ statistics: IWhatWeDidStatistics | null }> = ({ statistics }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  // Easter egg state
  const [clickSequence, setClickSequence] = useState<number[]>([]);
  const [showTetris, setShowTetris] = useState(false);
  const [showSecretMessage, setShowSecretMessage] = useState(false);

  // Correct sequence: indexes 0, 1, 2 (top row) and 4 (middle of bottom row)
  const correctSequence = [0, 1, 2, 4];

  // Handle card click for Easter egg
  const handleCardClick = (index: number) => {
    const newSequence = [...clickSequence, index];

    // Keep only the last 4 clicks
    if (newSequence.length > 4) {
      newSequence.shift();
    }

    setClickSequence(newSequence);

    // Check if the sequence matches
    if (newSequence.length === 4 && newSequence.every((val, idx) => val === correctSequence[idx])) {
      setShowSecretMessage(true);
      setTimeout(() => {
        setShowSecretMessage(false);
        setShowTetris(true);
      }, 2000);
      setClickSequence([]);
    }
  };

  // مقادیر پیش‌فرض یا واقعی
  const stats = statistics || {
    totalProjects: 0,
    schoolsCovered: 0,
    budgetRaised: 0,
    partnerOrganizations: 0,
    volunteerHours: 0,
    activeVolunteers: 0,
  };

  const Items: WhatWeDidType[] = [
    {
      title: "تعداد پروژه‌ها",
      href: "/projects",
      numOfProject: stats.totalProjects,
      variant: "primary",
      icon: "/icons/chart.svg",
    },
    {
      title: "مناطق و مدارس تحت پوشش",
      href: "/projects",
      numOfProject: stats.schoolsCovered,
      variant: "primary",
      icon: "/icons/bookHome.svg",
    },
    {
      title: "میزان بودجه جذب‌شده",
      href: "/projects",
      numOfProject: stats.budgetRaised,
      variant: "primary",
      icon: "/icons/assets.svg",
    },
    {
      title: "مجموعه‌های همکار",
      href: "/projects",
      numOfProject: stats.partnerOrganizations,
      variant: "secondary",
      icon: "/icons/puzzle.svg",
    },
    {
      title: "مجموع ساعات داوطلبی",
      href: "/projects",
      numOfProject: stats.volunteerHours,
      variant: "primary",
      icon: "/icons/time.svg",
    },
    {
      title: "تعداد داوطلبان فعال",
      href: "/projects",
      numOfProject: stats.activeVolunteers,
      variant: "secondary",
      icon: "/icons/support.svg",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <>
      <section ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <HeadTitle title="در کنار هم چه کردیم؟" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
          >
            {Items.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group relative h-full"
                onClick={() => handleCardClick(index)}
              >
                <div
                  className={`relative h-full overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-300 border cursor-pointer ${
                    item.variant === "primary"
                      ? "bg-[#007acc] text-white border-[#007acc] shadow-lg shadow-blue-900/20"
                      : "bg-white text-gray-800 border-gray-100 shadow-md hover:border-[#007acc]/30 hover:shadow-xl"
                  }`}
                >
                  {/* آیکون پس‌زمینه بزرگ و محو */}
                  <div
                    className={`absolute -bottom-4 -left-4 w-32 h-32 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${
                      item.variant === "primary" ? "invert brightness-0" : ""
                    }`}
                  >
                    <OptimizedImage
                      src={item.icon}
                      alt=""
                      width={128}
                      height={128}
                      className="object-contain"
                    />
                  </div>

                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center gap-4">
                    {/* آیکون کوچک بالای کارت */}
                    <div
                      className={`p-3 rounded-2xl mb-2 ${
                        item.variant === "primary" ? "bg-white/20 backdrop-blur-sm" : "bg-[#007acc]/10"
                      }`}
                    >
                      <OptimizedImage
                        src={item.icon}
                        alt={item.title}
                        width={32}
                        height={32}
                        className={item.variant === "primary" ? "brightness-0 invert" : ""}
                      />
                    </div>

                    {/* عدد شمارنده */}
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                      {isInView ? <AnimatedCounter value={item.numOfProject} /> : "۰"}
                      <span className="text-2xl align-top opacity-60 mr-1">+</span>
                    </h2>

                    {/* عنوان */}
                    <h3
                      className={`text-base md:text-lg font-bold leading-relaxed ${
                        item.variant === "primary" ? "text-blue-50" : "text-gray-600"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* افکت درخشش روی هاور */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Secret Message Overlay */}
      {showSecretMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-12 py-8 rounded-2xl shadow-2xl text-center"
          >
            <h2 className="text-3xl font-bold mb-2"> رمز گشوده شد! </h2>
            <p className="text-lg opacity-90">در حال بارگذاری...</p>
          </motion.div>
        </motion.div>
      )}

      {/* Tetris Game Modal */}
      {showTetris && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          onClick={() => setShowTetris(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowTetris(false)}
              className="absolute top-7 left-7 z-10 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all"
            >
              ✕
            </button>

            {/* Tetris Game */}
            <Tetris
              topText="هر کجا هستی عزیزم خانه‌ات آباد باد"
              bottomText="سازمان دانشجویان جهاد دانشگاهی خراسان رضوی"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default WhatWeDidSection;
