import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import { ACTIVITIES, FADE_IN_VARIANTS, SectionHeader } from "./AboutUs_Constants";

const ActivitiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-gray-50 relative overflow-hidden">
      {/* نوار رنگی بالای سکشن برای تاکید بر برند */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#007acc] to-blue-400 opacity-60" />

      <div className="w-11/12 md:w-10/12 mx-auto relative z-10">
        <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={FADE_IN_VARIANTS}>
          <SectionHeader title="حوزه‌های فعالیت" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
            {ACTIVITIES.map((item, index) => (
              <motion.div
                key={index}
                variants={FADE_IN_VARIANTS}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-8 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 border-t-4 border-transparent hover:border-[#007acc] relative overflow-hidden cursor-default"
              >
                {/* افکت دکوراتیو پس‌زمینه کارت */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#007acc]/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500" />

                <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#007acc] transition-colors mb-4 relative z-10">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-justify text-sm relative z-10">
                  {item.desc}
                </p>

                {/* المان تعاملی متریال (Action Hint) */}
                <div className="mt-6 flex items-center text-[#007acc] font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-sm">جزئیات بیشتر</span>
                  <svg
                    className="w-4 h-4 mr-2 rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
