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
 * Three-column layout: Left Sidebar | Main Feed | Right Sidebar
 * Responsive: Mobile (1 col), Tablet (2 col), Desktop (3 col)
 */
const InstagramLayout: React.FC<InstagramLayoutProps> = ({
  children,
  leftSidebar,
  rightSidebar,
  showLeftSidebar = true,
  showRightSidebar = true,
}) => {
  return (
    <div className="h-screen bg-gray-50 pt-16 overflow-hidden">
      {/* Main Container */}
      <div className="mx-auto max-w-[1440px] h-[calc(100vh-160px)]">
        <div className="flex gap-4 px-0 lg:px-4 h-full items-start">
          {/* Left Sidebar - Navigation */}
          {showLeftSidebar && (
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 h-full overflow-y-auto pt-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {leftSidebar}
            </aside>
          )}

          {/* Main Feed */}
          <main className="flex-1 min-w-0 h-full overflow-y-auto pt-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="max-w-[630px] mx-auto">
              {children}
            </div>
          </main>

          {/* Right Sidebar - Suggestions */}
          {showRightSidebar && (
            <aside className="hidden xl:block w-80 flex-shrink-0 h-full overflow-y-auto pt-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramLayout;
