"use client";

import React, { ReactNode } from "react";

interface InstagramLayoutProps {
  children: ReactNode;
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
}

/**
 * Instagram-Style Layout
 * Responsive Breakpoints:
 * - Mobile (< 768px): Feed only
 * - Tablet (768px - 1024px): Feed + Right Sidebar
 * - Desktop (>= 1024px): All three columns (if leftSidebar provided)
 *
 * Layout Modes:
 * - Three columns: When leftSidebar is provided (home, profile)
 * - Two columns: When leftSidebar is not provided (explore, trending, etc.)
 */
const InstagramLayout: React.FC<InstagramLayoutProps> = ({
  children,
  leftSidebar,
  rightSidebar,
  showLeftSidebar = true,
  showRightSidebar = true,
}) => {
  // Determine if left sidebar should be shown (only if provided and showLeftSidebar is true)
  const hasLeftSidebar = leftSidebar && showLeftSidebar;
  const hasRightSidebar = rightSidebar && showRightSidebar;
  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex flex-col">
      {/* Main Container */}
      <div className="mx-auto max-w-[1440px] flex-1 w-full">
        <div className="flex gap-2 md:gap-4 lg:gap-4 px-2 md:px-4 h-full items-start">
          {/* Left Sidebar - Navigation (Desktop only: >= 1024px) */}
          {hasLeftSidebar && (
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto pt-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {leftSidebar}
            </aside>
          )}

          {/* Main Feed (Always visible, wider when no left sidebar) */}
          <main
            className={`flex-1 min-w-0 py-4 w-full ${
              hasLeftSidebar ? "md:max-w-[630px] lg:max-w-none md:mx-auto lg:mx-0" : "max-w-[900px] mx-auto"
            }`}
          >
            <div className={!hasLeftSidebar ? "max-w-[630px] mx-auto lg:mx-0" : "w-full"}>{children}</div>
          </main>

          {/* Right Sidebar - Suggestions (Tablet & Desktop: >= 768px) */}
          {hasRightSidebar && (
            <aside className="hidden md:block w-72 lg:w-80 flex-shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto pt-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramLayout;
