"use client";

import { motion, MotionValue, useMotionValue } from "framer-motion";
import { icon } from "./settings";
import { useIconTransform } from "./use-icon-transform";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface ItemProps {
  row: number;
  col: number;
  planeX: MotionValue<number>;
  planeY: MotionValue<number>;
  images?: string[];
}

const defaultImages = ["/images/1.png", "/images/2.png", "/images/hero_img.jpg", "/images/blog_img.jpg"];

export function Item({ row, col, planeX, planeY, images }: ItemProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  // محاسبه موقعیت در شبکه (Grid)
  const xOffset = col * (icon.size + icon.margin) + (row % 2) * ((icon.size + icon.margin) / 2);
  const yOffset = row * icon.size;

  // اعمال فیزیک حرکت
  useIconTransform({ x, y, scale, planeX, planeY, xOffset, yOffset });

  const imagesList = images && images.length >= 4 ? images : defaultImages;
  const imageIndex = (row * 4 + col) % imagesList.length;

  // BRANDING: استفاده از رنگ اصلی برند به جای رنگ‌های تصادفی
  const primaryColor = "#007acc";

  return (
    <motion.div
      className="absolute flex items-center justify-center cursor-pointer"
      style={{
        left: xOffset,
        top: yOffset,
        x,
        y,
        scale,
        width: icon.size,
        height: icon.size,
      }}
    >
      {/* 
        M3 SURFACE CONTAINER 
        - Elevation: استفاده از سایه برای عمق
        - Shape: دایره کامل (Rounded Full)
        - Border: استفاده از رنگ برند برای تاکید
      */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
        style={{
          border: `3px solid ${primaryColor}`, // حاشیه با رنگ برند
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // Elevation Level 2
        }}
      >
        {/* تصویر بهینه شده */}
        <OptimizedImage
          src={imagesList[imageIndex]}
          width={icon.size} // استفاده از سایز واقعی آیکون برای کیفیت بهتر
          height={icon.size}
          priority="down"
          alt={`icon-${row}-${col}`}
          className="w-full h-full object-cover"
        />

        {/* 
          M3 STATE LAYER 
          - لایه تعاملی که روی تصویر قرار می‌گیرد
          - در حالت هاور رنگ برند با شفافیت کم نمایش داده می‌شود
        */}
        <div
          className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-[0.12]"
          style={{ backgroundColor: primaryColor }}
        />
      </div>
    </motion.div>
  );
}
