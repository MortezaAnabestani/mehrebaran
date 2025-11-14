"use client";

import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

// حوزه‌های فعالیت
const focusAreas = [
  {
    id: 1,
    title: "شبکه نیازسنجی",
    icon: "🤝",
    description: "شناسایی و پاسخگویی به نیازهای واقعی جامعه از طریق شبکه داوطلبان",
    color: "from-blue-500 to-cyan-500",
    image: "/icons/needsNetwork.svg",
    stats: { projects: 45, volunteers: 320, beneficiaries: 1200 },
  },
  {
    id: 2,
    title: "محیط زیست",
    icon: "🌱",
    description: "پاکسازی طبیعت، درخت‌کاری و ارتقای آگاهی زیست‌محیطی",
    color: "from-green-500 to-emerald-500",
    image: "/icons/earthGlobe.svg",
    stats: { projects: 32, volunteers: 280, beneficiaries: 5000 },
  },
  {
    id: 3,
    title: "خیر مؤثر",
    icon: "💡",
    description: "کمک‌های هدفمند و مبتنی بر داده برای بیشینه‌سازی تأثیرگذاری",
    color: "from-purple-500 to-pink-500",
    image: "/icons/welfare.svg",
    stats: { projects: 28, volunteers: 150, beneficiaries: 800 },
  },
  {
    id: 4,
    title: "اردوهای جهادی",
    icon: "⛺",
    description: "خدمت‌رسانی به مناطق محروم و کمک به توسعه زیرساخت‌ها",
    color: "from-orange-500 to-red-500",
    image: "/icons/helping_hand.svg",
    stats: { projects: 52, volunteers: 450, beneficiaries: 3500 },
  },
  {
    id: 5,
    title: "مسئولیت اجتماعی",
    icon: "🎯",
    description: "آموزش، فرهنگ‌سازی و ارتقای سطح آگاهی اجتماعی",
    color: "from-yellow-500 to-amber-500",
    image: "/icons/helping.svg",
    stats: { projects: 38, volunteers: 210, beneficiaries: 2100 },
  },
  {
    id: 6,
    title: "سلامت و بهداشت",
    icon: "🏥",
    description: "کمپین‌های سلامت، ارائه خدمات پزشکی رایگان و آموزش بهداشت",
    color: "from-red-500 to-rose-500",
    image: "/icons/helping.svg",
    stats: { projects: 25, volunteers: 180, beneficiaries: 1500 },
  },
];

const FocusPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const isStatsInView = useInView(statsRef, { once: true });
  const isCardsInView = useInView(cardsRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hero Section with Parallax */}
      <motion.div
        ref={heroRef}
        style={{ y, opacity }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center"
      >
        {/* Glowing orb effect */}
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            حوزه‌های فعالیت ما
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            با تمرکز بر ۶ حوزه کلیدی، به ایجاد تغییرات مثبت و پایدار در جامعه کمک می‌کنیم
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-gray-400 text-sm">کشیده و کاوش کنید</span>
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <div ref={statsRef} className="relative z-20 -mt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "پروژه فعال", value: 220, icon: "📊" },
              { label: "داوطلب", value: 1590, icon: "👥" },
              { label: "ذینفع", value: 14100, icon: "🎯" },
              { label: "شهر فعال", value: 45, icon: "🌆" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <motion.div
                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-1"
                    initial={{ opacity: 0 }}
                    animate={isStatsInView ? { opacity: 1 } : {}}
                  >
                    {isStatsInView ? (
                      <CountUp end={stat.value} duration={2} />
                    ) : (
                      0
                    )}
                  </motion.div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Focus Areas Cards */}
      <div ref={cardsRef} className="relative z-20 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isCardsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              حوزه‌های تأثیرگذاری
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              هر یک از این حوزه‌ها با تلاش داوطلبان و حمایت شما، روزانه زندگی هزاران نفر را بهبود می‌بخشد
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {focusAreas.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isCardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${area.color} rounded-3xl blur-xl opacity-25 group-hover:opacity-75 transition-opacity`}
                />

                {/* Card */}
                <div className="relative bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-all overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                    <motion.div
                      className={`w-full h-full bg-gradient-to-br ${area.color} rounded-full blur-2xl`}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>

                  {/* Icon */}
                  <motion.div
                    className="text-6xl mb-4 relative z-10"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {area.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3 relative z-10">
                    {area.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 mb-6 leading-relaxed relative z-10">
                    {area.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                    <div className="text-center">
                      <div className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${area.color}`}>
                        {area.stats.projects}
                      </div>
                      <div className="text-xs text-gray-500">پروژه</div>
                    </div>
                    <div className="text-center border-x border-white/10">
                      <div className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${area.color}`}>
                        {area.stats.volunteers}
                      </div>
                      <div className="text-xs text-gray-500">داوطلب</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${area.color}`}>
                        {area.stats.beneficiaries}
                      </div>
                      <div className="text-xs text-gray-500">ذینفع</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href="/projects">
                    <motion.button
                      className={`w-full py-3 px-6 bg-gradient-to-r ${area.color} text-white font-semibold rounded-xl relative overflow-hidden group`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      <span className="relative z-10">مشاهده پروژه‌ها</span>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative z-20 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />

            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                آماده‌اید تا تأثیرگذار باشید؟
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                با پیوستن به جمع داوطلبان ما، می‌توانید در ایجاد تغییرات مثبت نقش داشته باشید
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/projects">
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    مشاهده پروژه‌ها
                  </motion.button>
                </Link>

                <Link href="/signup">
                  <motion.button
                    className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    عضویت به عنوان داوطلب
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// CountUp Component
const CountUp: React.FC<{ end: number; duration: number }> = ({ end, duration }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{count.toLocaleString("fa-IR")}</>;
};

export default FocusPage;
