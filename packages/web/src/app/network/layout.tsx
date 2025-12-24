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
import MobileBottomNav from "@/components/network/MobileBottomNav";
import { MobileNavDrawer } from "@/components/network/MobileDrawer";
import { lazy, Suspense } from "react";

// Lazy load heavy modals
const CreateNeedModal = lazy(() => import("@/components/network/CreateNeedModal"));

interface NetworkLayoutProps {
  children: React.ReactNode;
}

const NetworkLayout: React.FC<NetworkLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [showCreateNeed, setShowCreateNeed] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  // Only show RightSidebar on main feed (/network) and profile pages
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
      <TopNav onMenuClick={() => setShowMobileMenu(true)} />
      <PageTransition>
        <InstagramLayout
          rightSidebar={showRightSidebar ? <RightSidebar /> : undefined}
          leftSidebar={<LeftSidebar onCreateNeed={() => setShowCreateNeed(true)} />}
        >
          {children}
        </InstagramLayout>
      </PageTransition>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onCreateClick={() => setShowCreateNeed(true)} />

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onCreateNeed={() => {
          setShowMobileMenu(false);
          setShowCreateNeed(true);
        }}
      />

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
