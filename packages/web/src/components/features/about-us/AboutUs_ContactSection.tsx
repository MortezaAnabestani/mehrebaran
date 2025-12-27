import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FADE_IN_VARIANTS } from "./AboutUs_Constants";

// کامپوننت کارت با استایل متریال (Elevation Effect)
// در طراحی متریال، تعامل با بالا آمدن سطح (Elevation) و افزایش سایه نمایش داده می‌شود
const MaterialCard = ({
  children,
  className,
  variant = "surface",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "surface" | "primary";
}) => {
  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative overflow-hidden rounded-2xl transition-colors duration-300
        ${
          variant === "surface"
            ? "bg-white text-gray-800 shadow-lg border border-gray-100"
            : "bg-[#007acc] text-white shadow-xl shadow-blue-500/30"
        }
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative pb-10 bg-gray-50 overflow-hidden">
      {/* --- Background Elements (Subtle Material Patterns) --- */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gray-200/50 to-transparent" />
        <div className="absolute left-[-10%] bottom-[-10%] w-96 h-96 bg-[#007acc]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-9/10 md:w-8/10 mx-auto max-w-6xl">
        <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={FADE_IN_VARIANTS}>
          {/* هدر بخش */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">ارتباط با ما</h2>
            <div className="flex justify-center items-center gap-2">
              <span className="h-1 w-8 bg-[#007acc] rounded-full" />
              <span className="h-1 w-2 bg-[#007acc]/50 rounded-full" />
            </div>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              ما همیشه آماده شنیدن نظرات، پیشنهادات و پاسخگویی به سوالات شما هستیم.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* --- کارت اطلاعات تماس (Surface Card) --- */}
            <MaterialCard variant="surface" className="h-full p-8 md:p-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-[#007acc] rounded-full block"></span>
                اطلاعات تماس
              </h3>

              <div className="space-y-8">
                {/* آیتم آدرس */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-50 text-[#007acc] group-hover:bg-[#007acc] group-hover:text-white transition-colors duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">آدرس دفتر مرکزی</h4>
                    <p className="text-gray-700 text-lg font-medium leading-relaxed">
                      مشهد، بلوار وکیل‌آباد، خیابان هنرستان، پلاک ۱۴
                    </p>
                  </div>
                </div>

                {/* آیتم تلفن */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-50 text-[#007acc] group-hover:bg-[#007acc] group-hover:text-white transition-colors duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">شماره تماس</h4>
                    <p className="text-gray-700 text-lg font-medium dir-ltr text-right font-mono">
                      051 - 3888 8888
                    </p>
                  </div>
                </div>

                {/* آیتم ایمیل */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-50 text-[#007acc] group-hover:bg-[#007acc] group-hover:text-white transition-colors duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">پست الکترونیک</h4>
                    <p className="text-gray-700 text-lg font-medium">info@brandname.com</p>
                  </div>
                </div>
              </div>
            </MaterialCard>

            {/* --- کارت عضویت (Primary/Accent Card) --- */}
            <MaterialCard variant="primary" className="h-full p-8 md:p-10 flex flex-col justify-between">
              {/* پترن پس زمینه دکوراتیو */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-6">عضویت در کانون</h3>
                <p className="text-blue-100 text-lg leading-relaxed mb-8 opacity-90">
                  به جمع داوطلبان ما بپیوندید و در خلق آینده‌ای روشن‌تر سهیم باشید. با عضویت در کانون، به شبکه
                  گسترده‌ای از متخصصین و رویدادهای اختصاصی دسترسی خواهید داشت.
                </p>

                <ul className="space-y-3 mb-10 text-blue-50">
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    دسترسی به پنل اختصاصی
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    دعوت‌نامه رویدادهای ویژه
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    شبکه‌سازی با اعضای ارشد
                  </li>
                </ul>
              </div>

              <div className="relative z-10 mt-auto">
                <button className="w-full bg-white text-[#007acc] px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-blue-50 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group/btn">
                  <span>ثبت‌نام داوطلب</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover/btn:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
              </div>
            </MaterialCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
