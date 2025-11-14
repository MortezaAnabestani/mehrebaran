"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AreaItem from "./AreaItem";
import HeadTitle from "../HeadTitle";
import { AreasOfActivity } from "@/types/types";
import Line from "./Line";

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

  // Variants برای stagger animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* افکت پس‌زمینه متحرک */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        initial={{ backgroundPosition: "0% 0%" }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 148, 52, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* پارتیکل‌های شناور پس‌زمینه */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-mblue/20 rounded-full"
            style={{
              left: `${(i * 10) % 100}%`,
              top: `${(i * 17) % 100}%`,
              willChange: "transform, opacity",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* عنوان با انیمیشن */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <HeadTitle
          title="حوزه‌های فعالیت"
          subTitle="فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد دانشگاهی خراسان رضوی جهت فرهنگ‌سازی جامعه"
        />
      </motion.div>

      {/* کانتینر آیتم‌ها */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative mb-10 flex flex-row-reverse items-center justify-between flex-wrap w-9/10 mx-auto md:w-full"
      >
        {activities.map((activity, index) => {
          const next = activities[index + 1];
          const isCurrentTop = activity.position === "top";
          const isNextBottom = next?.position === "bottom";

          return (
            <motion.div key={index} variants={itemVariants} className="relative " whileHover={{ zIndex: 10 }}>
              <AreaItem
                title={activity.title}
                icon={activity.icon}
                description={activity.description}
                color={activity.color}
                position={activity.position}
              />

              {/* خط اتصال */}
              <div className="hidden md:block">
                {next && <Line isCurrentTop={isCurrentTop} isNextBottom={isNextBottom} />}
              </div>

              {/* نور درخشان در نقطه اتصال */}
              {next && (
                <motion.div
                  className="hidden md:block absolute bottom-0 left-1/2 w-4 h-4 bg-gradient-to-r from-mblue to-orange-400 rounded-full blur-sm"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default AreasOfActivitySection;
