"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute - محافظت از صفحات که نیاز به احراز هویت دارند
 *
 * استفاده:
 * <ProtectedRoute>
 *   <YourComponent />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // در حال بارگذاری
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mblue mx-auto mb-4"></div>
          <p className="text-mgray">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // احراز هویت نشده
  if (!isAuthenticated) {
    return null;
  }

  // احراز هویت شده - نمایش محتوا
  return <>{children}</>;
};
