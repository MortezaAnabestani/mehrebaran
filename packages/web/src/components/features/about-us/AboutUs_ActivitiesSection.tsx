"use client";
import { useInView, motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ACTIVITIES, FADE_IN_VARIANTS, SectionHeader } from "./AboutUs_Constants";

const ActivitiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
    }, 4000); // 4 seconds per card

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section ref={ref} className="py-24 bg-gray-50 relative overflow-hidden">
      {/* نوار رنگی بالای سکشن برای تاکید بر برند */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#007acc] to-blue-400 opacity-60" />

      <div className="w-11/12 mx-auto relative z-10">
        <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={FADE_IN_VARIANTS}>
          <SectionHeader title="حوزه‌های فعالیت" />

          {/* Desktop Grid (hidden on mobile) */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
            {ACTIVITIES.map((item, index) => (
              <motion.div
                key={item.title}
                variants={FADE_IN_VARIANTS}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-8 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 border-t-4 border-transparent hover:border-[#007acc] relative overflow-hidden cursor-default"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#007acc]/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500" />
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#007acc] transition-colors mb-4 relative z-10">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-justify text-sm relative z-10">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Mobile Fading View (visible on mobile only) */}
          <div className="md:hidden mt-8 relative h-[250px] flex justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                className="absolute w-full bg-white p-8 rounded-lg shadow-md border-t-4 border-[#007acc] overflow-hidden select-none touch-none"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#007acc]/5 rounded-bl-full -mr-12 -mt-12 scale-150" />
                <h3 className="text-xl font-bold text-[#007acc] mb-4 relative z-10">
                  {ACTIVITIES[currentIndex].title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-justify text-sm relative z-10">
                  {ACTIVITIES[currentIndex].desc}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* Indicators */}
            <div className="absolute -bottom-8 flex gap-2 w-full justify-center">
              {ACTIVITIES.map((activity, idx) => (
                <div
                  key={activity.title}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? "bg-[#007acc] w-6" : "bg-gray-300 w-2"
                  }`}
                />
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
