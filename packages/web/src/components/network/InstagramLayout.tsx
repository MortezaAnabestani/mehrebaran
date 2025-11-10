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
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="mx-auto max-w-[1440px]">
        <div className="flex gap-4 px-0 lg:px-4">
          {/* Left Sidebar - Navigation */}
          {showLeftSidebar && (
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
              <div className="fixed top-0 w-64 xl:w-72 h-screen overflow-y-auto pt-8 pb-6">
                {leftSidebar}
              </div>
            </aside>
          )}

          {/* Main Feed */}
          <main className="flex-1 min-w-0">
            <div className="max-w-[630px] mx-auto">
              {children}
            </div>
          </main>

          {/* Right Sidebar - Suggestions */}
          {showRightSidebar && (
            <aside className="hidden xl:block w-80 flex-shrink-0">
              <div className="fixed top-0 w-80 h-screen overflow-y-auto pt-8 pb-6">
                {rightSidebar}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramLayout;
