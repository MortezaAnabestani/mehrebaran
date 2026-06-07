"use client";

import React, { useState, lazy, Suspense, useCallback } from "react";
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

// Lazy load heavy modals
const CreateNeedModal = lazy(() => import("@/components/network/CreateNeedModal"));

interface NetworkLayoutProps {
  children: React.ReactNode;
}

export default function NetworkLayoutClient({ children }: NetworkLayoutProps) {
  const pathname = usePathname();
  const [showCreateNeed, setShowCreateNeed] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  // Only show RightSidebar on main feed (/network) and profile pages
  const showRightSidebar = pathname === "/network" || pathname?.startsWith("/network/profile");

  const openCreateNeed = useCallback(() => setShowCreateNeed(true), []);
  const closeCreateNeed = useCallback(() => setShowCreateNeed(false), []);
  const openMobileMenu = useCallback(() => setShowMobileMenu(true), []);
  const closeMobileMenu = useCallback(() => setShowMobileMenu(false), []);

  // Handle need creation
  const handleCreateNeed = useCallback(async (needData: unknown) => {
    try {
      // TODO: Implement API call to create need
      console.log("Creating need with data:", needData);

      // Refresh will be handled by React Query in each page
      setShowCreateNeed(false);
    } catch (err) {
      console.error("Failed to create need:", err);
      throw err;
    }
  }, []);

  return (
    <ProtectedRoute>
      <TopNav onMenuClick={openMobileMenu} />
      <PageTransition>
        <InstagramLayout
          rightSidebar={showRightSidebar ? <RightSidebar /> : undefined}
          leftSidebar={<LeftSidebar onCreateNeed={openCreateNeed} />}
        >
          {children}
        </InstagramLayout>
      </PageTransition>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onCreateClick={openCreateNeed} />

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={showMobileMenu}
        onClose={closeMobileMenu}
        onCreateNeed={() => {
          closeMobileMenu();
          openCreateNeed();
        }}
      />

      {/* Create Need Modal */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {showCreateNeed && (
            <CreateNeedModal
              isOpen={showCreateNeed}
              onClose={closeCreateNeed}
              onSubmit={handleCreateNeed}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </ProtectedRoute>
  );
}
