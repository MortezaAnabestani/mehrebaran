"use client";

import { useEffect } from "react";
import { MotionValue } from "framer-motion";

interface UseIconTransformParams {
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  planeX?: MotionValue<number>;
  planeY?: MotionValue<number>;
  xOffset?: number;
  yOffset?: number;
}

export function useIconTransform({ x, y, scale }: UseIconTransformParams) {
  // Removed shrinking logic so icons never disappear
  useEffect(() => {
    scale.set(1);
    x.set(0);
    y.set(0);
  }, [scale, x, y]);
}
