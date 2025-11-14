"use client";

import { motion, MotionValue, useMotionValue } from "framer-motion";
import { icon } from "./settings";
import { useIconTransform } from "./use-icon-transform";

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

  const xOffset = col * (icon.size + icon.margin) + (row % 2) * ((icon.size + icon.margin) / 2);
  const yOffset = row * icon.size;

  useIconTransform({ x, y, scale, planeX, planeY, xOffset, yOffset });

  // استفاده از تصاویر prop یا تصاویر پیش‌فرض
  const imagesList = images && images.length >= 4 ? images : defaultImages;

  // محاسبه ایندکس تصویر برای این آیکون
  const imageIndex = (row * 4 + col) % imagesList.length;

  // تولید رنگ حاشیه تصادفی بر اساس index
  const hue = (imageIndex * 50) % 360;
  const borderColor = `hsl(${hue}, 90%, 60%)`;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: xOffset,
        top: yOffset,
        x,
        y,
        scale,
        width: icon.size,
        height: icon.size,
        borderRadius: "50%",
        border: `4px solid ${borderColor}`, // حاشیه رنگی
        overflow: "hidden", // برای برش تصویر در دایره
        backgroundColor: "transparent", // حذف رنگ پس‌زمینه
        boxSizing: "border-box",
      }}
    >
      <img
        src={imagesList[imageIndex]}
        alt={`icon-${row}-${col}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          userSelect: "none",
          borderRadius: "50%",
        }}
        draggable={false}
      />
    </motion.div>
  );
}
