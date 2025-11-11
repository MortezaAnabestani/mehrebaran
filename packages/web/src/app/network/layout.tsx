"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PageTransition from "@/components/ui/PageTransition";
import TopNav from "@/components/network/TopNav";
import InstagramLayout from "@/components/network/InstagramLayout";
import LeftSidebar from "@/components/network/LeftSidebar";
import RightSidebar from "@/components/network/RightSidebar";
import { lazy, Suspense } from "react";

// Lazy load heavy modals
const CreateNeedModal = lazy(() => import("@/components/network/CreateNeedModal"));

interface NetworkLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared Layout for all /network routes
 * Provides consistent TopNav and RightSidebar
 * LeftSidebar only shows on /network (home) and /network/profile
 * Other routes are two-column (content + right sidebar)
 */
const NetworkLayout: React.FC<NetworkLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [showCreateNeed, setShowCreateNeed] = useState<boolean>(false);

  // Only show LeftSidebar on main feed (/network) and profile pages
  const showRightSidebar = pathname === "/network" || pathname?.startsWith("/network/profile");

  // Handle need creation
  const handleCreateNeed = async (needData: any) => {
    try {
      // TODO: Implement API call to create need
      console.log("Creating need with data:", needData);

      // Refresh will be handled by React Query in each page
      setShowCreateNeed(false);
    } catch (err) {
      console.error("Failed to create need:", err);
      throw err;
    }
  };

  return (
    <ProtectedRoute>
      <TopNav />
      <PageTransition>
        <InstagramLayout
          rightSidebar={showRightSidebar ? <RightSidebar /> : undefined}
          leftSidebar={<LeftSidebar onCreateNeed={() => setShowCreateNeed(true)} />}
        >
          {/* Dynamic content from each route */}
          {children}
        </InstagramLayout>
      </PageTransition>

      {/* Create Need Modal */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {showCreateNeed && (
            <CreateNeedModal
              isOpen={showCreateNeed}
              onClose={() => setShowCreateNeed(false)}
              onSubmit={handleCreateNeed}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </ProtectedRoute>
  );
};

export default NetworkLayout;
