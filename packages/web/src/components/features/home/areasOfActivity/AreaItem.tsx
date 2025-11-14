"use client";

import OptimizedImage from "@/components/ui/OptimizedImage";
import { AreasOfActivity } from "@/types/types";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef, useState } from "react";

const AreaItem: React.FC<AreasOfActivity> = ({ title, icon, description, color, position }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Magnetic effect - برای جذب ماوس
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // برای افکت 3D
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

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
        className="relative py-1.5 px-3 w-full h-10 border-2 border-mblue text-center font-bold rounded-lg overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* گلوی پس‌زمینه */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-mblue/20 via-mblue/40 to-mblue/20 blur-xl"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.2 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* بک‌گراند */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-mblue/10 to-mblue/30"
          animate={{
            backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
          }}
          transition={{ duration: 0.5 }}
        />

        <span className="relative z-10">{title}</span>

        {/* ریپل افکت */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-mblue/30 rounded-lg"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </motion.div>

      {/* خط اتصال بالایی */}
      <div className="relative h-10 w-full overflow-hidden">
        <motion.span
          className="block h-10 w-1/2 border-l-2 border-mblue relative"
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* پارتیکل در حال حرکت */}
          <motion.div
            className="absolute left-0 w-2 h-2 bg-mblue rounded-full"
            animate={{
              top: ["0%", "100%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              boxShadow: "0 0 10px #3b82f6",
            }}
          />
        </motion.span>
      </div>

      {/* آیکون مرکزی */}
      <motion.div
        className="relative cursor-pointer rounded-3xl bg-gradient-to-br from-blue-50 to-blue-200 border-2 border-b-4 border-r-4 border-mblue w-25 h-25 mx-auto rotate-45 flex items-center justify-center overflow-hidden group/icon z-10"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        whileHover={{
          rotate: 0,
          scale: 1.2,
          boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* گلوی پس‌زمینه */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-mblue/30 to-blue-400/30 blur-xl"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: isHovered ? [0.5, 1, 0.5] : 0.3,
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        {/* شعاع‌های نور */}
        {isHovered && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-1 h-full bg-gradient-to-t from-transparent via-blue-400/30 to-transparent"
                style={{
                  transform: `rotate(${i * 45}deg) translateX(-50%)`,
                  transformOrigin: "center",
                }}
              />
            ))}
          </motion.div>
        )}

        {/* آیکون */}
        <motion.div
          className="-rotate-45"
          animate={{
            scale: isHovered ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: isHovered ? Infinity : 0,
          }}
        >
          <OptimizedImage src={icon} alt={`icon ${title}`} width={50} height={50} />
        </motion.div>

        {/* پارتیکل‌های شناور */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.cos((i * Math.PI) / 3) * 60,
                  y: Math.sin((i * Math.PI) / 3) * 60,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* خط اتصال پایینی */}
      <div className="relative h-10 w-full overflow-hidden">
        <motion.span
          className="block h-10 w-1/2 border-l-2 border-mblue relative"
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* پارتیکل در حال حرکت */}
          <motion.div
            className="absolute left-0 w-2 h-2 bg-mblue rounded-full"
            animate={{
              top: ["0%", "100%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 0.5,
            }}
            style={{
              boxShadow: "0 0 10px #3b82f6",
            }}
          />
        </motion.span>
      </div>

      {/* توضیحات */}
      <motion.div
        className="relative border-t-2 border-mblue w-full text-center font-bold overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.div
          className="relative mt-2"
          animate={{
            y: isHovered ? -5 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* گلوی پس‌زمینه */}
          <motion.div
            className="absolute -inset-2 rounded-lg blur-lg"
            style={{
              background: color === "mgray" ? "#e5e7eb" : "#3b82f6",
              opacity: 0.3,
            }}
            animate={{
              scale: isHovered ? 1.1 : 0.95,
              opacity: isHovered ? 0.5 : 0.2,
            }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className={`relative h-25 flex items-center rounded-lg p-2 ${
              color === "mgray" ? "bg-mgray" : "bg-mblue text-white"
            } shadow-lg cursor-pointer`}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {description}

            {/* افکت shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: isHovered ? "200%" : "-100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* هاله دوری */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.8, 1.2, 1.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          }}
        />
      )}
    </motion.div>
  );
};

export default AreaItem;
