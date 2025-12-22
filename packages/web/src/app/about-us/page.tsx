"use client";
import React, { useEffect, useState } from "react";
import ThreeD from "./ThreeD";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const AboutUs: React.FC = () => {
  const aboutRef = useRef(null);
  const activitiesRef = useRef(null);
  const contactRef = useRef(null);
  const [audio, setAudio] = useState(null);

  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const activitiesInView = useInView(activitiesRef, { once: true, margin: "-100px" });
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" });

  useEffect(() => {
    // ایجاد یک نمونه از شیء Audio در سمت کلاینت
    const rainSound = new Audio("/sounds/rain.mp3");
    rainSound.loop = true; // تکرار موسیقی
    rainSound.volume = 0.5; // تنظیم بلندی صدا
    setAudio(rainSound);

    // تابع پاک‌سازی: این تابع هنگام خروج از صفحه اجرا می‌شود
    return () => {
      if (rainSound) {
        rainSound.pause(); // توقف موسیقی
      }
    };
  }, []);

  useEffect(() => {
    if (audio) {
      // تلاش برای پخش موسیقی
      audio.play().catch((error) => {
        // در صورتی که مرورگر جلوی پخش خودکار را بگیرد، این خطا رخ می‌دهد
        console.error("Autoplay was prevented: ", error);
        // می‌توانید در اینجا یک دکمه برای پخش دستی به کاربر نمایش دهید
      });
    }
  }, [audio]);

  return (
    <div className="bg-white">
      {/* Hero با باران */}
      <section className="relative h-screen w-full bg-gradient-to-b from-mblue/90 to-mblue">
        <div className="absolute inset-0">
          <ThreeD />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl"
            >
              کانون مهرباران
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-blue-100 drop-shadow-lg"
            >
              سازمان دانشجویان جهاد دانشگاهی خراسان رضوی
            </motion.p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce"
        >
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
        </motion.div>
      </section>

      {/* درباره ما */}
      <section ref={aboutRef} className="py-20 bg-white">
        <div className="w-9/10 md:w-8/10 mx-auto">
          <motion.div
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">درباره کانون مهرباران</h2>
            <div className="w-20 h-1 bg-mblue mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-lg text-gray-700 leading-relaxed text-justify mb-6">
              کانون مهرباران، بخشی از سازمان دانشجویان جهاد دانشگاهی خراسان رضوی است که با هدف ایجاد تحول مثبت
              در جامعه و توسعه پایدار، فعالیت‌های داوطلبانه و عام‌المنفعه را سازماندهی می‌کند. ما با تکیه بر
              توان جوانان و دانشجویان، در حوزه‌های مختلف اجتماعی، فرهنگی و آموزشی فعالیت می‌کنیم.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-4xl font-bold text-mblue mb-2">۱۵۹۰+</div>
                <div className="text-gray-700">داوطلب فعال</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-4xl font-bold text-mblue mb-2">۲۲۰+</div>
                <div className="text-gray-700">پروژه انجام شده</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-4xl font-bold text-mblue mb-2">۱۴۱۰۰+</div>
                <div className="text-gray-700">ذینفع</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* حوزه‌های فعالیت */}
      <section ref={activitiesRef} className="py-20 bg-gray-50">
        <div className="w-9/10 md:w-8/10 mx-auto">
          <motion.div
            initial="hidden"
            animate={activitiesInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">حوزه‌های فعالیت</h2>
            <div className="w-20 h-1 bg-mblue mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: "آموزش و پرورش", desc: "برگزاری کلاس‌های آموزشی رایگان برای دانش‌آموزان" },
              { title: "فرهنگی و هنری", desc: "برگزاری رویدادهای فرهنگی و هنری" },
              { title: "محیط زیست", desc: "طرح‌های حفاظت از محیط زیست و کاشت درخت" },
              { title: "سلامت", desc: "ارائه خدمات بهداشتی و درمانی به نیازمندان" },
              { title: "کمک‌های معیشتی", desc: "جمع‌آوری و توزیع کمک‌های مردمی" },
              { title: "توانمندسازی", desc: "آموزش مهارت‌های شغلی و کارآفرینی" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={activitiesInView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-mblue mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* اطلاعات تماس */}
      <section ref={contactRef} className="py-20 bg-white">
        <div className="w-9/10 md:w-8/10 mx-auto">
          <motion.div
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">ارتباط با ما</h2>
            <div className="w-20 h-1 bg-mblue mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">اطلاعات تماس</h3>

              <div className="flex items-start gap-4">
                <div className="text-mblue text-2xl">📍</div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">آدرس</h4>
                  <p className="text-gray-600 leading-relaxed">
                    مشهد، بلوار وکیل‌آباد، جهاد دانشگاهی خراسان رضوی
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-mblue text-2xl">📞</div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">تلفن</h4>
                  <p className="text-gray-600 direction-ltr text-right">۰۵۱-۳۸۸۱۲۳۴۵</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-mblue text-2xl">✉️</div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">ایمیل</h4>
                  <p className="text-gray-600 direction-ltr text-right">info@mehrebaran.ir</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-mblue text-2xl">🌐</div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">شبکه‌های اجتماعی</h4>
                  <div className="flex gap-4 mt-2">
                    <a href="#" className="text-mblue hover:text-blue-700">
                      اینستاگرام
                    </a>
                    <a href="#" className="text-mblue hover:text-blue-700">
                      تلگرام
                    </a>
                    <a href="#" className="text-mblue hover:text-blue-700">
                      آپارات
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">عضویت در کانون</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                اگر علاقه‌مند به فعالیت‌های داوطلبانه و کمک به جامعه هستید، می‌توانید با تکمیل فرم ثبت‌نام به
                جمع داوطلبان مهرباران بپیوندید.
              </p>
              <button className="w-full bg-mblue text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
                ثبت‌نام داوطلب
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
