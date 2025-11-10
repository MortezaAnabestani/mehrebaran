"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import TopNav from "@/components/network/TopNav";
import InstagramLayout from "@/components/network/InstagramLayout";
import LeftSidebar from "@/components/network/LeftSidebar";
import RightSidebar from "@/components/network/RightSidebar";
import StoriesCarousel from "@/components/network/StoriesCarousel";
import CreateStoryModal from "@/components/network/CreateStoryModal";
import CreateNeedModal from "@/components/network/CreateNeedModal";
import InstagramNeedCard from "@/components/network/InstagramNeedCard";
import { needService, GetNeedsParams } from "@/services/need.service";
import { INeed } from "common-types";
import { useAuth } from "@/contexts/AuthContext";

const NetworkPage: React.FC = () => {
  // State
  const { user } = useAuth();
  const [needs, setNeeds] = useState<INeed[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateStory, setShowCreateStory] = useState<boolean>(false);
  const [showCreateNeed, setShowCreateNeed] = useState<boolean>(false);

  // Mock Stories Data - Will be replaced with API call
  const mockStoryGroups = [
    {
      userId: "1",
      userName: "علی محمدی",
      userAvatar: undefined,
      hasNew: true,
      stories: [
        {
          id: "1",
          userId: "1",
          userName: "علی محمدی",
          userAvatar: undefined,
          mediaUrl: "https://picsum.photos/500/800?random=1",
          mediaType: "image" as const,
          createdAt: new Date().toISOString(),
          duration: 5,
        },
        {
          id: "2",
          userId: "1",
          userName: "علی محمدی",
          userAvatar: undefined,
          mediaUrl: "https://picsum.photos/500/800?random=2",
          mediaType: "image" as const,
          createdAt: new Date().toISOString(),
          duration: 5,
        },
      ],
    },
    {
      userId: "2",
      userName: "زهرا احمدی",
      userAvatar: undefined,
      hasNew: true,
      stories: [
        {
          id: "3",
          userId: "2",
          userName: "زهرا احمدی",
          userAvatar: undefined,
          mediaUrl: "https://picsum.photos/500/800?random=3",
          mediaType: "image" as const,
          createdAt: new Date().toISOString(),
          duration: 5,
        },
      ],
    },
    {
      userId: "3",
      userName: "محمد رضایی",
      userAvatar: undefined,
      hasNew: false,
      stories: [
        {
          id: "4",
          userId: "3",
          userName: "محمد رضایی",
          userAvatar: undefined,
          mediaUrl: "https://picsum.photos/500/800?random=4",
          mediaType: "image" as const,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          duration: 5,
        },
      ],
    },
  ];

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

  // Handle story creation
  const handleCreateStory = async (file: File) => {
    try {
      // TODO: Implement API call to upload story
      console.log("Creating story with file:", file);

      // Mock success for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refresh stories list
      // await fetchStories();
    } catch (err) {
      console.error("Failed to create story:", err);
      throw err;
    }
  };

  // Handle need creation
  const handleCreateNeed = async (needData: any) => {
    try {
      // TODO: Implement API call to create need
      console.log("Creating need with data:", needData);

      // Refresh needs list after creation
      await fetchNeeds();
    } catch (err) {
      console.error("Failed to create need:", err);
      throw err;
    }
  };

  return (
    <ProtectedRoute>
      <TopNav />
      <InstagramLayout
        leftSidebar={<LeftSidebar onCreateNeed={() => setShowCreateNeed(true)} />}
        rightSidebar={<RightSidebar />}
      >
        {/* Stories Section */}
        <div className="mb-6">
          <StoriesCarousel
            storyGroups={mockStoryGroups}
            currentUserId={user?._id}
            onCreateStory={() => setShowCreateStory(true)}
          />
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
              <InstagramNeedCard key={need._id} need={need} onUpdate={fetchNeeds} />
            ))
          )}
        </div>

        {/* Create Story Modal */}
        <CreateStoryModal
          isOpen={showCreateStory}
          onClose={() => setShowCreateStory(false)}
          onSubmit={handleCreateStory}
        />

        {/* Create Need Modal */}
        <CreateNeedModal
          isOpen={showCreateNeed}
          onClose={() => setShowCreateNeed(false)}
          onSubmit={handleCreateNeed}
        />
      </InstagramLayout>
    </ProtectedRoute>
  );
};

export default NetworkPage;
