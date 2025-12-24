"use client";

import React from "react";

/**
 * Responsive Grid Component
 * سیستم Grid ریسپانسیو با الگوهای رایج
 */

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  /** تعداد ستون‌ها در موبایل */
  cols?: GridColumns;
  /** تعداد ستون‌ها در تبلت (sm breakpoint) */
  smCols?: GridColumns;
  /** تعداد ستون‌ها در تبلت افقی (md breakpoint) */
  mdCols?: GridColumns;
  /** تعداد ستون‌ها در دسکتاپ (lg breakpoint) */
  lgCols?: GridColumns;
  /** تعداد ستون‌ها در دسکتاپ بزرگ (xl breakpoint) */
  xlCols?: GridColumns;
  /** فاصله بین آیتم‌ها */
  gap?: "sm" | "md" | "lg";
}

const gapClasses = {
  sm: "gap-2 md:gap-3",
  md: "gap-3 md:gap-4 lg:gap-6",
  lg: "gap-4 md:gap-6 lg:gap-8",
};

const colsClasses: Record<GridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = "",
  cols = 1,
  smCols,
  mdCols,
  lgCols,
  xlCols,
  gap = "md",
}) => {
  const baseClass = colsClasses[cols];
  const smClass = smCols ? `sm:${colsClasses[smCols]}` : "";
  const mdClass = mdCols ? `md:${colsClasses[mdCols]}` : "";
  const lgClass = lgCols ? `lg:${colsClasses[lgCols]}` : "";
  const xlClass = xlCols ? `xl:${colsClasses[xlCols]}` : "";
  const gapClass = gapClasses[gap];

  return (
    <div className={`grid ${baseClass} ${smClass} ${mdClass} ${lgClass} ${xlClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;

/**
 * Preset Grid Layouts
 */

// Grid برای کارت‌های نیاز (1 col mobile, 2 tablet, 3 desktop)
export const NeedsGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <ResponsiveGrid cols={1} mdCols={2} lgCols={3} gap="md" className={className}>
      {children}
    </ResponsiveGrid>
  );
};

// Grid برای تیم‌ها (1 col mobile, 2 tablet, 4 desktop)
export const TeamsGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <ResponsiveGrid cols={1} smCols={2} lgCols={4} gap="sm" className={className}>
      {children}
    </ResponsiveGrid>
  );
};

// Grid برای Stories (Auto-fit با حداقل و حداکثر عرض)
export const StoriesGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 ${className}`}>
      {children}
    </div>
  );
};

// Grid برای Stats Cards (2 col mobile, 3 tablet, 4 desktop)
export const StatsGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <ResponsiveGrid cols={2} mdCols={3} lgCols={4} gap="sm" className={className}>
      {children}
    </ResponsiveGrid>
  );
};

// Grid برای Profile Tabs
export const ProfileTabsGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <ResponsiveGrid cols={3} mdCols={3} lgCols={3} gap="md" className={className}>
      {children}
    </ResponsiveGrid>
  );
};
