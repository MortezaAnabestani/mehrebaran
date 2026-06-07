"use client";
import * as React from "react";
import { motion, useMotionValue } from "framer-motion";
import { Item } from "./Item";

// تعداد ردیف‌ها و ستون‌ها برای پوشش کل صفحه با تعداد بهینه
const rowsCount = 10;
const colsCount = 10;

// ساخت آرایه grid جدید
const grid = new Array(rowsCount).fill(0).map(() => new Array(colsCount).fill(0).map((_, j) => j));

interface AppleWatchDockProps {
  images?: string[];
}

export function AppleWatchDock({ images }: AppleWatchDockProps) {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);

  return (
    <div className="absolute inset-0 pointer-events-auto w-full h-full">
      <motion.div
        drag
        dragConstraints={{ left: -1000, right: 0, top: -1000, bottom: 0 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 2000,
          height: 2000,
          x,
          y,
          background: "transparent",
        }}
      >
        {grid.map((cols, rowIndex) =>
          cols.map((colIndex) => (
            <Item
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              planeX={x}
              planeY={y}
              images={images}
            />
          ))
        )}
      </motion.div>
    </div>
  );
}
