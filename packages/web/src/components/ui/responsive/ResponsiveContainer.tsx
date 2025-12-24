"use client";

import React from "react";

/**
 * Responsive Container Component
 * کانتینر ریسپانسیو با padding و spacing های استاندارد
 */

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  /** حداکثر عرض کانتینر */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Padding افقی */
  paddingX?: boolean;
  /** Padding عمودی */
  paddingY?: boolean;
  /** مرکز کردن */
  center?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = "",
  maxWidth = "xl",
  paddingX = true,
  paddingY = false,
  center = true,
}) => {
  const maxWidthClass = maxWidthClasses[maxWidth];
  const paddingXClass = paddingX ? "px-3 sm:px-4 md:px-6 lg:px-8" : "";
  const paddingYClass = paddingY ? "py-4 sm:py-6 md:py-8 lg:py-12" : "";
  const centerClass = center ? "mx-auto" : "";

  return (
    <div className={`${maxWidthClass} ${centerClass} ${paddingXClass} ${paddingYClass} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;

/**
 * Responsive Section Component
 */
export const ResponsiveSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  background?: "default" | "light" | "dark";
}> = ({ children, className = "", background = "default" }) => {
  const bgClasses = {
    default: "bg-[#eef2f6]",
    light: "bg-white",
    dark: "bg-gray-800 text-white",
  };

  return (
    <section className={`${bgClasses[background]} ${className}`}>
      <ResponsiveContainer paddingY>{children}</ResponsiveContainer>
    </section>
  );
};

/**
 * Responsive Page Wrapper
 */
export const ResponsivePageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-[#eef2f6] pb-20 lg:pb-8 ${className}`}>
      {children}
    </div>
  );
};
