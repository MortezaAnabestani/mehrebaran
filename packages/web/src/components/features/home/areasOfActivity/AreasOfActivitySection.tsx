"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AreaItem from "./AreaItem";
import HeadTitle from "../HeadTitle";
import { AreasOfActivity } from "@/types/types";
import Line from "./Line";
import OptimizedImage from "@/components/ui/OptimizedImage";

const activities: AreasOfActivity[] = [
  {
    title: "شبکه نیازسنجی",
    icon: "/icons/needsNetwork.svg",
    description: "نان و پنیر و همدلی گرما ببافیم بازارچه خیریه",
    color: "mgray",
    position: "top",
  },
  {
    title: "محیط زیست",
    icon: "/icons/earthGlobe.svg",
    description: "پاکسازی طبیعت درخت‌کاری",
    color: "mblue",
    position: "bottom",
  },
  {
    title: "خیر مؤثر",
    icon: "/icons/welfare.svg",
    description: "نان و پنیر و همدلی گرما ببافیم بازارچه خیریه",
    color: "mgray",
    position: "top",
  },
  {
    title: "اردوهای جهادی",
    icon: "/icons/helping_hand.svg",
    description: "دست در دست به رنگ شادی باران تویی",
    color: "mblue",
    position: "bottom",
  },
  {
    title: "مسئولیت اجتماعی",
    icon: "/icons/helping.svg",
    description: "راستا آموزش کمپین سلامت اجتماعی",
    color: "mgray",
    position: "top",
  },
];

const AreasOfActivitySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden md:py-16">
      <div className="absolute inset-0  pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <HeadTitle
          title="حوزه‌های فعالیت"
          subTitle="فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد دانشگاهی خراسان رضوی"
        />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="hidden md:flex relative mb-10 flex-row-reverse items-center justify-between flex-wrap mx-auto w-full"
      >
        {activities.map((activity, index) => {
          const next = activities[index + 1];
          const isCurrentTop = activity.position === "top";
          const isNextBottom = next?.position === "bottom";

          return (
            <motion.div key={activity.title} variants={itemVariants} className="relative " whileHover={{ zIndex: 10 }}>
              <AreaItem
                title={activity.title}
                icon={activity.icon}
                description={activity.description}
                color={activity.color}
                position={activity.position}
              />

              {/* خط اتصال با جریان نور */}
              <div className="hidden md:block">
                {next && <Line isCurrentTop={isCurrentTop} isNextBottom={isNextBottom} />}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* کانتینر آیتم‌ها (موبایل) - Vertical Timeline */}
      <div className="md:hidden relative px-2 py-8 mt-4 mx-auto max-w-sm">
        {/* خط مرکزی سیال */}
        <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#007acc]/30 to-transparent">
          {/* ذره نورانی متحرک شبیه قطره باران */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-[#007acc] to-[#00aaff] blur-[0.5px]"
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent via-[#007acc] to-[#00aaff] blur-[0.5px]"
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.8 }}
          />
        </div>

        <div className="flex flex-col gap-5 relative z-10 w-full">
          {activities.map((activity, index) => {
            const isRight = index % 2 === 0;

            return (
              <motion.div
                key={activity.title}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 100, damping: 15 }
                  }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className={`flex items-center w-full ${isRight ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Content Side */}
                <div className={`w-1/2 px-3 flex flex-col justify-center ${isRight ? "items-start text-right" : "items-end text-left"}`}>
                  <div
                    className={`inline-block mb-3 py-1.5 px-4 rounded-full shadow-md border ${
                      activity.color === "mgray"
                        ? "bg-white text-slate-700 border-slate-100"
                        : "bg-gradient-to-br from-[#007acc] to-[#005c99] text-white border-transparent"
                    }`}
                  >
                    <span className="text-[11px] font-bold tracking-wide leading-none">{activity.title}</span>
                  </div>
                  
                  <div
                    className={`p-3 rounded-2xl shadow-sm border backdrop-blur-sm relative ${
                      activity.color === "mgray"
                        ? "bg-white/90 border-slate-200"
                        : "bg-blue-50/90 border-blue-100"
                    }`}
                  >
                    <p className={`text-[10px] sm:text-[11px] font-medium leading-relaxed ${activity.color === "mgray" ? "text-slate-600" : "text-[#005c99]"}`}>
                      {activity.description}
                    </p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-[60px] h-[60px] bg-white rounded-[1.2rem] flex items-center justify-center shadow-[0_8px_20px_-5px_rgba(0,122,204,0.2)] border border-white relative z-20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 opacity-80" />
                    <div className="absolute inset-[3px] bg-white rounded-xl shadow-inner flex items-center justify-center">
                       <OptimizedImage
                         src={activity.icon}
                         alt={activity.title}
                         width={26}
                         height={26}
                         className="drop-shadow-sm relative z-10"
                       />
                    </div>
                  </motion.div>
                </div>

                {/* Empty side for balance */}
                <div className="w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AreasOfActivitySection;
