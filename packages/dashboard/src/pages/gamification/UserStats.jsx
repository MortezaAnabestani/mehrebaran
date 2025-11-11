import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserStats, fetchMyBadges } from "../../features/gamificationSlice";
import { Card, Typography, Avatar, Chip, Progress } from "@material-tailwind/react";
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  ChartBarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const UserStats = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { userStats, myBadges, loading } = useSelector((state) => state.gamification);

  // بارگذاری آمار کاربر
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        await dispatch(fetchUserStats(userId)).unwrap();
        if (!userId) {
          // اگر userId نداریم، نشان‌های خود کاربر را می‌گیریم
          await dispatch(fetchMyBadges()).unwrap();
        }
      } catch (error) {
        console.error("خطا در بارگذاری آمار کاربر:", error);
      }
    };

    loadUserStats();
  }, [dispatch, userId]);

  // تبدیل rarity به فارسی
  const getRarityLabel = (rarity) => {
    const rarityMap = {
      common: "معمولی",
      rare: "نادر",
      epic: "حماسی",
      legendary: "افسانه‌ای",
    };
    return rarityMap[rarity] || rarity;
  };

  // رنگ chip برای rarity
  const getRarityColor = (rarity) => {
    const colorMap = {
      common: "gray",
      rare: "blue",
      epic: "purple",
      legendary: "orange",
    };
    return colorMap[rarity] || "gray";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <Typography variant="h5" color="red">
            آمار کاربر یافت نشد
          </Typography>
        </Card>
      </div>
    );
  }

  const levelProgress = userStats.pointsToNextLevel
    ? ((userStats.currentLevelPoints / userStats.pointsToNextLevel) * 100).toFixed(0)
    : 0;

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-center gap-6">
            <Avatar
              src={userStats.user?.profilePicture || "/assets/images/default-avatar.png"}
              alt={userStats.user?.name || "کاربر"}
              size="xxl"
              className="border-4 border-blue-500"
            />
            <div className="flex-1">
              <Typography variant="h3" color="blue-gray">
                {userStats.user?.name || "کاربر"}
              </Typography>
              <Typography variant="h6" color="gray" className="mb-4">
                @{userStats.user?.username || "username"}
              </Typography>

              {/* Level & Progress */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <Typography variant="small" color="blue-gray">
                    سطح {userStats.level || 1}
                  </Typography>
                  <Typography variant="small" color="gray">
                    {userStats.currentLevelPoints || 0} / {userStats.pointsToNextLevel || 0}
                  </Typography>
                </div>
                <Progress value={levelProgress} color="blue" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <StarIcon className="w-6 h-6 mx-auto text-yellow-500 mb-1" />
                  <Typography variant="h5" color="blue-gray">
                    {userStats.totalPoints || 0}
                  </Typography>
                  <Typography variant="small" color="gray">
                    امتیاز کل
                  </Typography>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <TrophyIcon className="w-6 h-6 mx-auto text-purple-500 mb-1" />
                  <Typography variant="h5" color="blue-gray">
                    {userStats.badges?.length || 0}
                  </Typography>
                  <Typography variant="small" color="gray">
                    نشان‌ها
                  </Typography>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <FireIcon className="w-6 h-6 mx-auto text-orange-500 mb-1" />
                  <Typography variant="h5" color="blue-gray">
                    {userStats.currentStreak || 0}
                  </Typography>
                  <Typography variant="small" color="gray">
                    روز پیاپی
                  </Typography>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <ChartBarIcon className="w-6 h-6 mx-auto text-green-500 mb-1" />
                  <Typography variant="h5" color="blue-gray">
                    #{userStats.rank || "-"}
                  </Typography>
                  <Typography variant="small" color="gray">
                    رتبه
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Points Breakdown */}
        {userStats.pointsBreakdown && (
          <Card className="p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              تفکیک امتیازات
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(userStats.pointsBreakdown).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <Typography variant="small" color="gray">
                    {key === "needsCreated" && "نیازهای ایجاد شده"}
                    {key === "needsSupported" && "نیازهای حمایت شده"}
                    {key === "teamsJoined" && "تیم‌های پیوسته"}
                    {key === "tasksCompleted" && "وظایف تکمیل شده"}
                    {key === "commentsPosted" && "نظرات ارسالی"}
                    {key === "storiesShared" && "داستان‌های به اشتراک گذاشته"}
                  </Typography>
                  <Typography variant="h6" color="blue-gray">
                    {value} امتیاز
                  </Typography>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Badges */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h5" color="blue-gray">
              نشان‌های کسب شده
            </Typography>
            <Typography variant="small" color="gray">
              {myBadges?.length || 0} نشان
            </Typography>
          </div>

          {myBadges && Array.isArray(myBadges) && myBadges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {myBadges.map((userBadge) => (
                <div
                  key={userBadge._id}
                  className="bg-gradient-to-b from-gray-50 to-white p-4 rounded-lg text-center hover:shadow-lg transition-shadow"
                  style={{ borderTop: `3px solid ${userBadge.badge?.color || "#3B82F6"}` }}
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-2"
                    style={{ backgroundColor: userBadge.badge?.color || "#3B82F6" }}
                  >
                    {userBadge.badge?.icon || "🏆"}
                  </div>
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    {userBadge.badge?.name || "نشان"}
                  </Typography>
                  <Chip
                    value={getRarityLabel(userBadge.badge?.rarity)}
                    color={getRarityColor(userBadge.badge?.rarity)}
                    size="sm"
                    className="mt-2"
                  />
                  {userBadge.earnedAt && (
                    <Typography variant="small" color="gray" className="mt-1">
                      {new Date(userBadge.earnedAt).toLocaleDateString("fa-IR")}
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <TrophyIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <Typography variant="h6" color="gray">
                هنوز نشانی کسب نشده است
              </Typography>
            </div>
          )}
        </Card>

        {/* Activity Timeline */}
        {userStats.recentActivities && userStats.recentActivities.length > 0 && (
          <Card className="p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              فعالیت‌های اخیر
            </Typography>
            <div className="space-y-3">
              {userStats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <Typography variant="small" color="blue-gray">
                      {activity.description}
                    </Typography>
                    <Typography variant="small" color="gray">
                      {new Date(activity.createdAt).toLocaleDateString("fa-IR")}
                    </Typography>
                  </div>
                  {activity.points && (
                    <Chip value={`+${activity.points}`} color="green" size="sm" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserStats;
