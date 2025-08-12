"use client";
import * as React from "react";
import { motion, useMotionValue } from "framer-motion";
import { Item } from "./Item";
import { device } from "./settings";

// نصف تعداد ردیف‌ها و ستون‌ها
const rowsCount = 5;
const colsCount = 4;

// ساخت آرایه grid جدید
const grid = new Array(rowsCount).fill(0).map((_, i) => new Array(colsCount).fill(0).map((_, j) => j));

export function AppleWatchDock() {
  const x = useMotionValue(-225);
  const y = useMotionValue(-225);

  return (
    <div className="device" style={device}>
      <motion.div
        drag
        dragConstraints={{ left: -650, right: 50, top: -600, bottom: 50 }}
        style={{
          width: 800,
          height: 600,
          x,
          y,
          background: "transparent",
        }}
      >
        {grid.map((cols, rowIndex) =>
          cols.map((colIndex) => (
            <Item key={`${rowIndex}-${colIndex}`} row={rowIndex} col={colIndex} planeX={x} planeY={y} />
          ))
        )}
      </motion.div>
    </div>
  );
}
