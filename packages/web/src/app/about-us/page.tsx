"use client";
import React from "react";
import ThreeD from "./ThreeD";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

function StatCard({ number, label }: { number: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
    >
      <div className="text-5xl font-bold text-white mb-2">{number}</div>
      <div className="text-lg text-blue-100">{label}</div>
    </motion.div>
  );
}

function ValueCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

const AboutUs: React.FC = () => {
  const aboutRef = useRef(null);
  const missionRef = useRef(null);
  const valuesRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });

  return (
    <div className="overflow-hidden">
      {/* Hero Section با Three.js */}
      <section className="relative h-screen w-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
        <div className="absolute inset-0">
          <ThreeD />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl"
            >
              کانون مهرباران
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-3xl text-blue-100 mb-8 drop-shadow-lg"
            >
              سازمان دانشجویان جهاد دانشگاهی خراسان رضوی
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center gap-4"
            >
              <button className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                درباره ما بیشتر بدانید
              </button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-b from-blue-900 to-blue-800">
        <div className="w-9/10 md:w-8/10 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard number="۱۵۹۰+" label="داوطلب فعال" />
            <StatCard number="۲۲۰+" label="پروژه انجام شده" />
            <StatCard number="۱۴۱۰۰+" label="ذینفع" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-24 bg-gradient-to-b from-blue-800 to-white">
        <div className="w-9/10 md:w-8/10 mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-5xl font-bold text-white mb-6">
              درباره کانون مهرباران
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-24 h-1 bg-blue-400 mx-auto mb-8 rounded-full"
            ></motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl p-12 mb-12"
          >
            <p className="text-xl text-gray-700 leading-relaxed text-justify mb-6">
              کانون مهرباران، بخشی از سازمان دانشجویان جهاد دانشگاهی خراسان رضوی است که با هدف
              ایجاد تحول مثبت در جامعه و توسعه پایدار، فعالیت‌های داوطلبانه و عام‌المنفعه را سازماندهی
              می‌کند.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed text-justify mb-6">
              ما با تکیه بر توان جوانان و دانشجویان، در حوزه‌های مختلف اجتماعی، فرهنگی و آموزشی
              فعالیت می‌کنیم و تلاش داریم تا با ایجاد فرصت‌های داوطلبی، زمینه رشد و شکوفایی استعدادها
              را فراهم آوریم.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed text-justify">
              کانون مهرباران بر این باور است که هر فرد می‌تواند با مشارکت در پروژه‌های اجتماعی، تاثیر
              مثبتی در جامعه خود ایجاد کند و ما در این مسیر، همراه و پشتیبان همه علاقه‌مندان به خدمت
              رسانی هستیم.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section ref={missionRef} className="py-24 bg-white">
        <div className="w-9/10 md:w-8/10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-white shadow-2xl">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-4xl font-bold mb-6">مأموریت ما</h3>
              <p className="text-lg leading-relaxed">
                فرهنگ‌سازی و ترویج فعالیت‌های داوطلبانه در بین دانشجویان و جوانان، ایجاد بسترهای
                مناسب برای خدمت‌رسانی به جامعه، و توانمندسازی نیرو‌های داوطلب برای ایجاد تحولات
                مثبت و پایدار در حوزه‌های مختلف اجتماعی، فرهنگی و آموزشی.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-12 text-white shadow-2xl">
              <div className="text-6xl mb-6">🔭</div>
              <h3 className="text-4xl font-bold mb-6">چشم‌انداز ما</h3>
              <p className="text-lg leading-relaxed">
                تبدیل شدن به پیشتاز فعالیت‌های داوطلبانه دانشجویی در سطح کشور، ایجاد جامعه‌ای پویا
                و مسئولیت‌پذیر با مشارکت فعال جوانان، و الگوسازی در زمینه پروژه‌های عام‌المنفعه که
                منجر به ارتقای کیفیت زندگی شهروندان شود.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-24 bg-gray-50">
        <div className="w-9/10 md:w-8/10 mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-5xl font-bold text-gray-800 mb-6">
              ارزش‌های ما
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-24 h-1 bg-blue-600 mx-auto mb-8 rounded-full"
            ></motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ValueCard
              icon="🤝"
              title="همدلی و همراهی"
              description="ما بر این باوریم که تنها با همکاری و همدلی می‌توانیم تغییرات بزرگ را رقم بزنیم. در کانون مهرباران، هر فرد عضو ارزشمند خانواده‌ای بزرگ است."
            />
            <ValueCard
              icon="💡"
              title="نوآوری و خلاقیت"
              description="ما به دنبال راه‌حل‌های نو و خلاقانه برای مسائل اجتماعی هستیم و از تفکر نوآورانه و ایده‌های جدید استقبال می‌کنیم."
            />
            <ValueCard
              icon="🌱"
              title="توسعه پایدار"
              description="پروژه‌های ما با رویکرد پایداری طراحی می‌شوند تا اثرگذاری بلندمدت در جامعه داشته باشند و منابع را به نحو احسن مدیریت کنند."
            />
            <ValueCard
              icon="🎓"
              title="یادگیری مستمر"
              description="ما به رشد و یادگیری مداوم اعتقاد داریم و فضایی را فراهم می‌کنیم که افراد بتوانند مهارت‌ها و دانش خود را ارتقا دهند."
            />
            <ValueCard
              icon="⚖️"
              title="مسئولیت‌پذیری"
              description="پاسخگو بودن در قبال جامعه، محیط زیست و نسل‌های آینده، یکی از اصول بنیادین فعالیت ماست."
            />
            <ValueCard
              icon="❤️"
              title="انسان‌محوری"
              description="انسان و کرامت انسانی در مرکز تمام فعالیت‌های ماست و تلاش می‌کنیم با احترام و شفقت با همه افراد رفتار کنیم."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="w-9/10 md:w-8/10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-6">آماده‌اید تا با ما همراه شوید؟</h2>
            <p className="text-2xl mb-12 text-blue-100">
              به جمع داوطلبان مهرباران بپیوندید و در ایجاد تحولات مثبت اجتماعی سهیم باشید
            </p>
            <button className="bg-white text-blue-600 px-12 py-5 rounded-full font-bold text-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
              عضویت در کانون
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
