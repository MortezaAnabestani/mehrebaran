"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right";
  children?: React.ReactNode;
  title?: string;
}

/**
 * Mobile Drawer Component
 * Slides in from left or right with backdrop
 * Used for showing LeftSidebar/RightSidebar on mobile
 */
const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  side = "left",
  children,
  title,
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const slideDirection = side === "left" ? -100 : 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: `${slideDirection}%` }}
            animate={{ x: 0 }}
            exit={{ x: `${slideDirection}%` }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`
              lg:hidden fixed top-0 ${side === "left" ? "left-0" : "right-0"} bottom-0 z-[70]
              w-[85vw] max-w-sm
              bg-[#eef2f6]
              shadow-[0_0_50px_rgba(0,0,0,0.3)]
              overflow-y-auto
              overscroll-contain
            `}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {title || (side === "left" ? "منوی اصلی" : "اطلاعات")}
              </h2>
              <button
                onClick={onClose}
                className="
                  w-9 h-9 rounded-xl bg-gray-100 text-gray-600
                  flex items-center justify-center
                  hover:bg-gray-200 active:scale-95
                  transition-all duration-200
                "
                aria-label="بستن"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;

/**
 * Preset Drawer for Left Sidebar (Navigation)
 */
export const MobileNavDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreateNeed?: () => void;
}> = ({ isOpen, onClose, onCreateNeed }) => {
  return (
    <MobileDrawer isOpen={isOpen} onClose={onClose} side="left" title="منوی اصلی">
      <LeftSidebar onCreateNeed={onCreateNeed} />
    </MobileDrawer>
  );
};

/**
 * Preset Drawer for Right Sidebar (Suggestions, etc.)
 */
export const MobileInfoDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <MobileDrawer isOpen={isOpen} onClose={onClose} side="right" title="اطلاعات">
      <RightSidebar />
    </MobileDrawer>
  );
};
