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
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-16">
      {/* افکت پس‌زمینه ساده */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 pointer-events-none" />

      {/* عنوان */}
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

              {/* خط اتصال با جریان نور */}
              <div className="hidden md:block">
                {next && <Line isCurrentTop={isCurrentTop} isNextBottom={isNextBottom} />}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default AreasOfActivitySection;
