"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import InstagramLayout from "@/components/network/InstagramLayout";
import LeftSidebar from "@/components/network/LeftSidebar";
import RightSidebar from "@/components/network/RightSidebar";
import NeedCard from "@/components/network/NeedCard";
import { needService, GetNeedsParams } from "@/services/need.service";
import { INeed } from "common-types";

const NetworkPage: React.FC = () => {
  // State
  const [needs, setNeeds] = useState<INeed[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // دریافت لیست نیازها
  const fetchNeeds = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await needService.getNeeds({ limit: 20 });
      setNeeds(response.data);
    } catch (err: any) {
      console.error("Failed to fetch needs:", err);
      setError(err.message || "خطا در دریافت نیازها");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  return (
    <ProtectedRoute>
      <InstagramLayout
        leftSidebar={<LeftSidebar />}
        rightSidebar={<RightSidebar />}
      >
        {/* Stories Section - Coming Soon */}
        <div className="mb-6 pt-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex gap-4 overflow-x-auto">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl cursor-pointer">
                  +
                </div>
                <span className="text-xs">استوری شما</span>
              </div>

              {/* Placeholder stories */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-0.5 cursor-pointer">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-lg">
                      👤
                    </div>
                  </div>
                  <span className="text-xs">کاربر {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {isLoading ? (
            // Loading State
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 border-4 border-mblue border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">در حال بارگذاری...</p>
              </div>
            </div>
          ) : error ? (
            // Error State
            <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : needs.length === 0 ? (
            // Empty State
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">هیچ نیازی یافت نشد</h3>
              <p className="text-gray-500">اولین نیاز را شما ایجاد کنید!</p>
            </div>
          ) : (
            // Needs List
            needs.map((need) => (
              <div key={need._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <NeedCard need={need} variant="feed" onUpdate={fetchNeeds} />
              </div>
            ))
          )}
        </div>
      </InstagramLayout>
    </ProtectedRoute>
  );
};

export default NetworkPage;
