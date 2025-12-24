"use client";

import React, { ReactNode } from "react";

interface InstagramLayoutProps {
  children: ReactNode;
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
}

const InstagramLayout: React.FC<InstagramLayoutProps> = ({
  children,
  leftSidebar,
  rightSidebar,
  showLeftSidebar = true,
  showRightSidebar = true,
}) => {
  const hasLeftSidebar = leftSidebar && showLeftSidebar;
  const hasRightSidebar = rightSidebar && showRightSidebar;

  return (
    <div className="h-full mt-26 md:mt-0 bg-[#eef2f6] p-4 sm:p-6 md:p-12 lg:p-20 flex flex-col font-sans text-slate-700 selection:bg-[#007acc] selection:text-white pb-20 lg:pb-8">
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-gradient-to-br from-white via-transparent to-[#dbe4f0] z-0" />

      <div className="relative z-10 mx-auto max-w-[1480px] flex-1 w-full px-2 sm:px-4 lg:px-8 pb-8">
        <div className="flex gap-4 md:gap-6 lg:gap-8 h-full items-start justify-center">
          {hasLeftSidebar && (
            <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
              <div
                className="h-full w-full overflow-y-auto rounded-3xl bg-[#eef2f6] p-5 
                shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] 
                border border-white/40
                scrollbar-thin scrollbar-thumb-[#007acc]/50 scrollbar-track-transparent hover:scrollbar-thumb-[#007acc]"
              >
                {leftSidebar}
              </div>
            </aside>
          )}

          <main
            className={`flex-1 min-w-0 transition-all duration-300 w-full ${
              hasLeftSidebar ? "md:max-w-[680px] lg:max-w-none" : "max-w-[900px] mx-auto"
            }`}
          >
            <div
              className={`w-full flex flex-col gap-4 sm:gap-6 ${
                !hasLeftSidebar ? "max-w-[700px] mx-auto" : ""
              }`}
            >
              {children}
            </div>
          </main>

          {/* Right Sidebar - Suggestions/Info Panel */}
          {hasRightSidebar && (
            <aside className="hidden xl:block w-80 lg:w-96 flex-shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
              <div
                className="h-full w-full overflow-y-auto rounded-3xl bg-[#eef2f6] p-5
                shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]
                border border-white/40
                scrollbar-thin scrollbar-thumb-[#007acc]/50 scrollbar-track-transparent hover:scrollbar-thumb-[#007acc]"
              >
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
