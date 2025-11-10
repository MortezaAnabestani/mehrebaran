"use client";

import React, { useState } from "react";
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
 * Provides consistent TopNav, LeftSidebar, and RightSidebar
 * Each route's content will be displayed in the main feed area
 */
const NetworkLayout: React.FC<NetworkLayoutProps> = ({ children }) => {
  const [showCreateNeed, setShowCreateNeed] = useState<boolean>(false);

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
          leftSidebar={<LeftSidebar onCreateNeed={() => setShowCreateNeed(true)} />}
          rightSidebar={<RightSidebar />}
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
