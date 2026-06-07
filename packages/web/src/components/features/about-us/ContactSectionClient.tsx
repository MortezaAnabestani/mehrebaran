"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FADE_IN_VARIANTS } from "./AboutUs_Constants";

export const MaterialCard = ({
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
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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

export const FadeInWrapper = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={FADE_IN_VARIANTS}
      >
        {children}
      </motion.div>
    </div>
  );
};
