"use client";

import { AppleWatchDock } from "@/components/views/focus_co/AppleWatchDock";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IFocusPageHeroSetting } from "common-types";

// --- SWISS NEO CONFIGURATION ---
const BG_COLOR = "#F5F5F7"; // Off-white Swiss standard

const SWISS_TRANSITION = {
  duration: 0.6,
  ease: "linear" as const, // No bounce, strict digital movement
};

const DEFAULT_HERO_SETTINGS: IFocusPageHeroSetting = {
  title: "حوزه‌های فعالیت",
  subtitle: "کانون مهرباران",
  description:
    "فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد دانشگاهی خراسان رضوی جهت فرهنگ‌سازی، توسعه پایدار و ایجاد تحول مثبت در جامعه",
  stats: {
    projects: { label: "پروژه فعال", value: "۲۲۰+" },
    volunteers: { label: "داوطلب", value: "۱۵۹۰+" },
    beneficiaries: { label: "ذینفع", value: "۱۴۱۰۰+" },
  },
  dockImages: ["/images/1.png", "/images/2.png", "/images/hero_img.jpg", "/images/blog_img.jpg"],
};

interface FocusPageClientProps {
  initialSettings?: IFocusPageHeroSetting | null;
}

const FocusPageClient: React.FC<FocusPageClientProps> = ({ initialSettings }) => {
  const heroSettings = initialSettings || DEFAULT_HERO_SETTINGS;

  return (
    <div
      className={`relative min-h-screen w-full bg-[${BG_COLOR}] text-slate-900 selection:bg-[#007acc] selection:text-white`}
    >
      {/* Background Interactive Dock Layer covering the whole page */}
      <div className="fixed inset-0 z-0 overflow-hidden opacity-30 pointer-events-auto">
        <AppleWatchDock images={heroSettings.dockImages} />
      </div>

      {/* --- HERO SECTION: Swiss Layout --- */}
      <section className="relative z-10 pt-32 pb-16 px-6 md:px-12 lg:px-24 border-b border-slate-200 pointer-events-none">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            {/* Typography Block */}
            <div className="lg:col-span-7 flex flex-col gap-8 relative z-20 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={SWISS_TRANSITION}
              >
                <span className="inline-block text-[#007acc] font-bold text-sm mb-4 uppercase">
                  {heroSettings.subtitle}
                </span>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-thin leading-[0.9] text-slate-900 pointer-events-auto">
                  {heroSettings.title}
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...SWISS_TRANSITION, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-500 font-light max-w-2xl leading-relaxed mt-8 border-r-2 border-[#007acc] pr-8 pointer-events-auto"
              >
                {heroSettings.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SWISS_TRANSITION, delay: 0.4 }}
                className="flex flex-wrap gap-6 mt-12 pointer-events-auto"
              >
                <Link href="/projects" className="group relative rounded-md px-10 py-4 bg-slate-900 text-white text-sm font-bold overflow-hidden inline-flex items-center justify-center">
                  <span className="relative z-10 group-hover:text-[#007acc] transition-colors duration-300">
                    مشاهده پروژه‌ها
                  </span>
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-linear" />
                </Link>
                <Link href="/signup" className="inline-flex items-center justify-center px-10 py-4 border rounded-md border-slate-900 text-slate-900 text-sm font-bold tracking-widest hover:bg-[#007acc] hover:border-[#007acc] hover:text-white transition-colors duration-300">
                  عضویت داوطلبان
                </Link>
              </motion.div>
            </div>

            {/* Visual/Dock Block - Removed since it is now covering the whole page */}
            <div className="lg:col-span-5 relative rounded-xl h-[400px]">
              {/* This space is left intentionally blank to balance the grid, the dock is now full page */}
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS STRIP: Minimalist Grid --- */}
      <section className="border-b border-slate-200 bg-white/50 backdrop-blur-sm relative z-10 pointer-events-none">
        <div className="container mx-auto px-6 md:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-200">
            {[
              heroSettings.stats.projects,
              heroSettings.stats.volunteers,
              heroSettings.stats.beneficiaries,
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ...SWISS_TRANSITION, delay: i * 0.1 }}
                className="py-12 px-8 text-center md:text-right group hover:bg-slate-50 transition-colors duration-300 pointer-events-auto"
              >
                <div className="text-5xl font-thin text-slate-900 mb-2 group-hover:text-[#007acc] transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION: High Contrast --- */}
      <section className="bg-slate-900 text-white py-32 px-6 md:px-24 relative overflow-hidden pointer-events-none">
        {/* Abstract geometric shape */}
        <div className="absolute top-0 left-0 w-64 h-full bg-[#007acc] opacity-20 transform -skew-x-12" />

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={SWISS_TRANSITION}
              className="max-w-3xl pointer-events-auto"
            >
              <h2 className="text-6xl md:text-8xl font-thin mb-8 leading-none">
                <span className="font-bold text-[#007acc]">یه‌دَص</span>
                دا نداره!
              </h2>
              <p className="text-slate-400 text-xl font-light max-w-xl">
                با پیوستن به کانون مهرباران، شما بخشی از یک ساختار مدرن برای تغییر هستید.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={SWISS_TRANSITION}
              className="pointer-events-auto"
            >
              <Link href="/signup" className="w-64 h-64 rounded-full bg-[#007acc] hover:bg-white hover:text-[#007acc] text-white text-2xl font-bold transition-all duration-500 flex items-center justify-center shadow-none border-none pointer-events-auto">
                عضویت
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FocusPageClient;
