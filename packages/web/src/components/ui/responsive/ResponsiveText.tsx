"use client";

import React from "react";

/**
 * Responsive Typography Components
 * کامپوننت‌های متن با اندازه‌های ریسپانسیو
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type InlineTag = "p" | "span";
type AnyTag = HeadingTag | InlineTag;

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

// ─── ResponsiveHeading ────────────────────────────────────────────────────────

// FIX 1: `as` type narrowed — only meaningful overrides for a heading.
//         `as` defaults to the semantic heading tag derived from `level`.
interface HeadingProps extends BaseProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  as?: AnyTag;
}

const HEADING_SIZE: Record<HeadingProps["level"], string> = {
  1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black",
  2: "text-xl  sm:text-2xl md:text-3xl lg:text-4xl font-bold",
  3: "text-lg  sm:text-xl  md:text-2xl lg:text-3xl font-bold",
  4: "text-base sm:text-lg md:text-xl  lg:text-2xl font-semibold",
  5: "text-sm  sm:text-base md:text-lg              font-semibold",
  6: "text-xs  sm:text-sm   md:text-base            font-semibold",
};

export const ResponsiveHeading: React.FC<HeadingProps> = ({ children, className = "", level, as }) => {
  const tag = as ?? `h${level}`;

  // React.createElement bypasses JSX's static children-type inference,
  // which collapses to `never` when the tag is a runtime-unknown ElementType.
  return React.createElement(tag, { className: `${HEADING_SIZE[level]} ${className}` }, children);
};

// ─── ResponsiveBody ───────────────────────────────────────────────────────────

// FIX 4: `as` restricted to block/inline text tags only — h1–h6 makes no sense here.
interface BodyProps extends BaseProps {
  size?: "sm" | "md" | "lg";
  as?: InlineTag;
}

const BODY_SIZE: Record<NonNullable<BodyProps["size"]>, string> = {
  sm: "text-xs  sm:text-sm   md:text-base",
  md: "text-sm  sm:text-base md:text-lg",
  lg: "text-base sm:text-lg  md:text-xl",
};

export const ResponsiveBody: React.FC<BodyProps> = ({ children, className = "", size = "md", as = "p" }) => {
  return React.createElement(as, { className: `${BODY_SIZE[size]} ${className}` }, children);
};

// ─── ResponsiveLabel ─────────────────────────────────────────────────────────

interface LabelProps extends BaseProps {
  as?: InlineTag; // FIX 4: same narrowing — labels are never headings
}

export const ResponsiveLabel: React.FC<LabelProps> = ({ children, className = "", as = "span" }) => {
  return React.createElement(
    as,
    { className: `text-[10px] sm:text-xs md:text-sm font-medium ${className}` },
    children,
  );
};

// ─── ResponsiveCaption ────────────────────────────────────────────────────────

interface CaptionProps extends BaseProps {
  as?: InlineTag; // FIX 4: same narrowing
}

export const ResponsiveCaption: React.FC<CaptionProps> = ({ children, className = "", as = "span" }) => {
  return React.createElement(
    as,
    { className: `text-[9px] sm:text-[10px] md:text-xs ${className}` },
    children,
  );
};
