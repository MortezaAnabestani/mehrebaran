"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import SuggestedSection from "@/components/discovery/SuggestedSection";
import NeedCard from "@/components/network/NeedCard";
import UserCard from "@/components/social/UserCard";
import TeamCard from "@/components/network/TeamCard";
import discoveryService from "@/services/discovery.service";
import type { INeed } from "common-types";
import type { IUser } from "common-types";
import type { ITeam } from "common-types";

const ExplorePage: React.FC = () => {
  const router = useRouter();

  // State
  const [recommendedNeeds, setRecommendedNeeds] = useState<INeed[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<IUser[]>([]);
  const [recommendedTeams, setRecommendedTeams] = useState<ITeam[]>([]);

  const [isLoadingRecommended, setIsLoadingRecommended] = useState<boolean>(true);

  // ===========================
  // Data Fetching
  // ===========================

  const fetchRecommendedContent = async () => {
    try {
      setIsLoadingRecommended(true);
      const data = await discoveryService.getAllRecommendations(6);
      setRecommendedNeeds(data.needs);
      setRecommendedUsers(data.users);
      setRecommendedTeams(data.teams);
    } catch (error) {
      console.error("Error fetching recommended content:", error);
    } finally {
      setIsLoadingRecommended(false);
    }
  };

  useEffect(() => {
    fetchRecommendedContent();
  }, []);

  // ===========================
  // Event Handlers
  // ===========================

  const handleNeedUpdate = () => {
    fetchRecommendedContent();
  };

  const handleUserFollowChange = () => {
    fetchRecommendedContent();
  };

  // ===========================
  // Render
  // ===========================

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 اکتشاف و پیشنهادات</h1>
            <p className="text-gray-600">محتوای پیشنهادی برای شما</p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Recommended Needs */}
            <SuggestedSection
              title="نیازهای پیشنهادی"
              subtitle="نیازهایی که ممکن است به آن‌ها علاقه‌مند باشید"
              icon="🎯"
              viewAllLink="/network"
              viewAllText="مشاهده همه نیازها"
              isLoading={isLoadingRecommended}
              emptyMessage="در حال حاضر نیازی برای پیشنهاد وجود ندارد."
              variant="horizontal"
            >
              {recommendedNeeds.map((need) => (
                <div key={need._id} className="min-w-[320px]">
                  <NeedCard need={need} variant="feed" onUpdate={handleNeedUpdate} />
                </div>
              ))}
            </SuggestedSection>

            {/* Recommended Users */}
            <SuggestedSection
              title="کاربران پیشنهادی"
              subtitle="کاربرانی که ممکن است بخواهید دنبال کنید"
              icon="👥"
              viewAllLink="/network/users"
              viewAllText="مشاهده همه کاربران"
              isLoading={isLoadingRecommended}
              emptyMessage="در حال حاضر کاربری برای پیشنهاد وجود ندارد."
              variant="grid"
            >
              {recommendedUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  variant="card"
                  showFollowButton={true}
                  onFollowChange={handleUserFollowChange}
                />
              ))}
            </SuggestedSection>

            {/* Recommended Teams */}
            <SuggestedSection
              title="تیم‌های پیشنهادی"
              subtitle="تیم‌هایی که ممکن است به آن‌ها بپیوندید"
              icon="🏆"
              viewAllLink="/network/teams"
              viewAllText="مشاهده همه تیم‌ها"
              isLoading={isLoadingRecommended}
              emptyMessage="در حال حاضر تیمی برای پیشنهاد وجود ندارد."
              variant="grid"
            >
              {recommendedTeams.map((team) => (
                <TeamCard key={team._id} team={team} variant="card" />
              ))}
            </SuggestedSection>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ExplorePage;
