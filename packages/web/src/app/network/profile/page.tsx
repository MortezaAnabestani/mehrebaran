"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import InstagramLayout from "@/components/network/InstagramLayout";
import LeftSidebar from "@/components/network/LeftSidebar";
import RightSidebar from "@/components/network/RightSidebar";
import InstagramProfileHeader from "@/components/network/InstagramProfileHeader";
import StoryHighlights from "@/components/network/StoryHighlights";
import InstagramProfileTabs, { TabType } from "@/components/network/InstagramProfileTabs";
import InstagramProfileGrid from "@/components/network/InstagramProfileGrid";
import { needService } from "@/services/need.service";
import { INeed } from "common-types";

const InstagramProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [needs, setNeeds] = useState<INeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock stats - will be replaced with API
  const stats = {
    posts: needs.length,
    followers: 1234,
    following: 567,
  };

  // Mock highlights
  const highlights = [
    { id: "1", title: "نیازهای اضطراری", coverImage: undefined, storiesCount: 5 },
    { id: "2", title: "پروژه‌های تکمیل شده", coverImage: undefined, storiesCount: 12 },
    { id: "3", title: "همکاری‌ها", coverImage: undefined, storiesCount: 8 },
  ];

  // Fetch user's needs
  useEffect(() => {
    const fetchNeeds = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        // Get all needs and filter by user
        const response = await needService.getNeeds({ limit: 100 });
        // Filter needs created by current user
        const userNeeds = response.data.filter((need) => {
          const creatorId =
            typeof need.createdBy === "string" ? need.createdBy : need.createdBy?._id;
          return creatorId === user._id;
        });
        setNeeds(userNeeds);
      } catch (error) {
        console.error("Failed to fetch user needs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNeeds();
  }, [user]);

  // Get needs based on active tab
  const getTabNeeds = (): INeed[] => {
    switch (activeTab) {
      case "posts":
        return needs;
      case "tagged":
        // TODO: Get needs where user is tagged
        return [];
      case "saved":
        // TODO: Get saved needs
        return [];
      default:
        return needs;
    }
  };

  const handleEditProfile = () => {
    // TODO: Open edit profile modal
    console.log("Edit profile");
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mblue mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <InstagramLayout
        leftSidebar={<LeftSidebar />}
        rightSidebar={<RightSidebar />}
        showLeftSidebar={false}
        showRightSidebar={false}
      >
        <div className="max-w-4xl mx-auto bg-white">
          {/* Profile Header */}
          <InstagramProfileHeader
            user={user}
            stats={stats}
            isOwnProfile={true}
            onEditProfile={handleEditProfile}
          />

          {/* Story Highlights */}
          <StoryHighlights
            highlights={highlights}
            isOwnProfile={true}
            onAddHighlight={() => console.log("Add highlight")}
            onHighlightClick={(id) => console.log("View highlight:", id)}
          />

          {/* Tabs */}
          <InstagramProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOwnProfile={true}
          />

          {/* Grid Content */}
          <div className="min-h-screen">
            <InstagramProfileGrid
              needs={getTabNeeds()}
              isLoading={isLoading}
              emptyMessage={
                activeTab === "posts"
                  ? "هنوز پستی ایجاد نکرده‌اید"
                  : activeTab === "tagged"
                  ? "هیچ پستی شما را تگ نکرده است"
                  : "هیچ پستی ذخیره نکرده‌اید"
              }
            />
          </div>
        </div>
      </InstagramLayout>
    </ProtectedRoute>
  );
};

export default InstagramProfilePage;
