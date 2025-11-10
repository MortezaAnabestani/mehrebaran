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
 * - Desktop (>= 1024px): All three columns
 */
const InstagramLayout: React.FC<InstagramLayoutProps> = ({
  children,
  leftSidebar,
  rightSidebar,
  showLeftSidebar = true,
  showRightSidebar = true,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex flex-col">
      {/* Main Container */}
      <div className="mx-auto max-w-[1440px] flex-1 w-full">
        <div className="flex gap-2 md:gap-4 lg:gap-4 px-2 md:px-4 h-full items-start">
          {/* Left Sidebar - Navigation (Desktop only: >= 1024px) */}
          {showLeftSidebar && (
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto pt-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {leftSidebar}
            </aside>
          )}

          {/* Main Feed (Always visible, centered on mobile/tablet) */}
          <main className="flex-1 min-w-0 py-4 w-full md:max-w-[630px] lg:max-w-none md:mx-auto lg:mx-0">
            <div className="max-w-[630px] mx-auto lg:mx-0">
              {children}
            </div>
          </main>

          {/* Right Sidebar - Suggestions (Tablet & Desktop: >= 768px) */}
          {showRightSidebar && (
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
