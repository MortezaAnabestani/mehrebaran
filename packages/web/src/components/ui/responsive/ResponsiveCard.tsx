"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Responsive Card Component
 * یک کارت چندمنظوره با استایل Skeuomorphic که در تمام سایزهای صفحه به درستی نمایش داده می‌شود
 */

type CardSize = "sm" | "md" | "lg";
type CardVariant = "neumorphic" | "flat" | "elevated";

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  size?: CardSize;
  variant?: CardVariant;
  clickable?: boolean;
  onClick?: () => void;
  hover?: boolean;
  padding?: boolean;
}

const sizeClasses: Record<CardSize, string> = {
  sm: "p-3 md:p-4 rounded-xl md:rounded-2xl",
  md: "p-4 md:p-6 rounded-2xl md:rounded-3xl",
  lg: "p-6 md:p-8 rounded-2xl md:rounded-3xl",
};

const variantClasses: Record<CardVariant, string> = {
  neumorphic:
    "bg-[#eef2f6] shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] border border-white/40",
  flat: "bg-white border border-gray-100",
  elevated: "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-50",
};

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  className = "",
  size = "md",
  variant = "elevated",
  clickable = false,
  onClick,
  hover = true,
  padding = true,
}) => {
  const baseClasses = "transition-all duration-300";
  const paddingClasses = padding ? sizeClasses[size] : "rounded-2xl md:rounded-3xl";
  const variantClass = variantClasses[variant];

  const hoverClasses = hover
    ? "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1"
    : "";

  const clickableClasses = clickable ? "cursor-pointer active:scale-[0.98]" : "";

  const Component = clickable ? motion.button : motion.div;

  return (
    <Component
      onClick={onClick}
      className={`${baseClasses} ${paddingClasses} ${variantClass} ${hoverClasses} ${clickableClasses} ${className}`}
      whileTap={clickable ? { scale: 0.98 } : undefined}
    >
      {children}
    </Component>
  );
};

export default ResponsiveCard;

/**
 * Preset Cards for specific use cases
 */

export const NeedCardContainer: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = "" }) => {
  return (
    <ResponsiveCard
      size="md"
      variant="elevated"
      clickable={!!onClick}
      onClick={onClick}
      className={className}
    >
      {children}
    </ResponsiveCard>
  );
};

export const TeamCardContainer: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = "" }) => {
  return (
    <ResponsiveCard
      size="sm"
      variant="neumorphic"
      clickable={!!onClick}
      onClick={onClick}
      className={className}
    >
      {children}
    </ResponsiveCard>
  );
};

export const StatsCardContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <ResponsiveCard size="sm" variant="flat" hover={false} className={className}>
      {children}
    </ResponsiveCard>
  );
};
