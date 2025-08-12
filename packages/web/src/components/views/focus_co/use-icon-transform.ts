"use client";

import { useEffect, useRef } from "react";
import { MotionValue, transform } from "framer-motion";
import { device, icon } from "./settings";

interface UseIconTransformParams {
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  planeX: MotionValue<number>;
  planeY: MotionValue<number>;
  xOffset: number;
  yOffset: number;
}

export function useIconTransform({ x, y, scale, planeX, planeY, xOffset, yOffset }: UseIconTransformParams) {
  const xScale = useRef(1);
  const yScale = useRef(1);

  useEffect(() => {
    const transformX = (v: number) => {
      const screenOffset = v + xOffset + 20;
      xScale.current = mapScreenXToScale(screenOffset);
      const newScale = Math.min(xScale.current, yScale.current);
      scale.set(newScale);
      x.set(mapScreenToXOffset(screenOffset));
    };

    const unsubscribe = planeX.onChange(transformX);
    return () => unsubscribe();
  }, [planeX, scale, x, xOffset]);

  useEffect(() => {
    if (!planeY || typeof planeY.onChange !== "function") return;

    const transformY = (v: number) => {
      const screenOffset = v + yOffset + 20;
      yScale.current = mapScreenYToScale(screenOffset);
      const newScale = Math.min(xScale.current, yScale.current);
      scale.set(newScale);
      y.set(mapScreenToYOffset(screenOffset));
    };

    const unsubscribe = planeY.onChange(transformY);
    return () => unsubscribe();
  }, [planeY, scale, y, yOffset]);
}

const createScreenRange = (axis: "width" | "height") => [
  -60,
  80,
  device[axis] - (icon.size + icon.margin) / 2 - 80,
  device[axis] - (icon.size + icon.margin) / 2 + 60,
];

const scaleRange = [0, 1, 1, 0];
const xRange = createScreenRange("width");
const yRange = createScreenRange("height");

const mapScreenToXOffset = transform(xRange, [50, 0, 0, -50]);
const mapScreenToYOffset = transform(yRange, [50, 0, 0, -50]);
const mapScreenXToScale = transform(xRange, scaleRange);
const mapScreenYToScale = transform(yRange, scaleRange);
