"use client";

import { AppleWatchDock } from "@/components/views/focus_co/AppleWatchDock";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getFocusAreas } from "@/services/focus-area.service";
import { getFocusPageHeroSettings } from "@/services/setting.service";
import { IFocusArea, IFocusPageHeroSetting } from "common-types";

// Default values fallback
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
  dockImages: [
    "/images/1.png",
    "/images/2.png",
    "/images/hero_img.jpg",
    "/images/blog_img.jpg",
  ],
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Hero Section with AppleWatchDock */}
      <div className="relative overflow-hidden bg-gradient-to-br from-mblue via-blue-600 to-purple-700">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* AppleWatchDock Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/2 relative"
            >
              <div className="relative border-l-8 border-white/30 rounded-2xl bg-gradient-to-r from-white/10 to-transparent backdrop-blur-sm p-8 shadow-2xl">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full" />
                <AppleWatchDock images={heroSettings.dockImages} />
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full md:w-1/2 text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                  {heroSettings.title}
                  <span className="block text-cyan-300">{heroSettings.subtitle}</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-blue-100 leading-relaxed mb-8"
              >
                {heroSettings.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-mblue font-bold rounded-full shadow-lg hover:shadow-2xl transition-all"
                  >
                    مشاهده پروژه‌ها
                  </motion.button>
                </Link>
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-mblue transition-all"
                  >
                    عضویت داوطلبان
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-3 gap-6 mt-12"
              >
                {[
                  heroSettings.stats.projects,
                  heroSettings.stats.volunteers,
                  heroSettings.stats.beneficiaries,
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-black text-cyan-300">{stat.value}</div>
                    <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#f8fafc"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      {/* Focus Areas Grid */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            حوزه‌های تخصصی فعالیت
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ما در حوزه‌های کلیدی با هدف ایجاد تحول پایدار و ارتقای کیفیت زندگی جامعه فعالیت می‌کنیم
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-xl text-gray-600">در حال بارگذاری...</div>
          </div>
        ) : focusAreas.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-xl text-gray-600">هیچ حوزه فعالیتی یافت نشد.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {focusAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                />

                <div className="relative p-8">
                  <div className="text-5xl mb-4">{area.icon}</div>
                  <h3
                    className={`text-2xl font-black mb-4 bg-gradient-to-r ${area.gradient} bg-clip-text text-transparent`}
                  >
                    {area.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{area.description}</p>

                  <Link href="/projects">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 px-6 bg-gradient-to-r ${area.gradient} text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all`}
                    >
                      مشاهده پروژه‌ها
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-mblue to-purple-700 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              آماده‌اید برای ایجاد تغییر؟
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              با پیوستن به کانون مهرباران، شما نیز می‌توانید بخشی از این تحول مثبت باشید
            </p>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-white text-mblue font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all text-lg"
              >
                همین حالا عضو شوید
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FocusPage;
