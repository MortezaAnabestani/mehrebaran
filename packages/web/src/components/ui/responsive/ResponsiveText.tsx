"use client";

import React from "react";

/**
 * Responsive Typography Components
 * کامپوننت‌های متن با اندازه‌های ریسپانسیو
 */

interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export const ResponsiveHeading: React.FC<
  ResponsiveTextProps & {
    level: 1 | 2 | 3 | 4 | 5 | 6;
  }
> = ({ children, className = "", level, as }) => {
  const Tag = as || (`h${level}` as keyof JSX.IntrinsicElements);

  const sizeClasses = {
    1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black",
    2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold",
    3: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold",
    4: "text-base sm:text-lg md:text-xl lg:text-2xl font-semibold",
    5: "text-sm sm:text-base md:text-lg font-semibold",
    6: "text-xs sm:text-sm md:text-base font-semibold",
  };

  return <Tag className={`${sizeClasses[level]} ${className}`}>{children}</Tag>;
};

export const ResponsiveBody: React.FC<ResponsiveTextProps & { size?: "sm" | "md" | "lg" }> = ({
  children,
  className = "",
  size = "md",
  as = "p",
}) => {
  const Tag = as;

  const sizeClasses = {
    sm: "text-xs sm:text-sm md:text-base",
    md: "text-sm sm:text-base md:text-lg",
    lg: "text-base sm:text-lg md:text-xl",
  };

  return <Tag className={`${sizeClasses[size]} ${className}`}>{children}</Tag>;
};

export const ResponsiveLabel: React.FC<ResponsiveTextProps> = ({
  children,
  className = "",
  as = "span",
}) => {
  const Tag = as;
  return <Tag className={`text-[10px] sm:text-xs md:text-sm font-medium ${className}`}>{children}</Tag>;
};

export const ResponsiveCaption: React.FC<ResponsiveTextProps> = ({
  children,
  className = "",
  as = "span",
}) => {
  const Tag = as;
  return <Tag className={`text-[9px] sm:text-[10px] md:text-xs ${className}`}>{children}</Tag>;
};
