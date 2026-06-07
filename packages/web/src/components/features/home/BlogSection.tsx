"use client";
import React from "react";
import Link from "next/link";
import SmartButton from "@/components/ui/SmartButton";
import { IBlogBackgroundSetting } from "common-types";
import { ArrowLeft, Sparkles, ArrowUpRight } from "lucide-react";
import { motion, easeInOut, Variants } from "framer-motion";

const BlogSection: React.FC<{ settings: IBlogBackgroundSetting | null }> = ({ settings }) => {
  const backgroundImage = settings?.image || "/images/blog_img.jpg";

  // --- Material Dynamic Animation Settings ---
  const m3Ease = [0.2, 0.0, 0, 1.0] as const; // Emphasized Decelerate

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.8,
        ease: m3Ease,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: m3Ease },
    },
  };

  // Mesh Gradient Animation
  const meshVariants: Variants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      rotate: [0, 45, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative w-full max-w-[1400px] mx-auto my-8 md:my-12 px-4 sm:px-6 md:px-8"
    >
      {/* --- Main Container: Material Large Surface --- */}
      <div className="relative w-full min-h-[480px] md:h-[600px] rounded-3xl md:rounded-[32px] overflow-hidden shadow-2xl bg-[#0b1d29] group isolate flex flex-col">
        {/* --- Layer 1: Background Image with Parallax Feel --- */}
        <motion.div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-70 md:opacity-60 mix-blend-overlay grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.5, ease: m3Ease }}
        />

        {/* --- Layer 3: Scrim (Gradient for Readability) --- */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050f16]/90 via-[#050f16]/60 to-transparent md:bg-gradient-to-t md:from-[#050f16] md:via-[#050f16]/60 md:to-transparent" />

        {/* --- Layer 4: Content Surface --- */}
        <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6 md:p-12 flex-1">
          <motion.div variants={containerVariants} className="w-full md:max-w-2xl mt-auto">
            {/* Glassmorphic Card: Surface Variant */}
            <div className="relative p-6 sm:p-7 md:p-9 rounded-[1.2rem] sm:rounded-3xl bg-[#1a2c38]/75 md:bg-[#1a2c38]/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Interactive Highlight Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Badge: Primary Container */}
              <motion.div variants={itemVariants} className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-[#007acc]/20 text-[#a0cfff] text-xs md:text-sm font-bold border border-[#007acc]/30 shadow-[0_0_15px_rgba(0,122,204,0.2)]">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                  <span>روایت مهر</span>
                </span>
              </motion.div>

              {/* Typography: Display Large */}
              <motion.h2
                variants={itemVariants}
                className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-3 md:mb-5 leading-tight tracking-tight"
              >
                مجلۀ{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007acc] to-[#4db8ff]">
                  مهر باران
                </span>
              </motion.h2>

              {/* Body: Body Large */}
              <motion.p
                variants={itemVariants}
                className="text-[#cce5ff] text-sm sm:text-base md:text-lg leading-relaxed md:leading-relaxed mb-6 md:mb-8 font-light opacity-90 text-justify"
              >
                روایتی از فعالیت‌های داوطلبانه و فرهنگ‌سازی در سازمان دانشجویان جهاد. جایی که هم‌افزایی و
                مشارکت، آینده‌ای روشن‌تر را رقم می‌زند.
              </motion.p>

              {/* Actions: FAB & Text Button */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 sm:gap-4 md:gap-5"
              >
                {/* Primary Action: Extended FAB Style */}
                <SmartButton
                  href="/blog"
                  variant="mblue"
                  asLink={true}
                  className="group/fab relative justify-center overflow-hidden !rounded-xl md:!rounded-[18px] !bg-[#007acc] !text-white !px-6 md:!px-8 !py-3 md:!py-4 !h-auto shadow-[0_8px_20px_rgba(0,122,204,0.4)] hover:shadow-[0_12px_28px_rgba(0,122,204,0.6)] transition-all duration-300"
                >
                  <div className="relative z-10 flex flex-row items-center justify-center w-full gap-2 md:gap-3">
                    <span className="text-sm sm:text-base md:text-lg font-bold tracking-wide">مشاهده آرشیو</span>
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/fab:-translate-x-1" />
                  </div>
                  {/* Ripple/Fill Effect */}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/fab:translate-y-0 transition-transform duration-300 ease-out rounded-[18px]" />
                </SmartButton>

                {/* Secondary Action: Text Button with Indicator */}
                <Link
                  href="/blog"
                  className="group/link flex justify-center items-center gap-2 text-[#e3e3e3] hover:text-[#007acc] transition-colors duration-300 px-4 py-3 md:py-2 flex-row rounded-xl hover:bg-white/5 border border-white/10 sm:border-transparent bg-white/5 sm:bg-transparent"
                >
                  <span className="text-sm sm:text-base font-medium">مطالعه آخرین شماره</span>
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- Overlay: Dynamic Mesh Background (Brand Color Injection) spanning the whole section --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
        <motion.div
          variants={meshVariants}
          animate="animate"
          className="absolute top-0 -left-[10%] w-[80%] h-[80%] md:w-[60%] md:h-[60%] rounded-full bg-[#007acc] blur-[100px] md:blur-[120px] opacity-40 mix-blend-screen"
        />
        <motion.div
          variants={meshVariants}
          animate="animate"
          transition={{ delay: 5 }}
          className="absolute bottom-0 -right-[10%] w-[90%] h-[90%] md:w-[70%] md:h-[70%] rounded-full bg-[#005c99] blur-[80px] md:blur-[100px] opacity-30 mix-blend-screen"
        />
      </div>
    </motion.section>
  );
};

export default BlogSection;
