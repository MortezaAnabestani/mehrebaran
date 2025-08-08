"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "mblue" | "mgray" | "morange";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asLink?: boolean;
  href?: string;
  className?: string;
}

const SmartButton: React.FC<ButtonProps> = ({
  children,
  variant = "mblue",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  asLink = false,
  href = "#",
  className = "",
  disabled,
  ...rest
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-xs font-semibold transition-all";

  const variantStyles: Record<string, string> = {
    mblue: "bg-mblue text-white hover:bg-mblue/80",
    mgray: "bg-mgray text-black hover:bg-mgray/80",
    morange: "bg-morange text-white hover:bg-morange/80",
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";
  const widthStyle = fullWidth ? "w-full" : "w-auto";

  const combinedClassName = clsx(
    baseStyle,
    variantStyles[variant],
    sizeStyles[size],
    widthStyle,
    disabledStyle,
    className
  );

  if (asLink && href) {
    return (
      <Link href={href} className={combinedClassName}>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} disabled={disabled} {...rest}>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default SmartButton;
