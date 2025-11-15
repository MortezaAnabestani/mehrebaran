"use client";

import { IWhatWeDidStatistics } from "common-types";
import React, { useRef } from "react";
import HeadTitle from "./HeadTitle";
import { motion, useInView } from "framer-motion";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface WhatWeDidType {
  title: string;
  href: string;
  numOfProject: number;
  color: string;
  icon: string;
  textColor: string;
}

const WhatWeDidSection: React.FC<{ statistics: IWhatWeDidStatistics | null }> = ({ statistics }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // استفاده از آمارهای واقعی یا مقادیر پیش‌فرض
  const stats = statistics || {
    totalProjects: 0,
    schoolsCovered: 0,
    budgetRaised: 0,
    partnerOrganizations: 0,
    volunteerHours: 0,
    activeVolunteers: 0,
  };

  const Items: WhatWeDidType[] = [
    {
      title: "تعداد پروژه‌ها",
      href: "/projects",
      numOfProject: stats.totalProjects,
      color: "mblue",
      icon: "/icons/chart.svg",
      textColor: "white",
    },
    {
      title: "مناطق و مدارس تحت پوشش طرح‌ها",
      href: "/projects",
      numOfProject: stats.schoolsCovered,
      color: "mgray",
      icon: "/icons/bookHome.svg",
      textColor: "black",
    },
    {
      title: "میزان بودجه جذب‌شده",
      href: "/projects",
      numOfProject: stats.budgetRaised,
      color: "mblue",
      icon: "/icons/assets.svg",
      textColor: "white",
    },
    {
      title: "مجموعه‌های همکار",
      href: "/projects",
      numOfProject: stats.partnerOrganizations,
      color: "mgray",
      icon: "/icons/puzzle.svg",
      textColor: "black",
    },
    {
      title: "مجموع ساعات داوطلبی",
      href: "/projects",
      numOfProject: stats.volunteerHours,
      color: "mblue",
      icon: "/icons/support.svg",
      textColor: "white",
    },
    {
      title: "تعداد داوطلبان فعال",
      href: "/projects",
      numOfProject: stats.activeVolunteers,
      color: "mgray",
      icon: "/icons/time.svg",
      textColor: "black",
    },
  ];

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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section ref={sectionRef} className="mb-20 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <HeadTitle title="در کنار هم چه کردیم؟" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="w-9/10 md:w-8/10 mx-auto grid grid-cols-2 md:grid-cols-3 gap-6"
      >
        {Items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <div
              className={`relative overflow-hidden rounded-2xl ${
                item.color === "mblue" ? "bg-mblue" : "bg-mgray"
              } ${
                item.textColor === "white" ? "text-white" : "text-gray-800"
              } p-6 md:p-8 aspect-square flex flex-col justify-center items-center shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer`}
            >
              {/* افکت پس‌زمینه */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* آیکون پس‌زمینه */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-20 transition-opacity duration-300">
                <OptimizedImage src={item.icon} alt={item.title} width={150} height={150} />
              </div>

              {/* محتوا */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                {/* عدد */}
                <motion.h2
                  className="text-3xl md:text-5xl font-extrabold"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {item.numOfProject.toLocaleString("fa-IR")}
                </motion.h2>

                {/* عنوان */}
                <h3 className="text-sm md:text-base text-center font-bold leading-relaxed">{item.title}</h3>
              </div>

              {/* افکت shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WhatWeDidSection;
