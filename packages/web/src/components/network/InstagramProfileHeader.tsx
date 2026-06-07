import React from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";

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
 * InstagramProfileHeader - Skeuomorphic & Premium Design
 * Primary Color: #007acc
 */
const InstagramProfileHeader: React.FC<InstagramProfileHeaderProps> = ({
  user,
  stats,
  isOwnProfile = true,
  isFollowing = false,
  onFollow,
  onEditProfile,
}) => {
  // استایل‌های مشترک برای دکمه‌های اسکیومورفیک ثانویه (طوسی)
  const secondaryBtnClass =
    "px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 " +
    "bg-gradient-to-b from-gray-50 to-gray-200 " + // گرادینت برای حجم
    "text-gray-700 border border-gray-300 " + // بوردر برای لبه‌ها
    "shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] " + // سایه بیرونی و هایلایت داخلی
    "hover:from-gray-100 hover:to-gray-300 hover:shadow-[0_4px_6px_rgba(0,0,0,0.08)] " + // هاور
    "active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] active:translate-y-[1px]"; // حالت فشرده شدن

  // استایل دکمه اصلی (آبی برند)
  const primaryBtnClass =
    "px-4 py-1.5 sm:px-6 sm:py-2 md:px-8 md:py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 " +
    "bg-gradient-to-b from-[#3395ff] to-[#007acc] " + // گرادینت آبی برند
    "text-white border border-[#005fa3] " +
    "shadow-[0_4px_10px_rgba(0,122,204,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] " + // درخشش و سایه رنگی
    "hover:brightness-110 " +
    "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)] active:translate-y-[1px]";

  return (
    <div className="w-full bg-[#f8f9fa] min-h-[240px] sm:min-h-[280px] md:min-h-[300px] flex items-center justify-center">
      {/* Container اصلی با کمی فاصله و پس‌زمینه تمیز */}
      <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
          {/* --- Avatar Section (Skeuomorphic Look) --- */}
          <div className="relative group">
            {/* حلقه دور آواتار با حالت فلزی/براق */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full p-1 sm:p-1.5 bg-gradient-to-br from-gray-200 via-white to-gray-300 shadow-[5px_5px_15px_rgba(0,0,0,0.1),-5px_-5px_15px_rgba(255,255,255,0.8)]">
              <div className="w-full h-full rounded-full p-0.5 sm:p-1 bg-white shadow-inner relative overflow-hidden">
                {user.avatar ? (
                  <OptimizedImage
                    src={user.avatar}
                    alt={user.name}
                    width={176}
                    height={176}
                    className="rounded-full w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#007acc] to-[#005fa3] flex items-center justify-center text-white text-3xl sm:text-4xl md:text-6xl font-bold shadow-[inset_0_-4px_6px_rgba(0,0,0,0.2)]">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 border-2 sm:border-3 md:border-4 border-[#f8f9fa] rounded-full shadow-md"></div>
          </div>

          {/* --- Profile Info Section --- */}
          <div className="flex-1 w-full text-center md:text-right">
            {/* Header: Username & Actions */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6 md:mb-8">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 tracking-tight drop-shadow-sm">
                {user.name}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
                {isOwnProfile ? (
                  <>
                    <button onClick={onEditProfile} className={secondaryBtnClass}>
                      ویرایش پروفایل
                    </button>
                    <button className={secondaryBtnClass}>آرشیو</button>
                    <button className={`${secondaryBtnClass} !px-2 sm:!px-2.5 md:!px-3`}>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={onFollow} className={isFollowing ? secondaryBtnClass : primaryBtnClass}>
                      {isFollowing ? "دنبال‌شده" : "دنبال کردن"}
                    </button>
                    <button className={secondaryBtnClass}>پیام</button>
                  </>
                )}
              </div>
            </div>

            {/* Stats Box - Card Style */}
            <div className="flex items-center justify-center bg-white rounded-xl md:rounded-2xl p-1.5 sm:p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100 mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4 md:gap-6 mx-auto">
              <div className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 text-center border-l border-gray-100 last:border-0">
                <span className="block font-bold text-sm sm:text-base md:text-lg text-gray-900">
                  {stats.posts.toLocaleString("fa-IR")}
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium">پست</span>
              </div>
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 text-center border-l border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="block font-bold text-sm sm:text-base md:text-lg text-gray-900">
                  {stats.followers.toLocaleString("fa-IR")}
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium">دنبال‌کننده</span>
              </button>
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 text-center hover:bg-gray-50 rounded-lg transition-colors">
                <span className="block font-bold text-sm sm:text-base md:text-lg text-gray-900">
                  {stats.following.toLocaleString("fa-IR")}
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium">دنبال‌شونده</span>
              </button>
            </div>

            {/* Bio Section */}
            <div className="text-xs sm:text-sm md:text-base text-center max-w-2xl">
              <p className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg">
                {user.name}
              </p>

              {user.bio && (
                <div className="relative p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm mb-2 sm:mb-3 text-right">
                  <p className="whitespace-pre-line text-gray-700 leading-5 sm:leading-6 md:leading-7 text-xs sm:text-sm md:text-base">
                    {user.bio}
                  </p>
                  {/* Decorative quote mark */}
                  <div className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 text-2xl sm:text-3xl md:text-4xl text-gray-100 font-serif">
                    &quot;
                  </div>
                </div>
              )}

              {(user.email || user.mobile) && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[#007acc] font-medium mt-1.5 sm:mt-2">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <a
                    href="#"
                    className="hover:underline decoration-[#007acc]/30 underline-offset-4 text-xs sm:text-sm md:text-base"
                  >
                    {user.email || user.mobile}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramProfileHeader;
