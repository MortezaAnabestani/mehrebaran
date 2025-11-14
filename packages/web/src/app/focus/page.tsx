"use client";

import { AppleWatchDock } from "@/components/views/focus_co/AppleWatchDock";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// داده‌های حوزه‌های فعالیت
const focusAreas = [
  {
    title: "شبکه نیازسنجی",
    description: "شناسایی و پاسخگویی به نیازهای واقعی جامعه از طریق شبکه‌ای از داوطلبان متخصص و متعهد",
    icon: "🤝",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    title: "محیط زیست",
    description: "پاکسازی طبیعت، درخت‌کاری و ارتقای فرهنگ زیست‌محیطی در جامعه",
    icon: "🌱",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    title: "خیر مؤثر",
    description: "کمک‌های هدفمند و مبتنی بر داده برای بیشینه‌سازی تأثیرگذاری اجتماعی",
    icon: "💡",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "اردوهای جهادی",
    description: "خدمت‌رسانی به مناطق محروم و کمک به توسعه پایدار زیرساخت‌ها",
    icon: "⛺",
    gradient: "from-orange-500 to-red-600",
  },
  {
    title: "مسئولیت اجتماعی",
    description: "آموزش، فرهنگ‌سازی و ارتقای سطح آگاهی و مشارکت اجتماعی",
    icon: "🎯",
    gradient: "from-amber-500 to-yellow-600",
  },
  {
    title: "سلامت و بهداشت",
    description: "کمپین‌های سلامت، ارائه خدمات پزشکی رایگان و آموزش بهداشت عمومی",
    icon: "🏥",
    gradient: "from-rose-500 to-red-600",
  },
];

const FocusPage: React.FC = () => {
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
                <AppleWatchDock />
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
                  حوزه‌های فعالیت
                  <span className="block text-cyan-300">کانون مهرباران</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-blue-100 leading-relaxed mb-8"
              >
                فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد دانشگاهی خراسان رضوی
                جهت فرهنگ‌سازی، توسعه پایدار و ایجاد تحول مثبت در جامعه
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
                  { label: "پروژه فعال", value: "۲۲۰+" },
                  { label: "داوطلب", value: "۱۵۹۰+" },
                  { label: "ذینفع", value: "۱۴۱۰۰+" },
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
            ما در شش حوزه کلیدی با هدف ایجاد تحول پایدار و ارتقای کیفیت زندگی جامعه فعالیت می‌کنیم
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {focusAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${area.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`} />

              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="text-6xl mb-6 inline-block"
                >
                  {area.icon}
                </motion.div>

                <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${area.gradient} bg-clip-text text-transparent`}>
                  {area.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {area.description}
                </p>

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
              با پیوستن به جمع داوطلبان ما، می‌توانید در ایجاد تحولات مثبت و پایدار در جامعه نقش فعال داشته باشید
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-mblue font-bold rounded-full text-lg shadow-lg"
                >
                  مشاهده همه پروژه‌ها
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white hover:text-mblue transition-all"
                >
                  ثبت‌نام به عنوان داوطلب
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FocusPage;
