"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import OptimizedImage from "@/components/ui/OptimizedImage";

export const ParallaxHero = ({ backgroundImage }: { backgroundImage: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0.5, 1], [1, 0]);

  return (
    <section 
      ref={ref} 
      className="relative w-full h-[80vh] min-h-[500px] mb-20 overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div 
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <OptimizedImage 
          src={backgroundImage} 
          alt="مجله مهر باران" 
          fill 
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradients to blend into page */}
        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-slate-900/40 to-slate-900/20" />
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 w-11/12 md:w-10/12 xl:w-9/12 mx-auto h-full flex flex-col justify-center items-center text-center space-y-6 lg:space-y-8"
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs lg:text-sm font-bold tracking-wide shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#00aaff] animate-pulse" />
          پایگاه اطلاع‌رسانی و مستندسازی
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-8xl font-black text-white tracking-tight leading-[1.1] drop-shadow-lg"
        >
          مجلۀ خبری <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#73c2ff] to-[#e0f1ff]">
            مهر باران
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-base md:text-lg lg:text-2xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md"
        >
          انعکاس فعالیت‌های داوطلبانه، پروژه‌های نیکوکاری، رویدادهای فرهنگی و مقالات تخصصی کانون
          مهر باران در سراسر کشور.
        </motion.p>
      </motion.div>
    </section>
  );
};

export const FadeInUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
