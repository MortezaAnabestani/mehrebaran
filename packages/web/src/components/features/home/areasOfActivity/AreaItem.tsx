"use client";

import OptimizedImage from "@/components/ui/OptimizedImage";
import { AreasOfActivity } from "@/types/types";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef, useState } from "react";

const AreaItem: React.FC<AreasOfActivity> = ({ title, icon, description, color, position }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Magnetic effect - برای افکت 3D
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // برای افکت 3D
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

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

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`group relative flex flex-col w-40 my-10 ${
        position === "bottom" ? "md:mt-30" : "md:-mt-20"
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
    >
      {/* عنوان */}
      <motion.div
        className="relative py-2 px-4 w-full h-12 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-center font-bold rounded-xl overflow-hidden cursor-pointer shadow-lg"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* افکت shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: isHovered ? ["0%", "200%"] : "0%",
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
        />
        <span className="relative z-10 flex items-center justify-center h-full">{title}</span>
      </motion.div>

      {/* خط اتصال بالایی */}
      <div className="relative h-12 w-full overflow-hidden">
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 to-transparent"
          initial={{ scaleY: 0, originY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* نقطه نورانی در حال حرکت */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            animate={{
              y: ["0%", "100%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>

      {/* آیکون مرکزی */}
      <motion.div
        className="relative cursor-pointer rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100 border-4 border-blue-500 w-28 h-28 mx-auto flex items-center justify-center overflow-hidden group/icon z-10 shadow-xl"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          scale: 1.1,
          borderColor: "#60a5fa",
          boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* گلوی پس‌زمینه */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-2xl"
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2,
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        {/* آیکون */}
        <motion.div
          animate={{
            scale: isHovered ? [1, 1.1, 1] : 1,
            rotate: isHovered ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 0.6,
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 1,
          }}
        >
          <OptimizedImage src={icon} alt={`icon ${title}`} width={60} height={60} />
        </motion.div>

        {/* حلقه‌های موجی */}
        {isHovered && (
          <>
            {[0, 0.3, 0.6].map((delay, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-2 border-blue-400 rounded-2xl"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* خط اتصال پایینی */}
      <div className="relative h-12 w-full overflow-hidden">
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-transparent to-blue-500"
          initial={{ scaleY: 0, originY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* نقطه نورانی در حال حرکت */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            animate={{
              y: ["0%", "100%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 0.5,
            }}
          />
        </motion.div>
      </div>

      {/* توضیحات */}
      <motion.div
        className="relative w-full text-center overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.div
          className={`relative mt-2 h-24 flex items-center justify-center rounded-xl p-3 ${
            color === "mgray"
              ? "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
              : "bg-gradient-to-br from-sky-500 to-sky-600 text-white"
          } shadow-lg cursor-pointer`}
          whileHover={{
            scale: 1.03,
            y: -2,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          <span className="text-sm font-medium leading-relaxed">{description}</span>

          {/* افکت shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
            animate={{
              x: isHovered ? ["0%", "200%"] : "0%",
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>

      {/* هاله نورانی در حالت hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-2xl blur-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0.9, 1.1, 1.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
          }}
        />
      )}
    </motion.div>
  );
};

export default AreaItem;
