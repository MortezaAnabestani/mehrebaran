"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // پیشنهاد می‌شود نصب کنید: npm i framer-motion
import SuggestedSection from "@/components/discovery/SuggestedSection";
import NeedCard from "@/components/network/NeedCard";
import UserCard from "@/components/social/UserCard";
import TeamCard from "@/components/network/TeamCard";
import discoveryService from "@/services/discovery.service";
import type { INeed, IUser, ITeam } from "common-types";
import OptimizedImage from "@/components/ui/OptimizedImage";

// آیکون‌ها برای زیبایی بصری (می‌توانید از lucide-react یا heroicons استفاده کنید)
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ExplorePage: React.FC = () => {
  // State
  const [recommendedNeeds, setRecommendedNeeds] = useState<INeed[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<IUser[]>([]);
  const [recommendedTeams, setRecommendedTeams] = useState<ITeam[]>([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState<boolean>(true);

  // Data Fetching
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

  // Handlers
  const handleNeedUpdate = () => fetchRecommendedContent();
  const handleUserFollowChange = () => fetchRecommendedContent();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 50 } },
  };

  return (
    <div className="min-h-screen bg-[#eef2f5] text-gray-700 pb-20">
      <div className="relative pt-8 pb-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Title Block */}
            <div className="text-right w-full md:w-auto">
              <h1 className="text-3xl md:text-4xl font-black text-[#007acc] drop-shadow-sm mb-2 tracking-tight">
                کاوش در شبکه مهر
              </h1>
              <p className="text-gray-500 font-medium text-sm md:text-base">
                دنیایی از فرصت‌ها و ارتباطات جدید را کشف کنید
              </p>
            </div>

            {/* Search Bar - Skeuomorphic Inset Style 
                استایل: فرورفته (Inset) برای القای حس ورودی
            */}
            <div className="w-full md:w-96">
              <div className="relative flex items-center w-full h-12 rounded-full bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] transition-all focus-within:shadow-[inset_2px_2px_5px_#bebebe,inset_-2px_-2px_5px_#ffffff]">
                <div className="grid place-items-center h-full w-12 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  className="peer h-full w-full outline-none text-sm text-gray-700 bg-transparent pl-4 placeholder-gray-400 font-medium"
                  type="text"
                  id="search"
                  placeholder="جستجو در نیازها، افراد و تیم‌ها..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div
        className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 1. Recommended Needs Section */}
        <motion.section variants={itemVariants} className="relative">
          {/* Skeuomorphic Panel Container */}
          <div className="rounded-3xl bg-[#eef2f6] p-6 md:p-8 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
            <div className="mb-6 border-b border-gray-300/50 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <OptimizedImage
                  src="/icons/goal.svg"
                  alt="Goal Icon"
                  width={30}
                  height={30}
                  className="inline-block"
                />
                <h2 className="text-xl font-bold text-gray-700">نیازهای پیشنهادی</h2>
              </div>
            </div>

            {/* Content Wrapper */}
            <div className="overflow-x-auto pb-2 -mx-2 scrollbar-hide">
              <SuggestedSection
                title="" // Title handled by custom header above
                subtitle=""
                icon=""
                viewAllLink="/network"
                viewAllText="مشاهده همه"
                isLoading={isLoadingRecommended}
                emptyMessage="در حال حاضر نیازی برای پیشنهاد وجود ندارد."
                variant="horizontal"
              >
                {recommendedNeeds.map((need) => (
                  <div key={need._id} className="min-w-[300px] md:min-w-[340px] p-2">
                    {/* Card Wrapper for extra depth if needed */}
                    <div className="h-full transition-transform hover:-translate-y-1 duration-300">
                      <NeedCard need={need} variant="feed" onUpdate={handleNeedUpdate} />
                    </div>
                  </div>
                ))}
              </SuggestedSection>
            </div>
          </div>
        </motion.section>

        {/* 2. Recommended Users Section */}
        <motion.section variants={itemVariants}>
          <div className="rounded-3xl bg-[#eef2f6] p-6 md:p-8 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
            <div className="mb-6 border-b border-gray-300/50 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <OptimizedImage src="/icons/user.svg" width={30} height={30} alt="user icon" />

                <h2 className="text-xl font-bold text-gray-700">کاربران پیشنهادی</h2>
              </div>
            </div>

            <SuggestedSection
              title=""
              subtitle=""
              icon=""
              viewAllLink="/network/users"
              viewAllText="مشاهده همه"
              isLoading={isLoadingRecommended}
              emptyMessage="در حال حاضر کاربری برای پیشنهاد وجود ندارد."
              variant="grid"
            >
              {recommendedUsers.map((user) => (
                <div key={user._id} className="transform transition-all hover:scale-[1.02]">
                  <UserCard user={user} variant="card" onFollowChange={handleUserFollowChange} />
                </div>
              ))}
            </SuggestedSection>
          </div>
        </motion.section>

        {/* 3. Recommended Teams Section */}
        <motion.section variants={itemVariants}>
          <div className="rounded-3xl bg-[#eef2f6] p-6 md:p-8 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] mb-12">
            <div className="mb-6 border-b border-gray-300/50 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <OptimizedImage src="/icons/cup.svg" width={30} height={30} alt="cup icon" />
                <h2 className="text-xl font-bold text-gray-700">تیم‌های برتر</h2>
              </div>
            </div>

            <SuggestedSection
              title=""
              subtitle=""
              icon=""
              viewAllLink="/network/teams"
              viewAllText="مشاهده همه"
              isLoading={isLoadingRecommended}
              emptyMessage="در حال حاضر تیمی برای پیشنهاد وجود ندارد."
              variant="grid"
            >
              {recommendedTeams.map((team) => (
                <div key={team._id} className="transform transition-all hover:scale-[1.02]">
                  <TeamCard team={team} variant="card" />
                </div>
              ))}
            </SuggestedSection>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default ExplorePage;
