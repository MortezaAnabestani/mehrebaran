"use client";

import React from "react";
import Link from "next/link";
import { SmartButton } from "@/components/ui/SmartButton";

// ===========================
// Types & Interfaces
// ===========================

export interface SuggestedSectionProps {
  title: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
  viewAllLink?: string;
  viewAllText?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  variant?: "horizontal" | "vertical" | "grid";
}

// ===========================
// SuggestedSection Component
// ===========================

/**
 * A reusable section component for displaying suggested/recommended content
 * Supports different layouts and loading states
 */
const SuggestedSection: React.FC<SuggestedSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  viewAllLink,
  viewAllText = "مشاهده همه",
  emptyMessage = "محتوایی برای نمایش وجود ندارد.",
  isLoading = false,
  variant = "horizontal",
}) => {
  const hasContent = React.Children.count(children) > 0;

  // Determine grid layout based on variant
  const getGridClass = (): string => {
    switch (variant) {
      case "vertical":
        return "flex flex-col gap-4";
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
      case "horizontal":
      default:
        return "flex gap-4 overflow-x-auto pb-4 scrollbar-hide";
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>

        {viewAllLink && hasContent && !isLoading && (
          <Link href={viewAllLink}>
            <SmartButton variant="outline" size="sm">
              {viewAllText} ←
            </SmartButton>
          </Link>
        )}
      </div>

      {/* Content */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-mblue border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm">در حال بارگذاری...</p>
            </div>
          </div>
        ) : hasContent ? (
          <div className={getGridClass()}>{children}</div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-400 text-lg">📭</p>
              <p className="text-gray-500 text-sm mt-2">{emptyMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal scroll indicator */}
      {variant === "horizontal" && hasContent && !isLoading && (
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      )}
    </div>
  );
};

export default SuggestedSection;
