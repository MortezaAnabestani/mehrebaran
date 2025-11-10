"use client";

import React from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Link from "next/link";

interface ProfileStats {
  posts: number;
  followers: number;
  following: number;
}

interface InstagramProfileHeaderProps {
  user: {
    _id: string;
    name: string;
    email?: string;
    mobile?: string;
    avatar?: string;
    bio?: string;
  };
  stats: ProfileStats;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onEditProfile?: () => void;
}

/**
 * InstagramProfileHeader - Instagram-style Profile Header
 */
const InstagramProfileHeader: React.FC<InstagramProfileHeaderProps> = ({
  user,
  stats,
  isOwnProfile = true,
  isFollowing = false,
  onFollow,
  onEditProfile,
}) => {
  return (
    <div className="px-4 py-8 md:px-12 md:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-1">
              <div className="w-full h-full rounded-full bg-white p-1">
                {user.avatar ? (
                  <OptimizedImage
                    src={user.avatar}
                    alt={user.name}
                    width={160}
                    height={160}
                    className="rounded-full w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-mblue to-cyan-500 flex items-center justify-center text-white text-5xl md:text-6xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {/* Username and Actions */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
              <h1 className="text-xl font-light">{user.name}</h1>

              <div className="flex items-center gap-2">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={onEditProfile}
                      className="px-6 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors"
                    >
                      ویرایش پروفایل
                    </button>
                    <button className="px-6 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors">
                      مشاهده آرشیو
                    </button>
                    <button className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={onFollow}
                      className={`px-8 py-1.5 rounded-lg font-semibold text-sm transition-colors ${
                        isFollowing
                          ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                          : "bg-mblue hover:bg-blue-600 text-white"
                      }`}
                    >
                      {isFollowing ? "دنبال‌شده" : "دنبال کردن"}
                    </button>
                    <button className="px-6 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm transition-colors">
                      پیام
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center md:justify-start gap-8 mb-6">
              <div className="text-center md:text-right">
                <span className="font-semibold">{stats.posts.toLocaleString("fa-IR")}</span>{" "}
                <span className="text-gray-600">پست</span>
              </div>
              <button className="text-center md:text-right hover:opacity-70">
                <span className="font-semibold">{stats.followers.toLocaleString("fa-IR")}</span>{" "}
                <span className="text-gray-600">دنبال‌کننده</span>
              </button>
              <button className="text-center md:text-right hover:opacity-70">
                <span className="font-semibold">{stats.following.toLocaleString("fa-IR")}</span>{" "}
                <span className="text-gray-600">دنبال‌شونده</span>
              </button>
            </div>

            {/* Bio */}
            <div className="text-sm text-center md:text-right">
              <p className="font-semibold mb-1">{user.name}</p>
              {user.bio && (
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">{user.bio}</p>
              )}
              {(user.email || user.mobile) && (
                <p className="text-gray-500 mt-1">{user.email || user.mobile}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramProfileHeader;
