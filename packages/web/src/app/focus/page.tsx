"use client";

import { AppleWatchDock } from "@/components/views/focus_co/AppleWatchDock";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getFocusAreas } from "@/services/focus-area.service";
import { getFocusPageHeroSettings } from "@/services/setting.service";
import { IFocusArea, IFocusPageHeroSetting } from "common-types";

// --- SWISS NEO CONFIGURATION ---
const BRAND_COLOR = "#007acc";
const BG_COLOR = "#F5F5F7"; // Off-white Swiss standard

const SWISS_TRANSITION = {
  duration: 0.6,
  ease: "linear", // No bounce, strict digital movement
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

const FocusPage: React.FC = () => {
  const [focusAreas, setFocusAreas] = useState<IFocusArea[]>([]);
  const [heroSettings, setHeroSettings] = useState<IFocusPageHeroSetting>(DEFAULT_HERO_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [areasResponse, settings] = await Promise.all([
          getFocusAreas({ isActive: true, sort: "order" }),
          getFocusPageHeroSettings(),
        ]);
        setFocusAreas(areasResponse.data);
        if (settings) {
          setHeroSettings(settings);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div
      className={`min-h-screen bg-[${BG_COLOR}] text-slate-900 selection:bg-[#007acc] selection:text-white overflow-x-hidden`}
    >
      {/* --- HERO SECTION: Swiss Layout --- */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 lg:px-24 border-b border-slate-200">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            {/* Typography Block */}
            <div className="lg:col-span-7 flex flex-col gap-8 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={SWISS_TRANSITION}
              >
                <span className="inline-block text-[#007acc] font-bold tracking-[0.2em] text-sm mb-4 uppercase">
                  {heroSettings.subtitle}
                </span>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-thin tracking-tighter leading-[0.9] text-slate-900">
                  {heroSettings.title}
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...SWISS_TRANSITION, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-500 font-light max-w-2xl leading-relaxed mt-8 pl-8 border-l-2 border-[#007acc]"
              >
                {heroSettings.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SWISS_TRANSITION, delay: 0.4 }}
                className="flex flex-wrap gap-6 mt-12"
              >
                <Link href="/projects">
                  <button className="group relative rounded-md px-10 py-4 bg-slate-900 text-white text-sm font-bold tracking-widest overflow-hidden">
                    <span className="relative z-10  group-hover:text-[#007acc] transition-colors duration-300">
                      مشاهده پروژه‌ها
                    </span>
                    <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-linear" />
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-10 py-4 border  rounded-md border-slate-900 text-slate-900 text-sm font-bold tracking-widest hover:bg-[#007acc] hover:border-[#007acc] hover:text-white transition-colors duration-300">
                    عضویت داوطلبان
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Visual/Dock Block - Strictly Aligned */}
            <div className="lg:col-span-5 relative rounded-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={SWISS_TRANSITION}
                className="relative w-full rounded-xl aspect-square md:aspect-auto md:h-[500px] bg-white border border-slate-200 p-4 shadow-none"
              >
                {/* Abstract decorative element */}
                <div className="absolute  rounded-xl -top-4 -right-4 w-24 h-24 bg-[#007acc] opacity-10 z-0" />

                <div className="relative z-10 h-full w-full flex items-center justify-center bg-slate-50 overflow-hidden">
                  {/* Wrapping the dock to fit the strict container */}
                  <div className="scale-90 transform">
                    <AppleWatchDock images={heroSettings.dockImages} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS STRIP: Minimalist Grid --- */}
      <section className="border-b border-slate-200 bg-white">
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
                className="py-12 px-8 text-center md:text-right group hover:bg-slate-50 transition-colors duration-300"
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

      {/* --- FOCUS AREAS: Brutalist Grid --- */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-[#F5F5F7]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SWISS_TRANSITION}
            className="mb-24 flex flex-col md:flex-row justify-between items-end border-b border-slate-300 pb-8"
          >
            <h2 className="text-5xl md:text-7xl font-thin text-slate-900 max-w-2xl leading-tight">
              حوزه‌های <br /> <span className="font-bold text-[#007acc]">تخصصی</span>
            </h2>
            <p className="text-slate-500 max-w-md mt-6 md:mt-0 text-justify">
              ما در حوزه‌های کلیدی با هدف ایجاد تحول پایدار و ارتقای کیفیت زندگی جامعه فعالیت می‌کنیم. رویکرد
              ما مبتنی بر داده و تاثیرگذاری است.
            </p>
          </motion.div>

          {loading ? (
            <div className="py-20 text-center font-mono text-sm text-slate-400 animate-pulse">
              LOADING DATA...
            </div>
          ) : focusAreas.length === 0 ? (
            <div className="py-20 text-center font-mono text-sm text-slate-400">NO DATA AVAILABLE</div>
          ) : (
            <div className="grid grid-cols-1 rounded-xl md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-300 border border-slate-300">
              {/* Gap-px with bg-slate-300 creates the grid lines effect */}
              {focusAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...SWISS_TRANSITION, delay: index * 0.1 }}
                  className="group relative bg-white p-12 h-full rounded-xl flex flex-col justify-between hover:bg-[#007acc] transition-colors duration-300"
                >
                  <div>
                    <div className="text-4xl mb-8 text-slate-300 group-hover:text-white/80 transition-colors">
                      {/* Assuming icon is a string/emoji, if component render directly */}
                      {area.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-white transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 group-hover:text-white/90 transition-colors">
                      {area.description}
                    </p>
                  </div>

                  <Link href="/projects" className="mt-auto">
                    <div className="flex items-center gap-4 text-slate-900 font-bold text-sm tracking-widest group-hover:text-white transition-colors">
                      <span>مشاهده</span>
                      <span className="block w-8 h-[1px] bg-slate-900 group-hover:bg-white transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- CTA SECTION: High Contrast --- */}
      <section className="bg-slate-900 text-white py-32 px-6 md:px-24 relative overflow-hidden">
        {/* Abstract geometric shape */}
        <div className="absolute top-0 left-0 w-64 h-full bg-[#007acc] opacity-20 transform -skew-x-12" />

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={SWISS_TRANSITION}
              className="max-w-3xl"
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
            >
              <Link href="/signup">
                <button className="w-64 h-64 rounded-full bg-[#007acc] hover:bg-white hover:text-[#007acc] text-white text-2xl font-bold transition-all duration-500 flex items-center justify-center shadow-none border-none">
                  عضویت
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FocusPage;
