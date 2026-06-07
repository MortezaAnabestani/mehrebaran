"use client";

import OptimizedImage from "@/components/ui/OptimizedImage";
import { AreasOfActivity } from "@/types/types";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";

const AreaItem: React.FC<AreasOfActivity> = ({ title, icon, description, color, position }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- تنظیمات فیزیک حرکت (Magnetic Effect) ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // استفاده از میرایی (Damping) بیشتر برای حس سیال بودن (Fluidity)
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  // حرکت درخشش روی کارت بر اساس موقعیت موس
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // رنگ برند اصلی
  const brandColor = "#007acc";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // منحنی حرکت نرم
      className={`group relative flex flex-col items-center w-40 md:w-48 my-8 perspective-1000 ${
        position === "bottom" ? "md:mt-32" : "md:-mt-16"
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{ perspective: 1000 }}
    >
      {/* --- بخش عنوان (Title Pill) --- */}
      <motion.div
        className="relative z-20 py-3 px-6 min-w-[140px] text-center rounded-full shadow-lg backdrop-blur-md border border-white/20 overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: `linear-gradient(135deg, ${brandColor} 0%, #005c99 100%)`,
        }}
        whileHover={{ scale: 1.05, y: -5 }}
      >
        {/* افکت درخشش شیشه‌ای */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 z-10"
          style={{ x: glareX, y: glareY, opacity: 0.4 }}
        />
        <span className="relative z-20 text-white font-bold text-sm tracking-wide drop-shadow-md">
          {title}
        </span>
      </motion.div>

      {/* --- خط اتصال بالا (Fluid Connector) --- */}
      <div className="relative h-14 w-0.5 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-[#007acc] to-transparent opacity-50"
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        {/* ذره نورانی متحرک */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-cyan-300 rounded-full blur-[2px]"
          animate={{ top: ["-20%", "120%"], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* --- آیکون مرکزی (Organic Core) --- */}
      <motion.div
        className="relative z-10 w-32 h-32 flex items-center justify-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* پس‌زمینه سیال و درخشان */}
        <motion.div
          className="absolute inset-0 rounded-[2.5rem] bg-white shadow-[0_10px_40px_-10px_rgba(0,122,204,0.3)]"
          animate={{
            borderRadius: isHovered ? ["2.5rem", "2rem", "2.5rem"] : ["2.5rem", "2.5rem"],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* حلقه رنگی دور آیکون */}
        <motion.div
          className="absolute inset-0 rounded-[2.5rem] border-2 border-[#007acc]/10"
          animate={{ scale: isHovered ? 1.1 : 1, opacity: isHovered ? 1 : 0 }}
        />

        {/* کانتینر آیکون */}
        <motion.div
          className="relative z-20 w-28 h-28 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-[2rem] flex items-center justify-center border border-white/60 shadow-inner overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* نور پس‌زمینه داخل آیکون */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#007acc]/5 to-transparent" />

          <motion.div
            animate={{
              y: isHovered ? [0, -4, 0] : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <OptimizedImage
              src={icon}
              alt={title}
              width={64}
              height={64}
              className="drop-shadow-lg"
            />
          </motion.div>
        </motion.div>

        {/* امواج (Ripples) هنگام هاور */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-[2.5rem] border border-[#007acc]/30"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- خط اتصال پایین --- */}
      <div className="relative h-14 w-0.5 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-[#007acc] opacity-50"
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-cyan-300 rounded-full blur-[2px]"
          animate={{ top: ["-20%", "120%"], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* --- توضیحات (Description Card) --- */}
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className={`relative p-4 rounded-2xl text-center backdrop-blur-sm border border-white/40 shadow-xl transition-colors duration-300 ${
            color === "mgray"
              ? "bg-white/80 text-slate-600"
              : "bg-gradient-to-br from-[#007acc]/90 to-[#005c99]/90 text-white"
          }`}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 40px -10px rgba(0, 122, 204, 0.25)",
          }}
        >
          <p className="text-xs font-medium leading-relaxed opacity-90">{description}</p>

          {/* افکت بازتاب نور */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl pointer-events-none" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AreaItem;
